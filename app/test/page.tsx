
import { CardPanel } from "@/components/ui/card-panel"
import { CardBox } from "@/components/ui/card-box"
import { Section } from "@/components/ui/section"
import { SiteShell } from "@/components/site-shell"
import { Surface } from "@/components/ui/surface"
import { XEmbed } from "@/components/embed/x"
import { YouTubeEmbed } from "@/components/embed/youtube"

export default function NewsPage() {
    return (
        <SiteShell rightNavMode="none">
            {/* Eyecatch → Surface に統一 */}
            <Surface variant="raised" className="h-52 md:h-64 flex items-center justify-center text-xl font-bold">
                NEWS
            </Surface>
            {/* 情報本文 */}
            <Section id="info">
                <h1>埋め込みテスト</h1>
                <CardPanel>


                    <h2>YouTube</h2>
                    <CardBox className="grid grid-cols-2 gap-3">
                        <YouTubeEmbed videoId="dQw4w9WgXcQ" />
                        <YouTubeEmbed videoId="dQw4w9WgXcQ" />
                    </CardBox>


                </CardPanel>
                <CardPanel>
                    <h2>X（Twitter）</h2>
                    <CardBox className="grid grid-cols-2 gap-3">
                        <XEmbed tweetUrl="https://twitter.com/elonmusk/status/1234567890" />
                        <XEmbed tweetUrl="https://twitter.com/elonmusk/status/1234567890" />
                    </CardBox>

                </CardPanel>


            </Section>


        </SiteShell>
    )
}
