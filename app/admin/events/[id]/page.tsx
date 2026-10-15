import { requireAdminPage } from "@/lib/auth/require-admin";
import EventForm from "@/components/entities/event/event-form"
import { getEventById } from "@/actions/events-actions-server";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage();
  const { id } = await params

  const event = await getEventById(id);
  if (!event) return null;

  const safe = { ...event, created_at: event.created_at?.toString?.() };

  return <EventForm mode="edit" initialData={safe} />
}

