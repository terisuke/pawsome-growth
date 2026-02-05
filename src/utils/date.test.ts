import { describe, expect, it, vi } from 'vitest';
import { calculateAge } from './date';

describe('calculateAge', () => {
  it('returns age in months if less than 1 year', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01'));
    // 2023-08-01 to 2024-01-01 is 5 months
    expect(calculateAge('2023-08-01')).toBe('5ヶ月');
    vi.useRealTimers();
  });

  it('returns age in years if exactly N years', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01'));
    // 2022-01-01 to 2024-01-01 is 2 years
    expect(calculateAge('2022-01-01')).toBe('2歳');
    vi.useRealTimers();
  });

  it('returns age in years and months', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-03-01'));
    // 2022-01-01 to 2024-03-01 is 2 years 2 months
    expect(calculateAge('2022-01-01')).toBe('2歳2ヶ月');
    vi.useRealTimers();
  });

  it('handles leap years correctly', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-02-28'));
    // 2024-02-29 (leap day) to 2025-02-28 is 11 months (technically 1 year is 2025-03-01)
    expect(calculateAge('2024-02-29')).toBe('11ヶ月');
    vi.useRealTimers();
  });
});
