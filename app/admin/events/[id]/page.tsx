import { fetchData } from "@/lib/supabase/queries"
import EventsForm from "@/components/admin/event-form"
import { GameEvent } from "@/types/gameevents"

export default async function EventEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

    const locations = await fetchData<GameEvent>("game_events", {
      select: "id, title, status, start_date, end_date, image_url, created_at, articles_slug",
      filters: [{ column: "id", operator: "eq", value: id }],
      single: true
    })
  
    if (!locations) {
      return null
    }

  return <EventsForm mode= "edit" initialData={locations}/>
}
