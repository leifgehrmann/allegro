import Preferences from '@/data/preferences';
import ObjectCache from '@/utils/cache/objectCache';
import JiraIpcRenderer from '@/utils/ipc/jiraIpcRenderer';
import { JiraApiFieldObjectResponse } from '@/data/jiraApiResponseTypes';

export default class JiraTempoFieldPopulator {
  private readonly preferences: Preferences;

  private readonly jiraIpc: JiraIpcRenderer;

  private readonly cache: ObjectCache<JiraApiFieldObjectResponse>;

  constructor(
    preferences: Preferences,
    cache: ObjectCache<JiraApiFieldObjectResponse>,
  ) {
    this.preferences = preferences;
    this.jiraIpc = new JiraIpcRenderer();
    this.jiraIpc.setPreferences(preferences);
    this.cache = cache;
  }

  async populate(): Promise<JiraApiFieldObjectResponse|null> {
    try {
      const cachedField = this.cache.get();
      if (cachedField !== null) {
        return cachedField;
      }
      const fields = await this.jiraIpc.getFields();
      const jiraTempoAccountField = fields.find(
        (field) => field.key === 'io.tempo.jira__account',
      ) as JiraApiFieldObjectResponse;
      if (jiraTempoAccountField !== undefined) {
        this.cache.set(jiraTempoAccountField);
        return jiraTempoAccountField;
      }
      this.cache.invalidate();
      return null;
    } catch (e) {
      this.cache.invalidate();
      return null;
    }
  }
}
