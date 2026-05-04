// ─────────────────────────────────────────────────────────────────
// Badge / format
// ─────────────────────────────────────────────────────────────────

export type EventBadge  = 'virtual' | 'inperson' | 'sold';
export type EventFormat = 'talk' | 'dinner' | 'salon' | 'workshop' | 'gathering';

// ─────────────────────────────────────────────────────────────────
// Core event
// ─────────────────────────────────────────────────────────────────

export type Event = {
  id:             number;
  day:            string;
  month:          string;
  type:           string;
  name:           string;
  meta:           string;
  desc:           string;
  badge:          EventBadge;
  attendeeColors: string[];
  attendeeCount:  number;
  attending:      boolean;
};

// ─────────────────────────────────────────────────────────────────
// Event with extended detail fields
// ─────────────────────────────────────────────────────────────────

export type EventDetail = Event & {
  format:       EventFormat;
  hostName:     string;
  hostInitials: string;
  hostColor:    string;
  maxCapacity:  number | null;
  address:      string | null;
  zoomLink:     string | null;
  tags:         string[];
  createdAt:    string;
};

// ─────────────────────────────────────────────────────────────────
// Create / update
// ─────────────────────────────────────────────────────────────────

export type CreateEventPayload = Omit
  Event,
  'id' | 'attendeeCount' | 'attending' | 'attendeeColors'
>;

export type UpdateEventPayload = Partial<CreateEventPayload>;

// ─────────────────────────────────────────────────────────────────
// RSVP
// ─────────────────────────────────────────────────────────────────

export type RsvpPayload = {
  eventId:   number;
  attending: boolean;
};

export type RsvpStatus = 'attending' | 'waitlisted' | 'not_attending';

// ─────────────────────────────────────────────────────────────────
// Query
// ─────────────────────────────────────────────────────────────────

export type EventFilterKey = 'all' | 'virtual' | 'inperson' | 'attending';

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