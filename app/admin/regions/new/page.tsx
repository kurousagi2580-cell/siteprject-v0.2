import { requireAdminPage } from "@/lib/auth/require-admin";
import RegionForm from "@/components/entities/region/region-form"
import { getCountryList } from "@/actions/countries-actions-server";

export default async function Page() {
  await requireAdminPage();

  const cotRes = await getCountryList();
  const countries = cotRes?.items ?? []

  return <RegionForm mode="create" countries={countries} />
}
