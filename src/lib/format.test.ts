import { describe, expect, it } from 'vitest';
import { missingChaptersNote } from './format';

describe('missingChaptersNote', () => {
  it('is null when nothing is missing', () => {
    expect(missingChaptersNote([])).toBeNull();
  });

  it('names a single missing chapter', () => {
    expect(missingChaptersNote([6])).toBe('Chapter 6 is not available in this review set.');
  });

  it('lists several missing chapters', () => {
    expect(missingChaptersNote([6, 9])).toBe('Chapters 6 and 9 are not available in this review set.');
    expect(missingChaptersNote([2, 3, 6])).toBe('Chapters 2, 3 and 6 are not available in this review set.');
  });
});
