
import "server-only";
import { makeCrudActions } from "@/actions/make-crud-actions";
import type { GameEvent } from "@/types/gameevents";

const actions = makeCrudActions<GameEvent>("game_events", "title");

export async function createEventFromObject(payload: Record<string, any>) {
  // 必要なサーバー側バリデーションをここで行う
  if (!payload.title) return { success: false, error: "name required" };
  const created = await actions.create(payload);
  return { success: true, id: created.id, item: created };
}

export async function updateEventFromObject(id: string, payload: Record<string, any>) {
  const updated = await actions.update(id, payload);
  return { success: true, id: updated.id, item: updated };
}

export async function deleteEvent(id: string) {
  await actions.remove(id);
  return { success: true };
}

export async function getEventById(id: string) {
  return await actions.getById(id);
}

export async function getEventList() {
  return await actions.list();
}