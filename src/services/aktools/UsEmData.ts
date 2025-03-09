/**
 * US EM Data Service - Provides type-safe access to US EM codes
 * Implements singleton pattern with lazy loading and runtime validation
 */
interface Result<T> {
  success: boolean;
  data?: T;
  error?: Error;
}

type RawUsEmData = Record<string, string>;
type UsEmDataDictionary = ReadonlyMap<string, string>;

const isRawUsEmData = (data: unknown): data is RawUsEmData => {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  return Object.entries(data).every(
    ([key, value]) => typeof key === 'string' && typeof value === 'string'
  );
};

class UsEmDataService {
  private static instance: UsEmDataService;
  private data: UsEmDataDictionary | null = null;
  private initialized = false;

  private constructor() {}

  public static async init(): Promise<Result<UsEmDataService>> {
    try {
      const instance = await UsEmDataService.getInstance();
      return { success: true, data: instance };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new Error('Unknown initialization error'),
      };
    }
  }

  public static async getInstance(): Promise<UsEmDataService> {
    if (!UsEmDataService.instance) {
      UsEmDataService.instance = new UsEmDataService();
      await UsEmDataService.instance.loadData();
    }
    return UsEmDataService.instance;
  }

  private async loadData(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      const module = await import('../../data/us_em.json');
      const rawData = module.default;

      if (!isRawUsEmData(rawData)) {
        throw new Error('Invalid US EM data format');
      }

      this.data = new Map(Object.entries(rawData));
      Object.freeze(this.data);
      this.initialized = true;
    } catch (error) {
      throw new Error(
        `Failed to load US EM data: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  public static get dictionary(): UsEmDataDictionary | null {
    return UsEmDataService.instance?.data || null;
  }

  public static getKeys(): string[] {
    return Array.from(UsEmDataService.dictionary?.keys() || []);
  }

  public static getValues(): string[] {
    return Array.from(UsEmDataService.dictionary?.values() || []);
  }

  public static getEntries(): [string, string][] {
    return Array.from(UsEmDataService.dictionary?.entries() || []);
  }

  public static getValue(key: string): string | undefined {
    return UsEmDataService.dictionary?.get(key);
  }
}

export default UsEmDataService;
