// components/character/SkillsSection.tsx
import { CardPanel } from "@/components/ui/card-panel"
import { GameSectionTitle } from "@/components/ui/game-section-title"
import { Section } from "@/components/ui/section"
import { characterSkills } from "@/lib/data"

export function SkillsSection() {
  return (
    <Section id="skills">
      <GameSectionTitle
        title="SKILLS"
        subtitle="キャラクターが使用できるスキル一覧"
      />

      <CardPanel>
        <ul className="flex flex-col gap-3 text-sm text-ananta-text">
          {characterSkills.map((sk) => (
            <li key={sk.name}>
              ◆ {sk.label}「{sk.name}」 — {sk.description}
            </li>
          ))}
        </ul>
      </CardPanel>
    </Section>
  )
}
