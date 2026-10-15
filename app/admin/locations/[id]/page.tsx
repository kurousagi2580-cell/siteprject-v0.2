import { requireAdminPage } from "@/lib/auth/require-admin";
import LocationForm from "@/components/entities/location/location-form"
import { getLocationById } from "@/actions/locations-actions-server";
import { getRegionList } from "@/actions/regions-actions-server";

export default async function LocationsEditPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage();
  const { id } = await params

  const regRes = await getRegionList();
  const regions = regRes?.items ?? []

  const location = await getLocationById(id);
  if (!location) return null;

  const safe = { ...location, created_at: location.created_at?.toString?.()};

  return <LocationForm mode="edit" initialData={safe} regions={regions} />
}
