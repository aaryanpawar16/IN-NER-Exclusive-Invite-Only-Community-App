import { api, buildQuery }   from './api';
import { EVENTS }             from '@/constants/data';
import { EVENTS_PAGE_SIZE }   from '@/constants/config';
import type { Event }         from '@/types/event.types';
import type { EventFilterKey } from '@/components/events/EventsFilter';

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────

export type EventsQuery = {
  filter?:   EventFilterKey;
  month?:    string;
  page?:     number;
  pageSize?: number;
};

export type EventsPage = {
  items:      Event[];
  total:      number;
  page:       number;
  pageSize:   number;
  totalPages: number;
};

export type RsvpPayload = {
  eventId:   number;
  attending: boolean;
};

// ─────────────────────────────────────────────────────────────────
// Events service
// ─────────────────────────────────────────────────────────────────

export const eventsService = {

  // ── List events ────────────────────────────────────────────
  list: async (query: EventsQuery = {}): Promise<EventsPage> => {
    // In production:
    // const qs = buildQuery({ ...query });
    // const res = await api.get<EventsPage>(`/events${qs}`);
    // return res.data;

    await new Promise(res => setTimeout(res, 300));

    const {
      filter   = 'all',
      page     = 1,
      pageSize = EVENTS_PAGE_SIZE,
    } = query;

    let list = [...EVENTS];

    if (filter === 'virtual')   list = list.filter(e => e.badge === 'virtual');
    if (filter === 'inperson')  list = list.filter(e => e.badge === 'inperson');
    if (filter === 'attending') list = list.filter(e => e.attending);

    const total      = list.length;
    const totalPages = Math.ceil(total / pageSize);
    const start      = (page - 1) * pageSize;
    const items      = list.slice(start, start + pageSize);

    return { items, total, page, pageSize, totalPages };
  },

  // ── Get event by id ────────────────────────────────────────
  getById: async (id: number): Promise<Event | null> => {
    // In production:
    // const res = await api.get<Event>(`/events/${id}`);
    // return res.data;

    await new Promise(res => setTimeout(res, 200));
    return EVENTS.find(e => e.id === id) ?? null;
  },

  // ── Toggle RSVP ────────────────────────────────────────────
  toggleRsvp: async (payload: RsvpPayload): Promise<Event> => {
    // In production:
    // const res = await api.post<Event>(`/events/${payload.eventId}/rsvp`, {
    //   attending: payload.attending,
    // });
    // return res.data;

    await new Promise(res => setTimeout(res, 350));

    const event = EVENTS.find(e => e.id === payload.eventId);
    if (!event) throw new Error('Event not found');

    return {
      ...event,
      attending:     payload.attending,
      attendeeCount: payload.attending
        ? event.attendeeCount + 1
        : event.attendeeCount - 1,
    };
  },

  // ── Join waitlist ──────────────────────────────────────────
  joinWaitlist: async (eventId: number): Promise<void> => {
    // In production:
    // await api.post(`/events/${eventId}/waitlist`, {});
    await new Promise(res => setTimeout(res, 400));
  },

  // ── Get attending members ──────────────────────────────────
  getAttendees: async (eventId: number): Promise<{ id: number; name: string; initials: string; color: string }[]> => {
    // In production:
    // const res = await api.get(`/events/${eventId}/attendees`);
    // return res.data;

    await new Promise(res => setTimeout(res, 250));
    return [];
  },

  // ── Admin: create event ────────────────────────────────────
  create: async (payload: Omit<Event, 'id' | 'attendeeCount' | 'attending'>): Promise<Event> => {
    // In production:
    // const res = await api.post<Event>('/admin/events', payload);
    // return res.data;

    await new Promise(res => setTimeout(res, 500));
    return { ...payload, id: Date.now(), attendeeCount: 0, attending: false };
  },

  // ── Admin: cancel event ────────────────────────────────────
  cancel: async (eventId: number): Promise<void> => {
    // In production:
    // await api.delete(`/admin/events/${eventId}`);
    await new Promise(res => setTimeout(res, 400));
  },
};