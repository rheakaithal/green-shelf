import { describe, it, expect } from 'vitest';
import { formatTime, getLogStyle } from '../lib/utils'; // Adjust path if needed

describe('utils.ts', () => {
  describe('formatTime', () => {
    it('should format a timestamp correctly', () => {
      // Create a known date. Note: Timezone might affect this if not careful, 
      // but we'll test the basic return type and inclusion of keywords.
      const timestamp = new Date('2023-01-01T12:00:00Z').getTime();
      const result = formatTime(timestamp);
      
      expect(typeof result).toBe('string');
      expect(result).toContain('at');
    });
  });

  describe('getLogStyle', () => {
    it('should return correct style for "fully used"', () => {
      const style = getLogStyle('fully used');
      expect(style.icon).toBe('check_circle');
      expect(style.color).toContain('text-green');
    });

    it('should return correct style for "donated"', () => {
      const style = getLogStyle('donated');
      expect(style.icon).toBe('volunteer_activism');
      expect(style.color).toContain('text-green');
    });

    it('should return correct style for "expired"', () => {
      const style = getLogStyle('expired');
      expect(style.icon).toBe('delete_sweep');
      expect(style.color).toContain('text-red');
    });

    it('should return default style for unknown actions', () => {
      const style = getLogStyle('unknown');
      expect(style.icon).toBe('info');
      expect(style.color).toContain('text-slate');
    });
  });
});
