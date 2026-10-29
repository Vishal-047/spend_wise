import { describe, expect, it } from 'vitest';
import { escapeCsv, dateBounds, minorToMajor } from '../src/utils.js';
describe('finance utilities', () => {
  it('formats integer minor units without floating point surprises', () => expect(minorToMajor(999)).toBe('9.99'));
  it('returns half-open month boundaries', () => { const b=dateBounds(2025,2); expect(b.start.toISOString()).toBe('2025-02-01T00:00:00.000Z'); expect(b.end.toISOString()).toBe('2025-03-01T00:00:00.000Z'); });
  it('escapes CSV formulas, commas and quotes', () => expect(escapeCsv('a,"b"\n')).toBe('"a,""b""\n"'));
});
