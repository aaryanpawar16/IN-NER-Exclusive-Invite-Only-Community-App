// ─────────────────────────────────────────────────────────────────
// Debounce
// ─────────────────────────────────────────────────────────────────

/**
 * Returns a debounced version of a function.
 * The returned function delays invoking fn until after
 * wait ms have elapsed since the last call.
 */
import { useRef, useCallback, useEffect, useState } from 'react';

// Replace the useDebounceValue function with:
export function useDebounceValue<T>(value: T, wait: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), wait);
    return () => clearTimeout(timer);
  }, [value, wait]);

  return debounced;
}

/**
 * Returns a throttled version of a function.
 * The returned function invokes fn at most once per
 * wait ms, regardless of how many times it is called.
 */
export function throttle<T extends (...args: any[]) => any>(
  fn:   T,
  wait: number,
): (...args: Parameters<T>) => void {
  let lastTime = 0;
  let timer:    ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = wait - (now - lastTime);

    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastTime = now;
      fn(...args);
    } else if (!timer) {
      timer = setTimeout(() => {
        lastTime = Date.now();
        timer    = null;
        fn(...args);
      }, remaining);
    }
  };
}

/**
 * Returns a function that fires immediately on the first call,
 * then ignores subsequent calls for wait ms.
 */
export function leading<T extends (...args: any[]) => any>(
  fn:   T,
  wait: number,
): (...args: Parameters<T>) => void {
  let blocked = false;

  return (...args: Parameters<T>) => {
    if (blocked) return;
    fn(...args);
    blocked = true;
    setTimeout(() => { blocked = false; }, wait);
  };
}

// ─────────────────────────────────────────────────────────────────
// React hook versions
// ─────────────────────────────────────────────────────────────────

import { useRef, useCallback, useEffect } from 'react';

/**
 * Returns a stable debounced callback for use in React components.
 * The callback reference is stable across renders.
 */
export function useDebounce<T extends (...args: any[]) => any>(
  fn:   T,
  wait: number,
): (...args: Parameters<T>) => void {
  const fnRef    = useRef(fn);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { fnRef.current = fn; });

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return useCallback((...args: Parameters<T>) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      fnRef.current(...args);
    }, wait);
  }, [wait]);
}

/**
 * Debounces a value — returns the value only after
 * it has stopped changing for wait ms.
 */
export function useDebounceValue<T>(value: T, wait: number): T {
  const { useState } = require('react');
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), wait);
    return () => clearTimeout(timer);
  }, [value, wait]);

  return debounced;
}