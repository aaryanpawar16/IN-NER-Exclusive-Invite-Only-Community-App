// ─────────────────────────────────────────────────────────────────
// Core member
// ─────────────────────────────────────────────────────────────────

export type Member = {
  id:          number;
  name:        string;
  initials:    string;
  color:       string;
  role:        string;
  city:        string;
  bio:         string;
  tags:        string[];
  online:      boolean;
  memberSince: string;
};

// ─────────────────────────────────────────────────────────────────
// Member preview (lightweight — for pips, mentions, autocomplete)
// ─────────────────────────────────────────────────────────────────

export type MemberPreview = Pick
  Member,
  'id' | 'name' | 'initials' | 'color' | 'online'
>;

// ─────────────────────────────────────────────────────────────────
// Member with extended admin fields
// ─────────────────────────────────────────────────────────────────

export type MemberAdmin = Member & {
  email:      string;
  joinedAt:   string;
  invitedBy:  string | null;
  inviteCode: string;
  status:     MemberStatus;
};

export type MemberStatus = 'active' | 'suspended' | 'pending';

// ─────────────────────────────────────────────────────────────────
// Directory query params
// ─────────────────────────────────────────────────────────────────

export type MemberSortKey = 'name' | 'city' | 'recent';

export type MembersQuery = {
  search?:   string;
  tag?:      string;
  city?:     string;
  sort?:     MemberSortKey;
  page?:     number;
  pageSize?: number;
};

// ─────────────────────────────────────────────────────────────────
// Paginated response
// ─────────────────────────────────────────────────────────────────

export type MembersPage = {
  items:      Member[];
  total:      number;
  page:       number;
  pageSize:   number;
  totalPages: number;
};