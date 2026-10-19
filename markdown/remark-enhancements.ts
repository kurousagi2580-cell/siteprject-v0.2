import GithubSlugger from "github-slugger"
import { visit } from "unist-util-visit"
import type { Element, Root as HastRoot } from "hast"
import type { Root as MdastRoot } from "mdast"
import type { Parent } from "unist"

type MarkdownNode = {
  type: string
  value?: string
  depth?: number
  children?: MarkdownNode[]
  data?: {
    hName?: string
    hProperties?: Record<string, string | string[]>
  }
}

function plainText(node: MarkdownNode): string {
  if (typeof node.value === "string") return node.value
  if (node.type === "break") return "\n"
  return (node.children ?? []).map(plainText).join("")
}

function clipInlineNodes(nodes: MarkdownNode[], start: number, end: number): MarkdownNode[] {
  const clipped: MarkdownNode[] = []
  let offset = 0

  for (const node of nodes) {
    const text = plainText(node)
    const nodeStart = offset
    const nodeEnd = offset + text.length
    offset = nodeEnd

    const from = Math.max(start, nodeStart)
    const to = Math.min(end, nodeEnd)
    if (from >= to) continue

    if (typeof node.value === "string") {
      clipped.push({ ...node, value: node.value.slice(from - nodeStart, to - nodeStart) })
    } else if (node.type === "break") {
      clipped.push(node)
    } else if (node.children) {
      clipped.push({
        ...node,
        children: clipInlineNodes(node.children, from - nodeStart, to - nodeStart),
      })
    }
  }

  return clipped
}

function inlineNode(tagName: string, property: string | undefined, value: string | undefined, text: string): MarkdownNode {
  return {
    type: "enhancedInline",
    data: {
      hName: tagName,
      ...(property && value ? { hProperties: { [property]: value } } : {}),
    },
    children: [{ type: "text", value: text }],
  }
}

function enhanceInlineText(node: MarkdownNode, parent: Parent, index: number) {
  const value = node.value
  if (!value) return

  const pattern = /\{\{color:(#[\da-fA-F]{3}(?:[\da-fA-F]{3})?)\|([\s\S]+?)\}\}|\{\{size:(\d{1,2})px\|([\s\S]+?)\}\}|\+\+([\s\S]+?)\+\+/g
  const replacements: MarkdownNode[] = []
  let cursor = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(value)) !== null) {
    if (match.index > cursor) {
      replacements.push({ type: "text", value: value.slice(cursor, match.index) })
    }

    if (match[1] && Number.parseInt(match[1].slice(1), 16) <= 0xffffff) {
      replacements.push(inlineNode("span", "data-markdown-color", match[1], match[2]))
    } else if (match[3] && Number(match[3]) >= 8 && Number(match[3]) <= 72) {
      replacements.push(inlineNode("span", "data-markdown-size", `${match[3]}px`, match[4]))
    } else if (match[5]) {
      replacements.push(inlineNode("u", undefined, undefined, match[5]))
    } else {
      replacements.push({ type: "text", value: match[0] })
    }
    cursor = pattern.lastIndex
  }

  if (cursor === 0) return
  if (cursor < value.length) replacements.push({ type: "text", value: value.slice(cursor) })
  parent.children.splice(index, 1, ...replacements)
}

function remarkEnhancements() {
  return (tree: MdastRoot) => {
    const root = tree as unknown as MarkdownNode & { children: MarkdownNode[] }

    visit(tree, "text", (node, index, parent) => {
      if (!parent || typeof index !== "number") return
      enhanceInlineText(node as unknown as MarkdownNode, parent as Parent, index)
    })

    root.children = root.children.flatMap((node) => {
      const spacer = node.type === "paragraph"
        ? plainText(node).trim().match(/^\[space=(16|32|48|64)\]$/)
        : null
      if (spacer) {
        return [{
          type: "markdownSpacer",
          data: {
            hName: "div",
            hProperties: {
              className: ["markdown-spacer", `markdown-spacer-${spacer[1]}`],
              "aria-hidden": "true",
            },
          },
          children: [],
        }]
      }

      const anchor = node.type === "paragraph"
        ? plainText(node).trim().match(/^\[anchor=([A-Za-z][A-Za-z\d:._-]{0,63})\]$/)
        : null
      if (!anchor) return [node]
      return [{
        type: "anchorTarget",
        data: {
          hName: "span",
          hProperties: { id: anchor[1], "aria-hidden": "true" },
        },
        children: [],
      }]
    })

    const headings: { id: string; text: string; depth: number }[] = []
    const slugger = new GithubSlugger()
    visit(root as unknown as MdastRoot, "heading", (node) => {
      const heading = node as unknown as MarkdownNode
      const text = plainText(heading).trim()
      if (text) headings.push({ id: slugger.slug(text), text, depth: heading.depth ?? 1 })
    })

    root.children = root.children.flatMap((node) => {
      if (node.type === "paragraph" && plainText(node).trim() === "[toc]") {
        if (headings.length === 0) return []
        return [{
          type: "list",
          data: { hProperties: { className: ["markdown-toc"] } },
          children: headings.map((heading) => ({
            type: "listItem",
            spread: false,
            children: [{
              type: "paragraph",
              children: [{
                type: "link",
                url: `#${heading.id}`,
                data: { hProperties: { className: [`markdown-toc-level-${heading.depth}`] } },
                children: [{ type: "text", value: heading.text }],
              }],
            }],
          })),
        }]
      }
      return [node]
    })

    const aligned: MarkdownNode[] = []
    for (let index = 0; index < root.children.length; index += 1) {
      const node = root.children[index]
      const paragraphContent = node.type === "paragraph" ? plainText(node) : ""
      const inlineMarker = paragraphContent.match(/^\[align=(left|center|right)\]\r?\n([\s\S]*?)\r?\n\[\/align\]$/)
      if (inlineMarker && node.children) {
        const bodyStart = inlineMarker[0].indexOf(inlineMarker[2])
        node.children = clipInlineNodes(node.children, bodyStart, bodyStart + inlineMarker[2].length)
        node.data = {
          ...node.data,
          hProperties: {
            ...node.data?.hProperties,
            className: [`markdown-align-${inlineMarker[1]}`],
          },
        }
        aligned.push(node)
        continue
      }

      const marker = node.type === "paragraph" ? paragraphContent.trim().match(/^\[align=(left|center|right)\]$/) : null
      if (!marker) {
        aligned.push(node)
        continue
      }

      const content: MarkdownNode[] = []
      let end = index + 1
      while (end < root.children.length && !(root.children[end].type === "paragraph" && plainText(root.children[end]).trim() === "[/align]")) {
        content.push(root.children[end])
        end += 1
      }

      if (end < root.children.length) {
        aligned.push({
          type: "blockquote",
          data: { hProperties: { className: [`markdown-align-${marker[1]}`] } },
          children: content,
        })
        index = end
      } else {
        aligned.push(node)
      }
    }
    root.children = aligned
  }
}

function rehypeMarkdownStyles() {
  return (tree: HastRoot) => {
    visit(tree, "element", (node) => {
      const element = node as Element
      const color = element.properties["data-markdown-color"]
      const size = element.properties["data-markdown-size"]

      if (typeof color === "string" && /^#[\da-fA-F]{3}(?:[\da-fA-F]{3})?$/.test(color)) {
        element.properties.style = `color: ${color}`
      }
      if (typeof size === "string" && /^(?:[8-9]|[1-6]\d|7[0-2])px$/.test(size)) {
        element.properties.style = `${typeof element.properties.style === "string" ? `${element.properties.style}; ` : ""}font-size: ${size}`
      }
      delete element.properties["data-markdown-color"]
      delete element.properties["data-markdown-size"]
    })
  }
}

export { rehypeMarkdownStyles, remarkEnhancements }
