// ─────────────────────────────────────────────────────────────────
// Shared UI primitive types
// ─────────────────────────────────────────────────────────────────

// Button
export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger' | 'gold';
export type ButtonSize    = 'sm' | 'md' | 'lg';

// Badge
export type BadgeTone = 'default' | 'gold' | 'sage' | 'rust' | 'dark' | 'ghost';
export type BadgeSize = 'sm' | 'md';

// Avatar
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Tag
export type TagSize = 'sm' | 'md';

// Toast
export type ToastTone     = 'default' | 'success' | 'error' | 'warning';
export type ToastPosition = 'bottom' | 'top';

export type ToastConfig = {
  id:        string;
  message:   string;
  tone?:     ToastTone;
  duration?: number;
  action?:   ToastAction;
};

export type ToastAction = {
  label:   string;
  onPress: () => void;
};

// Divider
export type DividerTone        = 'default' | 'strong' | 'gold';
export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerSpacing     = 'sm' | 'md' | 'lg';

// Empty state
export type EmptyStateProps = {
  icon?:            string;
  title:            string;
  hint?:            string;
  action?:          EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  compact?:         boolean;
};

export type EmptyStateAction = {
  label:   string;
  onPress: () => void;
};

// View mode (directory)
export type ViewMode = 'grid' | 'list';

// Sheet
export type SheetState<T> = {
  item:    T | null;
  visible: boolean;
};

// Form field
export type FieldProps = {
  value:         string;
  onChangeText:  (v: string) => void;
  onBlur?:       () => void;
  error?:        string;
};