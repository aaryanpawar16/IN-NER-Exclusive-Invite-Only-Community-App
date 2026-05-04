import { useState, useCallback, useMemo } from 'react';
import { Clipboard }                       from 'react-native';
import { toast }                           from '@/components/ui';
import { INVITE_BASE_URL, MAX_INVITES_PER_YEAR, REGEX } from '@/constants/config';
import { useAuthStore }                    from '@/store/authStore';

export type InviteStatus = 'pending' | 'approved' | 'rejected';

export type InviteRecord = {
  id:     string;
  email:  string;
  date:   string;
  status: InviteStatus;
  note?:  string;
};

const SEED_HISTORY: InviteRecord[] = [
  { id: '1', email: 'alex.t@gmail.com',    date: 'Apr 10', status: 'approved' },
  { id: '2', email: 'maya.l@studio.co',   date: 'Mar 22', status: 'pending'  },
];

export function useInvites() {
  const { user }                   = useAuthStore();
  const [history, setHistory]      = useState<InviteRecord[]>(SEED_HISTORY);
  const [email, setEmail]          = useState('');
  const [note, setNote]            = useState('');
  const [emailError, setEmailError] = useState('');
  const [copied, setCopied]        = useState(false);
  const [sending, setSending]      = useState(false);

  // ── Derived ──────────────────────────────────────────────────
  const inviteLink = useMemo(
    () => `${INVITE_BASE_URL}/${user?.inviteCode ?? 'jd-a9k2p'}`,
    [user?.inviteCode]
  );

  const usedCount      = history.length;
  const remainingCount = Math.max(0, MAX_INVITES_PER_YEAR - usedCount);
  const hasInvites     = remainingCount > 0;

  // ── Copy link ────────────────────────────────────────────────
  const copyLink = useCallback(async () => {
    try {
      await Clipboard.setStringAsync(inviteLink);
    } catch {
      Clipboard.setString(inviteLink);
    }
    setCopied(true);
    toast({ message: 'Invite link copied to clipboard', tone: 'default' });
    setTimeout(() => setCopied(false), 2000);
  }, [inviteLink]);

  // ── Validate email ───────────────────────────────────────────
  const validateEmail = useCallback((value: string): boolean => {
    if (!value.trim()) {
      setEmailError('Please enter an email address');
      return false;
    }
    if (!REGEX.email.test(value.trim())) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    const alreadySent = history.some(
      r => r.email.toLowerCase() === value.trim().toLowerCase()
    );
    if (alreadySent) {
      setEmailError('You\'ve already sent an invite to this address');
      return false;
    }
    setEmailError('');
    return true;
  }, [history]);

  // ── Send invite ──────────────────────────────────────────────
  const sendInvite = useCallback(async () => {
    if (!validateEmail(email)) return;
    if (!hasInvites) {
      toast({ message: 'No invitations remaining this year', tone: 'error' });
      return;
    }

    setSending(true);
    try {
      // Simulate API call
      await new Promise(res => setTimeout(res, 800));

      const record: InviteRecord = {
        id:     `invite-${Date.now()}`,
        email:  email.trim(),
        date:   new Date().toLocaleDateString('en-US', {
          month: 'short',
          day:   'numeric',
        }),
        status: 'pending',
        note:   note.trim() || undefined,
      };

      setHistory(prev => [record, ...prev]);
      setEmail('');
      setNote('');

      toast({
        message: `Invitation sent to ${record.email}`,
        tone:    'success',
      });
    } catch {
      toast({ message: 'Failed to send invite. Please try again.', tone: 'error' });
    } finally {
      setSending(false);
    }
  }, [email, note, hasInvites, validateEmail]);

  // ── Clear email error on change ──────────────────────────────
  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
    if (emailError) setEmailError('');
  }, [emailError]);

  return {
    // Form state
    email,
    note,
    emailError,
    copied,
    sending,

    // Derived
    inviteLink,
    history,
    usedCount,
    remainingCount,
    hasInvites,

    // Actions
    setEmail:    handleEmailChange,
    setNote,
    copyLink,
    sendInvite,
    validateEmail,
  } as const;
}