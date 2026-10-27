import { AppImage } from "@/components/app-image"
import { CardPanel } from "@/components/ui/card-panel"
import { GameSectionTitle } from "@/components/ui/game-section-title"
import { Section } from "@/components/ui/section"
import type { CharacterSkill } from "@/types/character-skill"

const skillTypeLabels: Record<string, string> = {
  normal: "通常攻撃",
  skill: "スキル",
  ultimate: "奥義",
  passive: "パッシブ",
}

export function SkillsSection({ skills }: { skills: CharacterSkill[] }) {
  if (!skills.length) return null

  return (
    <Section id="skills">
      <GameSectionTitle title="SKILLS" subtitle="キャラクターが使用できるスキル一覧" />

      <CardPanel>
        <ul className="flex flex-col gap-4 text-sm text-ananta-text">
          {skills.map((skill, index) => {
            const typeLabel = skill.skill_type ? skillTypeLabels[skill.skill_type] ?? skill.skill_type : "スキル"
            const cooldown = typeof skill.cooldown === "number" ? `CT: ${skill.cooldown}秒` : null

            return (
              <li key={`${skill.name}-${index}`} className="flex gap-3 rounded border border-ananta-border/50 bg-ananta-surface/40 p-3">
                {skill.icon_url ? (
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-ananta-surface2">
                    <AppImage src={skill.icon_url} alt={skill.name} fill sizes="40px" className="object-cover" />
                  </div>
                ) : null}

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-[0.12em] text-ananta-muted">{typeLabel}</span>
                    <span className="font-bold text-ananta-text">{skill.name}</span>
                    {cooldown ? <span className="text-xs text-ananta-muted">{cooldown}</span> : null}
                  </div>
                  {skill.description ? <p className="text-ananta-muted">{skill.description}</p> : null}
                </div>
              </li>
            )
          })}
        </ul>
      </CardPanel>
    </Section>
  )
}

