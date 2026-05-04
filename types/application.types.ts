// ─────────────────────────────────────────────────────────────────
// Status
// ─────────────────────────────────────────────────────────────────

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

// ─────────────────────────────────────────────────────────────────
// Core application
// ─────────────────────────────────────────────────────────────────

export type Application = {
  id:               number;
  firstName:        string;
  lastName:         string;
  initials:         string;
  color:            string;
  role:             string;
  city:             string;
  appliedDate:      string;
  status:           ApplicationStatus;
  referralNote?:    string;
  bio?:             string;
  interests:        string[];
  currentWork?:     string;
  communityMeaning?: string;
  referralSource:   string;
};

// ─────────────────────────────────────────────────────────────────
// Multi-step form values
// ─────────────────────────────────────────────────────────────────

export type ApplicationStep1 = {
  firstName: string;
  lastName:  string;
  email:     string;
  city:      string;
  role:      string;
};

export type ApplicationStep2 = {
  bio:       string;
  interests: string[];
};

export type ApplicationStep3 = {
  currentWork:      string;
  communityMeaning: string;
  referralSource:   string;
};

export type ApplicationFormValues =
  ApplicationStep1 &
  ApplicationStep2 &
  ApplicationStep3;

// ─────────────────────────────────────────────────────────────────
// Submit payload (sent to API)
// ─────────────────────────────────────────────────────────────────

export type SubmitApplicationPayload = ApplicationFormValues;

// ─────────────────────────────────────────────────────────────────
// Admin decision
// ─────────────────────────────────────────────────────────────────

export type ApplicationDecision = {
  applicationId: number;
  action:        'approve' | 'reject';
  note?:         string;
};

// ─────────────────────────────────────────────────────────────────
// Step config (used by StepIndicator)
// ─────────────────────────────────────────────────────────────────

export type ApplicationStep = {
  key:   string;
  label: string;
};

// ─────────────────────────────────────────────────────────────────
// Paginated response
// ─────────────────────────────────────────────────────────────────

export type ApplicationsPage = {
  items:      Application[];
  total:      number;
  page:       number;
  pageSize:   number;
  totalPages: number;
};