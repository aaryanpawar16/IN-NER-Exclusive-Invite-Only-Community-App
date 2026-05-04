import { useState, useMemo, useCallback }  from 'react';
import { useAdminStore }                   from '@/store/adminStore';
import { toast }                           from '@/components/ui';
import type { Application }                from '@/types/application.types';
import type { AdminApplicationTabKey }     from '@/constants/filters';
import { ADMIN_APPLICATION_TABS }          from '@/constants/filters';

export function useAdminApplications() {
  const { applications, approveApplication, rejectApplication } = useAdminStore();
  const [activeTab,  setActiveTab]  = useState<AdminApplicationTabKey>('pending');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // ── Tab counts ───────────────────────────────────────────────
  const tabsWithCounts = useMemo(() =>
    ADMIN_APPLICATION_TABS.map(t => ({
      ...t,
      count: applications.filter(a => a.status === t.key).length,
    })),
    [applications]
  );

  // ── Filtered list ────────────────────────────────────────────
  const filtered: Application[] = useMemo(() => {
    let list = applications.filter(a => a.status === activeTab);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a =>
        `${a.firstName} ${a.lastName}`.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q)
      );
    }
    return list;
  }, [applications, activeTab, searchQuery]);

  // ── Expand / collapse ────────────────────────────────────────
  const toggleExpanded = useCallback((id: number) => {
    setExpandedId(prev => prev === id ? null : id);
  }, []);

  // ── Approve ──────────────────────────────────────────────────
  const handleApprove = useCallback((app: Application) => {
    approveApplication(app.id);
    setExpandedId(null);
    toast({
      message: `${app.firstName} ${app.lastName} approved and welcomed`,
      tone:    'success',
    });
  }, [approveApplication]);

  // ── Reject ───────────────────────────────────────────────────
  const handleReject = useCallback((app: Application) => {
    rejectApplication(app.id);
    setExpandedId(null);
    toast({
      message: `${app.firstName} ${app.lastName} — application declined`,
      tone:    'default',
    });
  }, [rejectApplication]);

  // ── Derived ──────────────────────────────────────────────────
  const pendingCount = useMemo(
    () => applications.filter(a => a.status === 'pending').length,
    [applications]
  );

  const isEmpty = filtered.length === 0;

  return {
    // State
    activeTab,
    expandedId,
    searchQuery,

    // Derived
    applications:  filtered,
    tabsWithCounts,
    pendingCount,
    isEmpty,

    // Actions
    setActiveTab,
    setSearchQuery,
    toggleExpanded,
    handleApprove,
    handleReject,
  } as const;
}