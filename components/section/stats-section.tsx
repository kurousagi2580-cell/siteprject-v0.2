import { CardPanel } from "@/components/ui/card-panel"
import { GameSectionTitle } from "@/components/ui/game-section-title"
import { Section } from "@/components/ui/section"
import type { CharacterStatsRow } from "@/types/character-stats"

const statsLabelMap: Record<string, string> = {
  hp: "HP",
  atk: "攻撃力",
  def: "防御力",
  spd: "速度",
}

export function StatsSection({ stats }: { stats: CharacterStatsRow[] }) {
  if (!stats.length) return null

  const columns = Array.from(
    new Set(stats.flatMap((row) => Object.keys(row.stats ?? {}))),
  )

  return (
    <Section id="stats">
      <GameSectionTitle title="STATS" subtitle="キャラクターのステータス" />

      <CardPanel className="overflow-x-auto">
        <div className="min-w-[420px]">
          <table className="w-full border-collapse text-sm text-ananta-text">
            <thead>
              <tr>
                <th className="border border-ananta-border bg-ananta-surface2 p-2 text-left text-ananta-muted">Lv</th>
                {columns.map((key) => (
                  <th key={key} className="border border-ananta-border bg-ananta-surface2 p-2 text-left text-ananta-muted">
                    {statsLabelMap[key] ?? key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.map((row) => (
                <tr key={row.level}>
                  <td className="border border-ananta-border p-2 font-medium">{row.level}</td>
                  {columns.map((key) => (
                    <td key={`${row.level}-${key}`} className="border border-ananta-border p-2">
                      {row.stats?.[key] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardPanel>
    </Section>
  )
}
