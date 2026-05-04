import type { FilterOption }    from '@/components/directory/FilterBar';
import type { EventFilterKey }  from '@/components/events/EventsFilter';

// ── Directory filters ─────────────────────────────────────────────

export const DIRECTORY_FILTERS: FilterOption[] = [
  { key: 'All',          label: 'All'          },
  { key: 'Design',       label: 'Design'       },
  { key: 'Tech',         label: 'Tech'         },
  { key: 'Finance',      label: 'Finance'      },
  { key: 'Art',          label: 'Art'          },
  { key: 'Film',         label: 'Film'         },
  { key: 'Architecture', label: 'Architecture' },
  { key: 'Music',        label: 'Music'        },
  { key: 'Literature',   label: 'Literature'   },
  { key: 'Philosophy',   label: 'Philosophy'   },
  { key: 'Food & Wine',  label: 'Food & Wine'  },
  { key: 'Sustainability', label: 'Sustainability' },
  { key: 'Wellness',     label: 'Wellness'     },
];

// ── Events filters ────────────────────────────────────────────────

export const EVENTS_FILTERS: {
  key: EventFilterKey;
  label: string;
}[] = [
  { key: 'all',       label: 'All'       },
  { key: 'virtual',   label: 'Virtual'   },
  { key: 'inperson',  label: 'In Person' },
  { key: 'attending', label: 'My RSVPs'  },
];

// ── Application steps ─────────────────────────────────────────────

export const APPLICATION_STEPS = [
  { key: 'basics',    label: 'Basics'    },
  { key: 'profile',   label: 'Profile'   },
  { key: 'questions', label: 'Questions' },
  { key: 'review',    label: 'Review'    },
] as const;

export type ApplicationStepKey =
  typeof APPLICATION_STEPS[number]['key'];

// ── Referral sources ──────────────────────────────────────────────

export const REFERRAL_SOURCES = [
  { label: 'Referred by a member',  value: 'referral' },
  { label: 'Social media',          value: 'social'   },
  { label: 'Press coverage',        value: 'press'    },
  { label: 'Event / Conference',    value: 'event'    },
  { label: 'Other',                 value: 'other'    },
] as const;

export type ReferralSourceValue =
  typeof REFERRAL_SOURCES[number]['value'];

// ── Admin tabs ────────────────────────────────────────────────────

export const ADMIN_APPLICATION_TABS = [
  { key: 'pending',  label: 'Pending'  },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
] as const;

export type AdminApplicationTabKey =
  typeof ADMIN_APPLICATION_TABS[number]['key'];

export const ADMIN_MEMBER_SORT_OPTIONS = [
  { key: 'name',   label: 'Name'   },
  { key: 'city',   label: 'City'   },
  { key: 'recent', label: 'Recent' },
] as const;

export type AdminMemberSortKey =
  typeof ADMIN_MEMBER_SORT_OPTIONS[number]['key'];