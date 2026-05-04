import { api, buildQuery }  from './api';
import { MEMBERS }           from '@/constants/data';
import { DIRECTORY_PAGE_SIZE } from '@/constants/config';
import type { Member }       from '@/types/member.types';

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────

export type MembersQuery = {
  search?:    string;
  tag?:       string;
  city?:      string;
  page?:      number;
  pageSize?:  number;
  sort?:      'name' | 'city' | 'recent';
};

export type MembersPage = {
  items:      Member[];
  total:      number;
  page:       number;
  pageSize:   number;
  totalPages: number;
};

// ─────────────────────────────────────────────────────────────────
// Members service
// ─────────────────────────────────────────────────────────────────

export const membersService = {

  // ── List members ───────────────────────────────────────────
  list: async (query: MembersQuery = {}): Promise<MembersPage> => {
    // In production:
    // const qs = buildQuery({ ...query });
    // const res = await api.get<MembersPage>(`/members${qs}`);
    // return res.data;

    await new Promise(res => setTimeout(res, 300));

    const {
      search   = '',
      tag      = '',
      page     = 1,
      pageSize = DIRECTORY_PAGE_SIZE,
      sort     = 'name',
    } = query;

    let list = [...MEMBERS];

    if (tag && tag !== 'All') {
      list = list.filter(m => m.tags.includes(tag));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q)
      );
    }
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'city') list.sort((a, b) => a.city.localeCompare(b.city));

    const total      = list.length;
    const totalPages = Math.ceil(total / pageSize);
    const start      = (page - 1) * pageSize;
    const items      = list.slice(start, start + pageSize);

    return { items, total, page, pageSize, totalPages };
  },

  // ── Get member by id ───────────────────────────────────────
  getById: async (id: number): Promise<Member | null> => {
    // In production:
    // const res = await api.get<Member>(`/members/${id}`);
    // return res.data;

    await new Promise(res => setTimeout(res, 200));
    return MEMBERS.find(m => m.id === id) ?? null;
  },

  // ── Get online members ─────────────────────────────────────
  getOnline: async (): Promise<Member[]> => {
    await new Promise(res => setTimeout(res, 200));
    return MEMBERS.filter(m => m.online);
  },

  // ── Search members ─────────────────────────────────────────
  search: async (query: string): Promise<Member[]> => {
    // In production:
    // const res = await api.get<Member[]>(`/members/search${buildQuery({ q: query })}`);
    // return res.data;

    await new Promise(res => setTimeout(res, 150));
    const q = query.toLowerCase();
    return MEMBERS.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      m.city.toLowerCase().includes(q)
    );
  },

  // ── Get members by tag ─────────────────────────────────────
  getByTag: async (tag: string): Promise<Member[]> => {
    await new Promise(res => setTimeout(res, 200));
    return MEMBERS.filter(m => m.tags.includes(tag));
  },

  // ── Admin: remove member ───────────────────────────────────
  remove: async (id: number): Promise<void> => {
    // In production:
    // await api.delete(`/admin/members/${id}`);
    await new Promise(res => setTimeout(res, 400));
  },

  // ── Admin: broadcast message ───────────────────────────────
  broadcast: async (
    memberIds: number[],
    message:   string,
  ): Promise<void> => {
    // In production:
    // await api.post('/admin/members/broadcast', { memberIds, message });
    await new Promise(res => setTimeout(res, 600));
  },
};