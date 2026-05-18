import { CreateEventData, Event, EventStatus, EventType } from '@/lib/types';
import { apiRequest } from '@/lib/api/client';

const EVENTS_PATH = '/api/admin/events';

type BackendEvent = {
  id: string;
  title: string;
  type: string;
  date: string;
  location: string;
  description: string;
  link: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

const normalizeEventStatus = (raw: string | undefined): EventStatus => {
  const allowed: EventStatus[] = ['upcoming', 'active', 'completed', 'cancelled', 'archived'];
  if (raw && allowed.includes(raw as EventStatus)) return raw as EventStatus;
  return 'upcoming';
};

const toFrontend = (item: BackendEvent): Event => ({
  id: item.id,
  title: item.title,
  type: item.type as EventType,
  date: new Date(item.date),
  location: item.location,
  description: item.description,
  link: item.link ?? undefined,
  status: normalizeEventStatus(item.status),
  createdAt: new Date(item.created_at),
  updatedAt: new Date(item.updated_at),
});

type BackendEventPayload = {
  title: string;
  type: string;
  date: string;
  location: string;
  description: string;
  link?: string | null;
  status: EventStatus;
};

const mapToBackendPayload = (data: Partial<CreateEventData>): Partial<BackendEventPayload> => {
  const out: Partial<BackendEventPayload> = {};
  if (data.title !== undefined) out.title = data.title;
  if (data.type !== undefined) out.type = data.type;
  if (data.date !== undefined) out.date = data.date instanceof Date ? data.date.toISOString() : String(data.date);
  if (data.location !== undefined) out.location = data.location;
  if (data.description !== undefined) out.description = data.description;
  if (data.link !== undefined) out.link = data.link?.trim() ? data.link : null;
  if (data.status !== undefined) out.status = data.status;
  return out;
};

const toBackendCreate = (data: CreateEventData): BackendEventPayload => ({
  title: data.title,
  type: data.type,
  date: data.date instanceof Date ? data.date.toISOString() : String(data.date),
  location: data.location,
  description: data.description,
  link: data.link?.trim() ? data.link : null,
  status: data.status,
});

const byDateDesc = (a: Event, b: Event) => b.date.getTime() - a.date.getTime();

export const eventsApi = {
  getAll: async (): Promise<Event[]> => {
    const data = await apiRequest<BackendEvent[]>(EVENTS_PATH, { method: 'GET' });
    return data.map(toFrontend).sort(byDateDesc);
  },

  getByType: async (type: EventType): Promise<Event[]> => {
    const all = await eventsApi.getAll();
    return all.filter((event) => event.type === type).sort(byDateDesc);
  },

  getUpcoming: async (): Promise<Event[]> => {
    const all = await eventsApi.getAll();
    const now = new Date();
    return all.filter((event) => event.date >= now).sort((a, b) => a.date.getTime() - b.date.getTime());
  },

  getPast: async (): Promise<Event[]> => {
    const all = await eventsApi.getAll();
    const now = new Date();
    return all.filter((event) => event.date < now).sort(byDateDesc);
  },

  getById: async (id: string): Promise<Event | undefined> => {
    const data = await apiRequest<BackendEvent>(`${EVENTS_PATH}/${id}`, { method: 'GET' });
    return toFrontend(data);
  },

  create: async (data: CreateEventData): Promise<Event> => {
    const payload = toBackendCreate(data);
    const created = await apiRequest<BackendEvent>(EVENTS_PATH, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return toFrontend(created);
  },

  update: async (id: string, data: Partial<CreateEventData>): Promise<Event | undefined> => {
    const payload = mapToBackendPayload(data);
    const updated = await apiRequest<BackendEvent>(`${EVENTS_PATH}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return toFrontend(updated);
  },

  delete: async (id: string): Promise<boolean> => {
    await apiRequest<{ ok: boolean }>(`${EVENTS_PATH}/${id}`, { method: 'DELETE' });
    return true;
  },

  getNextUpcoming: async (): Promise<Event | undefined> => {
    const upcoming = await eventsApi.getUpcoming();
    return upcoming[0];
  },
};
