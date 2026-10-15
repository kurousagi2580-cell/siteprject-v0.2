import { requireAdminPage } from "@/lib/auth/require-admin";
import CountryForm from "@/components/entities/country/country-form"

export default async function Page() {
  await requireAdminPage();
  return <CountryForm mode= "create" />
}
