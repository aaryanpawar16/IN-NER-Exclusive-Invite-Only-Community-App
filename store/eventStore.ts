import { create }          from 'zustand';
import { eventsService }   from '@/services/events.service';
import { EVENTS }           from '@/constants/data';
import type { Event }       from '@/types/event.types';
import type { EventFilterKey } from '@/components/events/EventsFilter';

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────

type EventState = {
  events:        Event[];
  selectedEvent: Event | null;
  sheetEvent:    Event | null;
  sheetVisible:  boolean;
  activeFilter:  EventFilterKey;
  isLoading:     boolean;
  isRefreshing:  boolean;
  error:         string | null;
};

type EventActions = {
  fetchEvents:      ()                    => Promise<void>;
  fetchEventById:   (id: number)          => Promise<void>;
  toggleRsvp:       (event: Event)        => Promise<void>;
  joinWaitlist:     (eventId: number)     => Promise<void>;
  setActiveFilter:  (f: EventFilterKey)   => void;
  openSheet:        (event: Event)        => void;
  closeSheet:       ()                    => void;
  setSelectedEvent: (e: Event | null)     => void;
  refreshEvents:    ()                    => Promise<void>;
};

type EventStore = EventState & EventActions;

// ─────────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────────

export const useEventStore = create<EventStore>((set, get) => ({
  // ── State ─────────────────────────────────────────────────
  events:        EVENTS,
  selectedEvent: null,
  sheetEvent:    null,
  sheetVisible:  false,
  activeFilter:  'all',
  isLoading:     false,
  isRefreshing:  false,
  error:         null,

  // ── Fetch events ──────────────────────────────────────────
  fetchEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await eventsService.list({
        filter: get().activeFilter,
      });
      set({ events: result.items, isLoading: false });
    } catch (err: any) {
      set({
        isLoading: false,
        error:     err?.message ?? 'Failed to load events',
      });
    }
  },

  // ── Fetch single event ────────────────────────────────────
  fetchEventById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const event = await eventsService.getById(id);
      set({ selectedEvent: event, isLoading: false });
    } catch (err: any) {
      set({
        isLoading: false,
        error:     err?.message ?? 'Failed to load event',
      });
    }
  },

  // ── Toggle RSVP (optimistic) ─────────────────────────────
  toggleRsvp: async (event: Event) => {
    if (event.badge === 'sold') {
      await eventsService.joinWaitlist(event.id);
      return;
    }

    // Optimistic update
    const optimistic = {
      ...event,
      attending:     !event.attending,
      attendeeCount: event.attending
        ? event.attendeeCount - 1
        : event.attendeeCount + 1,
    };

    set(prev => ({
      events: prev.events.map(e =>
        e.id === event.id ? optimistic : e
      ),
      // Sync sheet and selected if open
      sheetEvent:    prev.sheetEvent?.id    === event.id ? optimistic : prev.sheetEvent,
      selectedEvent: prev.selectedEvent?.id === event.id ? optimistic : prev.selectedEvent,
    }));

    try {
      const updated = await eventsService.toggleRsvp({
        eventId:   event.id,
        attending: !event.attending,
      });
      // Reconcile with server response
      set(prev => ({
        events: prev.events.map(e =>
          e.id === event.id ? updated : e
        ),
        sheetEvent:    prev.sheetEvent?.id    === event.id ? updated : prev.sheetEvent,
        selectedEvent: prev.selectedEvent?.id === event.id ? updated : prev.selectedEvent,
      }));
    } catch {
      // Rollback on failure
      set(prev => ({
        events: prev.events.map(e =>
          e.id === event.id ? event : e
        ),
        sheetEvent:    prev.sheetEvent?.id    === event.id ? event : prev.sheetEvent,
        selectedEvent: prev.selectedEvent?.id === event.id ? event : prev.selectedEvent,
      }));
    }
  },

  // ── Join waitlist ─────────────────────────────────────────
  joinWaitlist: async (eventId: number) => {
    await eventsService.joinWaitlist(eventId);
  },

  // ── Refresh ───────────────────────────────────────────────
  refreshEvents: async () => {
    set({ isRefreshing: true });
    try {
      const result = await eventsService.list({
        filter: get().activeFilter,
      });
      set({ events: result.items, isRefreshing: false });
    } catch {
      set({ isRefreshing: false });
    }
  },

  // ── Setters ───────────────────────────────────────────────
  setActiveFilter:  (f) => set({ activeFilter: f }),
  openSheet:        (e) => set({ sheetEvent: e, sheetVisible: true  }),
  closeSheet:       ()  => set({ sheetVisible: false }),
  setSelectedEvent: (e) => set({ selectedEvent: e }),
}));

// ─────────────────────────────────────────────────────────────────
// Selectors
// ─────────────────────────────────────────────────────────────────

export const selectEvents = (s: EventStore) => s.events;

export const selectFilteredEvents = (s: EventStore) => {
  switch (s.activeFilter) {
    case 'virtual':   return s.events.filter(e => e.badge === 'virtual');
    case 'inperson':  return s.events.filter(e => e.badge === 'inperson');
    case 'attending': return s.events.filter(e => e.attending);
    default:          return s.events;
  }
};

export const selectAttendingCount  = (s: EventStore) =>
  s.events.filter(e => e.attending).length;

export const selectEventById = (id: number) =>
  (s: EventStore) => s.events.find(e => e.id === id) ?? null;