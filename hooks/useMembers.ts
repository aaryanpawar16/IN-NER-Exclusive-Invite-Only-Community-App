import { useState, useMemo, useCallback } from 'react';
import { MEMBERS }                         from '@/constants/data';
import { DIRECTORY_FILTERS }               from '@/constants/filters';
import type { Member }                     from '@/types/member.types';
import type { FilterOption }               from '@/components/directory/FilterBar';

type ViewMode = 'grid' | 'list';
type SortKey  = 'name' | 'city' | 'recent';

export function useMembers() {
  const [search,       setSearch]       = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [viewMode,     setViewMode]     = useState<ViewMode>('grid');
  const [sortKey,      setSortKey]      = useState<SortKey>('name');

  // ── Derived filter list with counts ─────────────────────────
  const filtersWithCounts: FilterOption[] = useMemo(() =>
    DIRECTORY_FILTERS.map(f => ({
      ...f,
      count: f.key === 'All'
        ? MEMBERS.length
        : MEMBERS.filter(m => m.tags.includes(f.key)).length,
    })),
    []
  );

  // ── Filtered + sorted list ───────────────────────────────────
  const filtered: Member[] = useMemo(() => {
    let list = [...MEMBERS];

    // Filter by tag
    if (activeFilter !== 'All') {
      list = list.filter(m => m.tags.includes(activeFilter));
    }

    // Filter by search query
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q) ||
        m.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortKey === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortKey === 'city') {
      list.sort((a, b) => a.city.localeCompare(b.city));
    }
    // 'recent' preserves seed order

    return list;
  }, [search, activeFilter, sortKey]);

  // ── Actions ──────────────────────────────────────────────────
  const clearSearch   = useCallback(() => setSearch(''), []);
  const toggleViewMode = useCallback(
    () => setViewMode(v => v === 'grid' ? 'list' : 'grid'),
    []
  );
  const clearFilter   = useCallback(() => setActiveFilter('All'), []);

  const getMemberById = useCallback(
    (id: number) => MEMBERS.find(m => m.id === id) ?? null,
    []
  );

  const onlineMembersCount = useMemo(
    () => MEMBERS.filter(m => m.online).length,
    []
  );

  return {
    // State
    search,
    activeFilter,
    viewMode,
    sortKey,

    // Derived
    members:            filtered,
    totalCount:         MEMBERS.length,
    filteredCount:      filtered.length,
    filtersWithCounts,
    onlineMembersCount,
    isFiltering:        activeFilter !== 'All' || search.trim() !== '',

    // Setters
    setSearch,
    setActiveFilter,
    setViewMode,
    setSortKey,

    // Actions
    clearSearch,
    clearFilter,
    toggleViewMode,
    getMemberById,
  } as const;
}