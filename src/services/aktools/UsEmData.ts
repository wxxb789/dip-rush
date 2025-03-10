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
  private static initPromise: Promise<UsEmDataService> | null = null;
  private data: UsEmDataDictionary | null = null;

  private constructor() {}

  public static async getInstance(): Promise<UsEmDataService> {
    if (!UsEmDataService.initPromise) {
      UsEmDataService.initPromise = new Promise<UsEmDataService>(
        (resolve, reject) => {
          if (!UsEmDataService.instance) {
            UsEmDataService.instance = new UsEmDataService();
            UsEmDataService.instance
              .loadData()
              .then(() => {
                resolve(UsEmDataService.instance);
              })
              .catch((error) => {
                reject(error);
              });
          } else {
            resolve(UsEmDataService.instance);
          }
        }
      );
    }
    return UsEmDataService.initPromise;
  }

  private async loadData(): Promise<void> {
    if (this.data !== null) {
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
    } catch (error) {
      throw new Error(
        `Failed to load US EM data: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  // Instance methods for data access
  public get dictionary(): UsEmDataDictionary {
    if (this.data === null) {
      throw new Error('US EM data not initialized');
    }
    return this.data;
  }

  public getKeys(): string[] {
    return Array.from(this.dictionary.keys());
  }

  public getValues(): string[] {
    return Array.from(this.dictionary.values());
  }

  public getEntries(): [string, string][] {
    return Array.from(this.dictionary.entries());
  }

  public getValue(key: string): string | undefined {
    return this.dictionary.get(key);
  }

  // Static convenience methods
  public static async getKeys(): Promise<string[]> {
    const instance = await UsEmDataService.getInstance();
    return instance.getKeys();
  }

  public static async getValues(): Promise<string[]> {
    const instance = await UsEmDataService.getInstance();
    return instance.getValues();
  }

  public static async getEntries(): Promise<[string, string][]> {
    const instance = await UsEmDataService.getInstance();
    return instance.getEntries();
  }

  public static async getValue(key: string): Promise<string | undefined> {
    const instance = await UsEmDataService.getInstance();
    return instance.getValue(key);
  }

  // Safe version with Result type
  public static async getValueSafe(key: string): Promise<Result<string>> {
    try {
      const instance = await UsEmDataService.getInstance();
      const value = instance.getValue(key);

      if (value === undefined) {
        return {
          success: false,
          error: new Error(`Key '${key}' not found in US EM data`),
        };
      }

      return { success: true, data: value };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  }
}

export default UsEmDataService;
