import Preferences from '@/data/preferences';
import ObjectCache from '@/utils/objectCache';
import { WorkAttributeResponse } from 'tempo-client/lib/responseTypes';
import TempoIpcRenderer from '@/utils/tempoIpcRenderer';

export default class WorkAttributePopulator {
  private readonly preferences: Preferences;

  private readonly tempoIpc: TempoIpcRenderer;

  private readonly cache: ObjectCache<WorkAttributeResponse[]>;

  constructor(
    preferences: Preferences,
    cache: ObjectCache<WorkAttributeResponse[]>,
  ) {
    this.preferences = preferences;
    this.tempoIpc = new TempoIpcRenderer();
    this.tempoIpc.setPreferences(preferences);
    this.cache = cache;
  }

  async populate(): Promise<WorkAttributeResponse[]> {
    try {
      const cachedWorkAttributes = this.cache.get();
      if (cachedWorkAttributes !== null) {
        return cachedWorkAttributes;
      }
      const workAttributesResultSet = await this.tempoIpc.getWorkAttributes();
      const workAttributes = workAttributesResultSet.results;
      this.cache.set(workAttributes);
      return workAttributes;
    } catch (e) {
      // Todo: Don't silently error
      return [];
    }
  }
}
