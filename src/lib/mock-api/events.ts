import { Event, CreateEventData, EventType } from '../types';
import { events, generateId } from './data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const eventsApi = {
  getAll: async (): Promise<Event[]> => {
    await delay(100);
    return [...events].sort((a, b) => b.date.getTime() - a.date.getTime());
  },

  getByType: async (type: EventType): Promise<Event[]> => {
    await delay(100);
    return events.filter(e => e.type === type).sort((a, b) => b.date.getTime() - a.date.getTime());
  },

  getUpcoming: async (): Promise<Event[]> => {
    await delay(100);
    const now = new Date();
    return events
      .filter(e => e.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  },

  getPast: async (): Promise<Event[]> => {
    await delay(100);
    const now = new Date();
    return events
      .filter(e => e.date < now)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  },

  getById: async (id: string): Promise<Event | undefined> => {
    await delay(100);
    return events.find(e => e.id === id);
  },

  create: async (data: CreateEventData): Promise<Event> => {
    await delay(200);
    const newEvent: Event = {
      ...data,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    events.push(newEvent);
    return newEvent;
  },

  update: async (id: string, data: Partial<CreateEventData>): Promise<Event | undefined> => {
    await delay(200);
    const index = events.findIndex(e => e.id === id);
    if (index === -1) return undefined;
    
    events[index] = {
      ...events[index],
      ...data,
      updatedAt: new Date(),
    };
    return events[index];
  },

  delete: async (id: string): Promise<boolean> => {
    await delay(200);
    const index = events.findIndex(e => e.id === id);
    if (index === -1) return false;
    
    events.splice(index, 1);
    return true;
  },

  getNextUpcoming: async (): Promise<Event | undefined> => {
    await delay(100);
    const upcoming = await eventsApi.getUpcoming();
    return upcoming[0];
  },
};
