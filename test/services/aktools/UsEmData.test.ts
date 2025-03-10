import UsEmDataService from '@/services/aktools/UsEmData';
import { beforeAll, describe, expect, it } from 'vitest';

describe('UsEmDataService', () => {
  beforeAll(async () => {
    await UsEmDataService.init();
  });

  it('should return "105.QQQ" for query "QQQ"', () => {
    const result = UsEmDataService.getValue('QQQ');
    expect(result).toBe('105.QQQ');
  });

  it('should return "107.SPY" for query "SPY"', () => {
    const result = UsEmDataService.getValue('SPY');
    expect(result).toBe('107.SPY');
  });

  it('should return "105.MSFT" for query "MSFT"', () => {
    const result = UsEmDataService.getValue('MSFT');
    expect(result).toBe('105.MSFT');
  });
});
