import Store from 'electron-store';

export default class IndexedCache<T> {
  private readonly name: string;

  private readonly store: Store<{[key: string]: {[key: string]: T}}>;

  private cache: {[key: string]: T};

  constructor(name: string, store: Store) {
    this.name = name;
    this.store = store;
    this.cache = this.loadCacheFromStore();
  }

  get(key: string): T|null {
    if (key in this.cache) {
      return this.cache[key];
    }
    return null;
  }

  set(key: string, value: T): void {
    this.cache[key] = value;
    this.persistCacheInStore();
  }

  invalidate(): void {
    this.cache = {};
    this.invalidateCacheInStore();
  }

  private loadCacheFromStore(): {[key: string]: T} {
    const storeCache = this.store.get(this.name);
    if (typeof storeCache !== 'object') {
      return {};
    }
    return storeCache;
  }

  private persistCacheInStore() {
    this.store.set(this.name, this.cache);
  }

  private invalidateCacheInStore(): void {
    this.store.delete(this.name);
  }
}
