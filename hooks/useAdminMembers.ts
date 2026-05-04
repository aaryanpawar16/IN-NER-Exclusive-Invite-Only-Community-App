import { useState, useMemo, useCallback } from 'react';
import { useRouter }                       from 'expo-router';
import { toast }                           from '@/components/ui';
import { MEMBERS }                         from '@/constants/data';
import type { Member }                     from '@/types/member.types';
import type { AdminMemberSortKey }         from '@/constants/filters';
import { ADMIN_MEMBER_SORT_OPTIONS }       from '@/constants/filters';

export function useAdminMembers() {
  const router = useRouter();
  const [search,   setSearch]   = useState('');
  const [sortKey,  setSortKey]  = useState<AdminMemberSortKey>('name');
  const [selected, setSelected] = useState<number[]>([]);
  const [removed,  setRemoved]  = useState<number[]>([]);

  // ── Active members (not removed) ────────────────────────────
  const activeMembers = useMemo(
    () => MEMBERS.filter(m => !removed.includes(m.id)),
    [removed]
  );

  // ── Filtered + sorted ────────────────────────────────────────
  const filtered: Member[] = useMemo(() => {
    let list = [...activeMembers];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q)
      );
    }

    if (sortKey === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortKey === 'city') {
      list.sort((a, b) => a.city.localeCompare(b.city));
    }

    return list;
  }, [activeMembers, search, sortKey]);

  // ── Selection ────────────────────────────────────────────────
  const selectionMode = selected.length > 0;

  const toggleSelect = useCallback((id: number) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }, []);

  const clearSelection = useCallback(() => setSelected([]), []);

  const selectAll = useCallback(() => {
    setSelected(filtered.map(m => m.id));
  }, [filtered]);

  // ── Actions ──────────────────────────────────────────────────
  const handleRemove = useCallback((member: Member) => {
    setRemoved(prev => [...prev, member.id]);
    setSelected(prev => prev.filter(id => id !== member.id));
    toast({
      message: `${member.name} removed from INNER`,
      tone:    'default',
      action:  {
        label:   'Undo',
        onPress: () => setRemoved(prev => prev.filter(id => id !== member.id)),
      },
    });
  }, []);

  const handleBulkRemove = useCallback(() => {
    setRemoved(prev => [...prev, ...selected]);
    const count = selected.length;
    clearSelection();
    toast({
      message: `${count} member${count > 1 ? 's' : ''} removed`,
      tone:    'default',
    });
  }, [selected, clearSelection]);

  const handleBulkMessage = useCallback(() => {
    toast({
      message: `Broadcast sent to ${selected.length} members`,
      tone:    'success',
    });
    clearSelection();
  }, [selected, clearSelection]);

  const handleViewProfile = useCallback((member: Member) => {
    router.push(`/(member)/directory/${member.id}` as any);
  }, [router]);

  const handleMessage = useCallback((member: Member) => {
    router.push(`/(member)/messages/${member.id}` as any);
  }, [router]);

  // ── Derived ──────────────────────────────────────────────────
  const onlineCount = useMemo(
    () => activeMembers.filter(m => m.online).length,
    [activeMembers]
  );

  return {
    // State
    search,
    sortKey,
    selected,

    // Derived
    members:       filtered,
    totalCount:    activeMembers.length,
    filteredCount: filtered.length,
    selectionMode,
    onlineCount,
    sortOptions:   ADMIN_MEMBER_SORT_OPTIONS,
    isFiltering:   search.trim() !== '',

    // Actions
    setSearch,
    setSortKey,
    toggleSelect,
    clearSelection,
    selectAll,
    handleRemove,
    handleBulkRemove,
    handleBulkMessage,
    handleViewProfile,
    handleMessage,
  } as const;
}