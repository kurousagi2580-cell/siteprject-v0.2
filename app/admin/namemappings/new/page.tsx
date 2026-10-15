import { requireAdminPage } from "@/lib/auth/require-admin";
import NameMappingFormWrapper from "@/components/entities/namemapiings/namemapping-form";

export default async function Page() {
  await requireAdminPage();
  
  return <NameMappingFormWrapper mode="create" />;
}
