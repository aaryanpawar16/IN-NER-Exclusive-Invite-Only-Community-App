import { create }           from 'zustand';
import { membersService }   from '@/services/members.service';
import { MEMBERS }           from '@/constants/data';
import type { Member }       from '@/types/member.types';

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────

type MemberState = {
  members:        Member[];
  selectedMember: Member | null;
  isLoading:      boolean;
  isRefreshing:   boolean;
  error:          string | null;
  searchQuery:    string;
  activeFilter:   string;
  viewMode:       'grid' | 'list';
  page:           number;
  hasMore:        boolean;
  totalCount:     number;
};

type MemberActions = {
  fetchMembers:      (reset?: boolean)   => Promise<void>;
  fetchMemberById:   (id: number)        => Promise<void>;
  setSelectedMember: (m: Member | null)  => void;
  setSearchQuery:    (q: string)         => void;
  setActiveFilter:   (f: string)         => void;
  setViewMode:       (v: 'grid'|'list')  => void;
  clearSearch:       ()                  => void;
  clearSelected:     ()                  => void;
  refreshMembers:    ()                  => Promise<void>;
};

type MemberStore = MemberState & MemberActions;

// ─────────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────────

export const useMemberStore = create<MemberStore>((set, get) => ({
  // ── State ─────────────────────────────────────────────────
  members:        MEMBERS,
  selectedMember: null,
  isLoading:      false,
  isRefreshing:   false,
  error:          null,
  searchQuery:    '',
  activeFilter:   'All',
  viewMode:       'grid',
  page:           1,
  hasMore:        false,
  totalCount:     MEMBERS.length,

  // ── Fetch members ─────────────────────────────────────────
  fetchMembers: async (reset = false) => {
    const { searchQuery, activeFilter, page, isLoading } = get();
    if (isLoading) return;

    const nextPage = reset ? 1 : page;

    set({ isLoading: true, error: null });
    try {
      const result = await membersService.list({
        search:  searchQuery,
        tag:     activeFilter === 'All' ? undefined : activeFilter,
        page:    nextPage,
        sort:    'name',
      });

      set(prev => ({
        members:    reset
          ? result.items
          : [...prev.members, ...result.items],
        page:       nextPage + 1,
        hasMore:    nextPage < result.totalPages,
        totalCount: result.total,
        isLoading:  false,
      }));
    } catch (err: any) {
      set({
        isLoading: false,
        error:     err?.message ?? 'Failed to load members',
      });
    }
  },

  // ── Fetch single member ───────────────────────────────────
  fetchMemberById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const member = await membersService.getById(id);
      set({ selectedMember: member, isLoading: false });
    } catch (err: any) {
      set({
        isLoading: false,
        error:     err?.message ?? 'Failed to load member',
      });
    }
  },

  // ── Refresh ───────────────────────────────────────────────
  refreshMembers: async () => {
    set({ isRefreshing: true });
    try {
      const result = await membersService.list({
        search: get().searchQuery,
        tag:    get().activeFilter === 'All' ? undefined : get().activeFilter,
        page:   1,
        sort:   'name',
      });
      set({
        members:      result.items,
        page:         2,
        hasMore:      1 < result.totalPages,
        totalCount:   result.total,
        isRefreshing: false,
      });
    } catch {
      set({ isRefreshing: false });
    }
  },

  // ── Setters ───────────────────────────────────────────────
  setSelectedMember: (m)  => set({ selectedMember: m }),
  setSearchQuery:    (q)  => set({ searchQuery: q,    page: 1 }),
  setActiveFilter:   (f)  => set({ activeFilter: f,   page: 1 }),
  setViewMode:       (v)  => set({ viewMode: v }),
  clearSearch:       ()   => set({ searchQuery: '',   page: 1 }),
  clearSelected:     ()   => set({ selectedMember: null }),
}));

// ─────────────────────────────────────────────────────────────────
// Selectors
// ─────────────────────────────────────────────────────────────────

export const selectMembers        = (s: MemberStore) => s.members;
export const selectSelectedMember = (s: MemberStore) => s.selectedMember;
export const selectMemberById     = (id: number) =>
  (s: MemberStore) => s.members.find(m => m.id === id) ?? null;
export const selectIsFiltering    = (s: MemberStore) =>
  s.activeFilter !== 'All' || s.searchQuery.trim() !== '';