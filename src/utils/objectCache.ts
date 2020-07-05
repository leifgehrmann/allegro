import Store from 'electron-store';

export default class ObjectCache<T> {
  private readonly name: string;

  private readonly store: Store<{[key: string]: T}>;

  private cache: T|null;

  constructor(name: string, store: Store) {
    this.name = name;
    this.store = store;
    this.cache = this.loadCacheFromStore();
  }

  get(): T|null {
    return this.cache;
  }

  set(value: T): void {
    this.cache = value;
    this.persistCacheInStore();
  }

  invalidate(): void {
    this.cache = null;
    this.invalidateCacheInStore();
  }

  private loadCacheFromStore(): T|null {
    const storeCache = this.store.get(this.name);
    if (typeof storeCache !== 'object') {
      return null;
    }
    return storeCache;
  }

  private persistCacheInStore() {
    if (this.cache !== null) {
      this.store.set(this.name, this.cache);
    }
  }

  private invalidateCacheInStore(): void {
    this.store.delete(this.name);
  }
}
