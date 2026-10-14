import LocationForm from "@/components/entities/location/location-form"
import { getRegionList } from "@/actions/regions-actions-server";

export default async function Page() {

  const regRes = await getRegionList();
  const regions = regRes?.items ?? []

  return <LocationForm mode="create" regions={regions} />
}
