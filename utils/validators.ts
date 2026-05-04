import { REGEX, MAX_MESSAGE_LENGTH } from '@/constants/config';
import type {
  ApplicationStep1,
  ApplicationStep2,
  ApplicationStep3,
}                                    from '@/types/application.types';

// ─────────────────────────────────────────────────────────────────
// Primitive validators
// ─────────────────────────────────────────────────────────────────

export function isRequired(value: string, fieldName = 'This field'): string | null {
  return value.trim() ? null : `${fieldName} is required`;
}

export function isEmail(value: string): string | null {
  if (!value.trim()) return 'Email is required';
  return REGEX.email.test(value.trim())
    ? null
    : 'Please enter a valid email address';
}

export function isInviteCode(value: string): string | null {
  if (!value.trim()) return 'Invite code is required';
  return REGEX.inviteCode.test(value.trim().toLowerCase())
    ? null
    : 'Code format should be like: jd-a9k2p';
}

export function isMinLength(
  value:     string,
  min:       number,
  fieldName: string = 'This field',
): string | null {
  return value.trim().length >= min
    ? null
    : `${fieldName} must be at least ${min} characters`;
}

export function isMaxLength(
  value:     string,
  max:       number,
  fieldName: string = 'This field',
): string | null {
  return value.trim().length <= max
    ? null
    : `${fieldName} must be ${max} characters or fewer`;
}

export function isUrl(value: string): string | null {
  if (!value.trim()) return null;
  return REGEX.url.test(value.trim())
    ? null
    : 'Please enter a valid URL (starting with https://)';
}

export function isNonEmpty<T>(
  arr:       T[],
  fieldName: string = 'Selection',
): string | null {
  return arr.length > 0
    ? null
    : `${fieldName} is required`;
}

export function isMinItems<T>(
  arr:       T[],
  min:       number,
  fieldName: string = 'Selection',
): string | null {
  return arr.length >= min
    ? null
    : `Please select at least ${min} ${fieldName.toLowerCase()}`;
}

export function isMessageValid(text: string): string | null {
  if (!text.trim())                          return 'Message cannot be empty';
  if (text.length > MAX_MESSAGE_LENGTH)      return `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer`;
  return null;
}

// ─────────────────────────────────────────────────────────────────
// Compose validators
// ─────────────────────────────────────────────────────────────────

type Validator = (value: string) => string | null;

/**
 * Runs validators in order, returns the first error or null.
 */
export function composeValidators(...validators: Validator[]) {
  return (value: string): string | null => {
    for (const validate of validators) {
      const error = validate(value);
      if (error) return error;
    }
    return null;
  };
}

// ─────────────────────────────────────────────────────────────────
// Application form validators
// ─────────────────────────────────────────────────────────────────

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

export function validateStep1(
  values: ApplicationStep1,
): FieldErrors<ApplicationStep1> {
  const errors: FieldErrors<ApplicationStep1> = {};

  const firstNameErr = isRequired(values.firstName, 'First name');
  if (firstNameErr) errors.firstName = firstNameErr;

  const lastNameErr = isRequired(values.lastName, 'Last name');
  if (lastNameErr) errors.lastName = lastNameErr;

  const emailErr = isEmail(values.email);
  if (emailErr) errors.email = emailErr;

  const cityErr = isRequired(values.city, 'City');
  if (cityErr) errors.city = cityErr;

  const roleErr = isRequired(values.role, 'Current role');
  if (roleErr) errors.role = roleErr;

  return errors;
}

export function validateStep2(
  values: ApplicationStep2,
): FieldErrors<ApplicationStep2> {
  const errors: FieldErrors<ApplicationStep2> = {};

  const bioErr =
    isRequired(values.bio, 'Bio') ??
    isMinLength(values.bio, 40, 'Bio');
  if (bioErr) errors.bio = bioErr;

  const interestsErr = isMinItems(values.interests, 1, 'Interests');
  if (interestsErr) errors.interests = interestsErr as any;

  return errors;
}

export function validateStep3(
  values: ApplicationStep3,
): FieldErrors<ApplicationStep3> {
  const errors: FieldErrors<ApplicationStep3> = {};

  const workErr =
    isRequired(values.currentWork, 'Current work') ??
    isMinLength(values.currentWork, 40, 'Current work');
  if (workErr) errors.currentWork = workErr;

  const communityErr =
    isRequired(values.communityMeaning, 'Community response') ??
    isMinLength(values.communityMeaning, 40, 'Community response');
  if (communityErr) errors.communityMeaning = communityErr;

  const referralErr = isRequired(values.referralSource, 'Referral source');
  if (referralErr) errors.referralSource = referralErr;

  return errors;
}

/**
 * Returns true if a step has no errors.
 */
export function isStepValid<T>(errors: FieldErrors<T>): boolean {
  return Object.keys(errors).length === 0;
}

// ─────────────────────────────────────────────────────────────────
// Invite form
// ─────────────────────────────────────────────────────────────────

export type InviteFormErrors = {
  email?: string;
};

export function validateInviteForm(
  email:   string,
  history: { email: string }[],
): InviteFormErrors {
  const errors: InviteFormErrors = {};

  const emailErr = isEmail(email);
  if (emailErr) {
    errors.email = emailErr;
    return errors;
  }

  const duplicate = history.some(
    r => r.email.toLowerCase() === email.trim().toLowerCase()
  );
  if (duplicate) {
    errors.email = 'You\'ve already sent an invite to this address';
  }

  return errors;
}