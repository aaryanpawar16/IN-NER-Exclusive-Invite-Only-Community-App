import { useState, useMemo, useCallback } from 'react';
import { EVENTS }                          from '@/constants/data';
import { EVENTS_FILTERS }                  from '@/constants/filters';
import { toast }                           from '@/components/ui';
import type { Event }                      from '@/types/event.types';
import type { EventFilterKey }             from '@/components/events/EventsFilter';

export function useEvents() {
  const [events,       setEvents]       = useState<Event[]>(EVENTS);
  const [activeFilter, setActiveFilter] = useState<EventFilterKey>('all');
  const [sheetEvent,   setSheetEvent]   = useState<Event | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  // ── Filter counts ────────────────────────────────────────────
  const filtersWithCounts = useMemo(() =>
    EVENTS_FILTERS.map(f => ({
      ...f,
      count: f.key === 'all'
        ? events.length
        : f.key === 'attending'
          ? events.filter(e => e.attending).length
          : events.filter(e => e.badge === f.key).length,
    })),
    [events]
  );

  // ── Filtered list ────────────────────────────────────────────
  const filtered: Event[] = useMemo(() => {
    switch (activeFilter) {
      case 'virtual':   return events.filter(e => e.badge === 'virtual');
      case 'inperson':  return events.filter(e => e.badge === 'inperson');
      case 'attending': return events.filter(e => e.attending);
      default:          return events;
    }
  }, [events, activeFilter]);

  // ── RSVP toggle ──────────────────────────────────────────────
  const toggleRsvp = useCallback((event: Event) => {
    if (event.badge === 'sold') {
      toast({ message: 'Added to waitlist', tone: 'default' });
      return;
    }

    setEvents(prev => prev.map(e =>
      e.id === event.id
        ? {
            ...e,
            attending:     !e.attending,
            attendeeCount: e.attending
              ? e.attendeeCount - 1
              : e.attendeeCount + 1,
          }
        : e
    ));

    // Update sheet event in sync
    setSheetEvent(prev =>
      prev?.id === event.id
        ? {
            ...prev,
            attending:     !prev.attending,
            attendeeCount: prev.attending
              ? prev.attendeeCount - 1
              : prev.attendeeCount + 1,
          }
        : prev
    );

    if (!event.attending) {
      toast({
        message: 'You\'re attending — see you there',
        tone:    'success',
        action:  {
          label:   'Undo',
          onPress: () => toggleRsvp({ ...event, attending: true }),
        },
      });
    } else {
      toast({ message: 'RSVP removed', tone: 'default' });
    }
  }, []);

  // ── Sheet ────────────────────────────────────────────────────
  const openSheet = useCallback((event: Event) => {
    setSheetEvent(event);
    setSheetVisible(true);
  }, []);

  const closeSheet = useCallback(() => {
    setSheetVisible(false);
  }, []);

  // ── Lookups ──────────────────────────────────────────────────
  const getEventById = useCallback(
    (id: number) => events.find(e => e.id === id) ?? null,
    [events]
  );

  const attendingCount = useMemo(
    () => events.filter(e => e.attending).length,
    [events]
  );

  const featuredEventId = useMemo(
    () => events[0]?.id ?? null,
    [events]
  );

  return {
    // State
    events,
    filtered,
    activeFilter,
    sheetEvent,
    sheetVisible,

    // Derived
    filtersWithCounts,
    attendingCount,
    featuredEventId,
    totalCount:  events.length,

    // Actions
    setActiveFilter,
    toggleRsvp,
    openSheet,
    closeSheet,
    getEventById,
  } as const;
}