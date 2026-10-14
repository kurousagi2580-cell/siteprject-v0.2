import { getCommentListByPage } from "@/actions/comments-actions-server";
import CommentForm from "@/components/comments/comment-form"; // client self-contained form
import CommentListClient from "@/components/comments/comment-list-client";
import { CardPanel } from "@/components/ui/card-panel";
import { GameSectionTitle } from "@/components/ui/game-section-title";

export default async function CommentSection({ pageId }: { pageId: string }) {

  const comments = (await getCommentListByPage(pageId)).items;

  return (
    <section id="comments" className="mt-6 mb-4">
      <div className="space-y-4">
        <GameSectionTitle title="COMMENTS" subtitle="このページに関するコメント" />

        {/* 通常投稿フォーム（Client） */}
        <CardPanel className="p-4">
          <CommentForm pageId={pageId} />
        </CardPanel>

        {/* コメント一覧は Server でレンダリングした HTML を出力しつつ、
            返信フォームの開閉などのインタラクションは Client 側で管理 */}
        <CommentListClient comments={comments} pageId={pageId} />
      </div>
    </section>
  );
}
