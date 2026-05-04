import { useState, useCallback } from 'react';
import { REGEX }                  from '@/constants/config';

type FieldValue = string;
type Errors<T>  = Partial<Record<keyof T, string>>;
type Validator<T> = (values: T) => Errors<T>;

type Options<T> = {
  initialValues: T;
  validate?:     Validator<T>;
  onSubmit:      (values: T) => void | Promise<void>;
};

export function useForm<T extends Record<string, FieldValue>>({
  initialValues,
  validate,
  onSubmit,
}: Options<T>) {
  const [values,      setValues]      = useState<T>(initialValues);
  const [errors,      setErrors]      = useState<Errors<T>>({});
  const [touched,     setTouched]     = useState<Partial<Record<keyof T, boolean>>>({});
  const [submitting,  setSubmitting]  = useState(false);
  const [submitted,   setSubmitted]   = useState(false);

  // ── Field change ─────────────────────────────────────────────
  const handleChange = useCallback((field: keyof T) => (value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  // ── Field blur ───────────────────────────────────────────────
  const handleBlur = useCallback((field: keyof T) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (validate) {
      const result = validate(values);
      if (result[field]) {
        setErrors(prev => ({ ...prev, [field]: result[field] }));
      }
    }
  }, [validate, values]);

  // ── Submit ───────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    // Mark all touched
    const allTouched = Object.keys(values).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {} as Record<keyof T, boolean>
    );
    setTouched(allTouched);

    // Validate
    if (validate) {
      const result = validate(values);
      if (Object.keys(result).length > 0) {
        setErrors(result);
        return;
      }
    }

    setSubmitting(true);
    try {
      await onSubmit(values);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }, [values, validate, onSubmit]);

  // ── Reset ────────────────────────────────────────────────────
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setSubmitting(false);
    setSubmitted(false);
  }, [initialValues]);

  // ── Set field directly ───────────────────────────────────────
  const setField = useCallback((field: keyof T, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);

  // ── Helpers ──────────────────────────────────────────────────
  const getFieldProps = useCallback((field: keyof T) => ({
    value:         values[field],
    onChangeText:  handleChange(field),
    onBlur:        handleBlur(field),
    error:         touched[field] ? errors[field] : undefined,
  }), [values, errors, touched, handleChange, handleBlur]);

  const isValid = validate
    ? Object.keys(validate(values)).length === 0
    : true;

  return {
    values,
    errors,
    touched,
    submitting,
    submitted,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setField,
    reset,
    getFieldProps,
  } as const;
}

// ─────────────────────────────────────────────────────────────────
// Pre-built validators
// ─────────────────────────────────────────────────────────────────

export type ApplicationFormValues = {
  firstName:        string;
  lastName:         string;
  email:            string;
  city:             string;
  role:             string;
  bio:              string;
  currentWork:      string;
  communityMeaning: string;
  referralSource:   string;
};

export function validateApplicationStep1(
  values: Pick<ApplicationFormValues, 'firstName' | 'lastName' | 'email' | 'city' | 'role'>
) {
  const errors: Partial<typeof values> = {};

  if (!values.firstName.trim()) {
    errors.firstName = 'First name is required';
  }
  if (!values.lastName.trim()) {
    errors.lastName = 'Last name is required';
  }
  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!REGEX.email.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address';
  }
  if (!values.city.trim()) {
    errors.city = 'City is required';
  }
  if (!values.role.trim()) {
    errors.role = 'Current role is required';
  }

  return errors;
}

export function validateApplicationStep3(
  values: Pick<ApplicationFormValues, 'currentWork' | 'communityMeaning' | 'referralSource'>
) {
  const errors: Partial<typeof values> = {};

  if (!values.currentWork.trim()) {
    errors.currentWork = 'Please tell us what you\'re working on';
  } else if (values.currentWork.trim().length < 40) {
    errors.currentWork = 'Please give us a bit more detail (40+ characters)';
  }

  if (!values.communityMeaning.trim()) {
    errors.communityMeaning = 'Please tell us what community means to you';
  } else if (values.communityMeaning.trim().length < 40) {
    errors.communityMeaning = 'Please give us a bit more detail (40+ characters)';
  }

  if (!values.referralSource) {
    errors.referralSource = 'Please select how you heard about INNER';
  }

  return errors;
}