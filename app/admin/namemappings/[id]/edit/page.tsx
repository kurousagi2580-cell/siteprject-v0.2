// src/app/admin/articles/[id]/page.tsx など
import { getNameMappingsById } from "@/actions/namemaps-actions-server";
import NameMappingFormWrapper from "@/components/entities/namemapiings/namemapping-form";

export default async function ArticleEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const namemapping = await getNameMappingsById(id);
  if (!namemapping) return null;

  const safe = { ...namemapping, created_at: namemapping.created_at?.toString?.(), updated_at: namemapping.updated_at?.toString?.() };

  return <NameMappingFormWrapper mode="edit" initialData={safe}/>;
}
