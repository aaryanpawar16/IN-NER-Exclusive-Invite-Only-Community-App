import { create }           from 'zustand';
import { APPLICATIONS }     from '@/constants/data';
import type { Application } from '@/types/application.types';

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────

export type AdminStats = {
  totalMembers:      number;
  pendingCount:      number;
  approvedThisMonth: number;
  acceptanceRate:    number;
  activeEvents:      number;
  newThisMonth:      number;
};

type AdminState = {
  applications:   Application[];
  stats:          AdminStats;
  isLoadingStats: boolean;
  isLoadingApps:  boolean;
  error:          string | null;
};

type AdminActions = {
  addApplication:     (app: Omit<Application, 'id'>) => void;
  approveApplication: (id: number)                   => void;
  rejectApplication:  (id: number)                   => void;
  refreshStats:       ()                             => void;
  clearError:         ()                             => void;
};

type AdminStore = AdminState & AdminActions;

// ─────────────────────────────────────────────────────────────────
// Initial state
// ─────────────────────────────────────────────────────────────────

const INITIAL_STATS: AdminStats = {
  totalMembers:      1240,
  pendingCount:      APPLICATIONS.filter(a => a.status === 'pending').length,
  approvedThisMonth: 14,
  acceptanceRate:    12,
  activeEvents:      5,
  newThisMonth:      14,
};

// ─────────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────────

export const useAdminStore = create<AdminStore>((set, get) => ({

  // ── State ──────────────────────────────────────────────────
  applications:   [...APPLICATIONS],
  stats:          INITIAL_STATS,
  isLoadingStats: false,
  isLoadingApps:  false,
  error:          null,

  // ── Add new application from apply form ────────────────────
  addApplication: (appData: Omit<Application, 'id'>) => {
    set(prev => {
      const maxId = prev.applications.reduce(
        (max, a) => Math.max(max, a.id), 0
      );
      const newApp: Application = {
        ...appData,
        id: maxId + 1,
      };
      return {
        applications: [newApp, ...prev.applications],
        stats: {
          ...prev.stats,
          pendingCount: prev.stats.pendingCount + 1,
        },
      };
    });
  },

  // ── Approve application ────────────────────────────────────
  approveApplication: (id: number) => {
    set(prev => {
      const updated = prev.applications.map(a =>
        a.id === id ? { ...a, status: 'approved' as const } : a
      );
      const pendingCount = updated.filter(a => a.status === 'pending').length;
      return {
        applications: updated,
        stats: {
          ...prev.stats,
          totalMembers:      prev.stats.totalMembers + 1,
          pendingCount,
          approvedThisMonth: prev.stats.approvedThisMonth + 1,
        },
      };
    });
  },

  // ── Reject application ─────────────────────────────────────
  rejectApplication: (id: number) => {
    set(prev => {
      const updated = prev.applications.map(a =>
        a.id === id ? { ...a, status: 'rejected' as const } : a
      );
      const pendingCount = updated.filter(a => a.status === 'pending').length;
      return {
        applications: updated,
        stats: { ...prev.stats, pendingCount },
      };
    });
  },

  // ── Refresh stats ──────────────────────────────────────────
  refreshStats: () => {
    const { applications, stats } = get();
    set({
      stats: {
        ...stats,
        pendingCount: applications.filter(
          a => a.status === 'pending'
        ).length,
      },
    });
  },

  // ── Clear error ────────────────────────────────────────────
  clearError: () => set({ error: null }),

}));

// ─────────────────────────────────────────────────────────────────
// Selectors
// ─────────────────────────────────────────────────────────────────

export const selectApplications = (s: AdminStore) =>
  s.applications;

export const selectApplicationsByStatus = (
  status: Application['status']
) => (s: AdminStore) =>
  s.applications.filter(a => a.status === status);

export const selectPendingCount = (s: AdminStore) =>
  s.applications.filter(a => a.status === 'pending').length;

export const selectAdminStats = (s: AdminStore) => s.stats;