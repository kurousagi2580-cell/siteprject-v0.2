import { requireAdminPage } from "@/lib/auth/require-admin";
import EventForm from "@/components/entities/event/event-form"

export default async function Page() {
  await requireAdminPage();

  return <EventForm mode="create"  />
}
