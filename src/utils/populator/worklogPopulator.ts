import Worklog from '@/data/worklog';
import JiraIpcRenderer from '@/utils/ipc/jiraIpcRenderer';
import IndexedCache from '@/utils/cache/indexedCache';
import Preferences from '@/data/preferences';
import { JiraApiFieldObjectResponse, JiraApiIssueResponse } from '@/data/jiraApiResponseTypes';

export default class WorklogPopulator {
  private readonly worklogs: Worklog[];

  private readonly preferences: Preferences;

  private readonly jiraIpc: JiraIpcRenderer;

  private readonly issueCache: IndexedCache<JiraApiIssueResponse>;

  private readonly jiraTempoField: JiraApiFieldObjectResponse | null;

  constructor(
    worklogs: Worklog[],
    preferences: Preferences,
    jiraTempoField: JiraApiFieldObjectResponse|null,
    issueCache: IndexedCache<JiraApiIssueResponse>,
  ) {
    this.worklogs = worklogs;
    this.preferences = preferences;
    this.jiraIpc = new JiraIpcRenderer();
    this.jiraIpc.setPreferences(preferences);
    this.jiraTempoField = jiraTempoField;
    this.issueCache = issueCache;
  }

  async populate(): Promise<void> {
    const jiraTempoFieldId = this.getJiraTempoFieldId();

    await WorklogPopulator.asyncForEach(this.worklogs, async (worklog, index) => {
      if (worklog.issueKey !== '') {
        const jiraIssue = await this.getIssue(worklog.issueKey);
        if (jiraIssue.key === worklog.issueKey) {
          this.worklogs[index].issueKeyIsValid = true;
          this.worklogs[index].issueTitle = jiraIssue.fields.summary;
          this.worklogs[index].issueUrl = this.generateUrlForIssueKey(worklog.issueKey);
          this.worklogs[index].issueTempoAccountId = WorklogPopulator.getJiraIssueTempoAccountId(
            jiraIssue,
            jiraTempoFieldId,
          );
          return;
        }
      }
      this.worklogs[index].issueKeyIsValid = false;
      this.worklogs[index].issueTitle = '';
      this.worklogs[index].issueUrl = '';
      this.worklogs[index].issueTempoAccountId = null;
    });
  }

  private getJiraTempoFieldId(): string|null {
    if (this.jiraTempoField !== null) {
      return this.jiraTempoField.id;
    }
    return null;
  }

  private async getIssue(issueKey: string): Promise<JiraApiIssueResponse> {
    try {
      const cachedJiraIssue = this.issueCache.get(issueKey);
      if (cachedJiraIssue !== null) {
        return cachedJiraIssue;
      }
      const jiraIssue = (await this.jiraIpc.getIssue(issueKey)) as JiraApiIssueResponse;
      this.issueCache.set(issueKey, jiraIssue);
      return jiraIssue;
    } catch (error) {
      this.issueCache.set(issueKey, error.error);
      return error;
    }
  }

  private static getJiraIssueTempoAccountId(
    jiraIssue: JiraApiIssueResponse,
    jiraTempoFieldId: string|null,
  ): number|null {
    if (jiraTempoFieldId === null) {
      return null;
    }
    const jiraIssueTempoAccountObject = jiraIssue.fields[jiraTempoFieldId];
    if (
      typeof jiraIssueTempoAccountObject === 'object'
      && jiraIssueTempoAccountObject !== null
      && WorklogPopulator.objectHasProperty(jiraIssueTempoAccountObject, 'id')
      && typeof jiraIssueTempoAccountObject.id === 'number'
    ) {
      return jiraIssueTempoAccountObject.id;
    }
    return null;
  }

  // @see https://fettblog.eu/typescript-hasownproperty/
  /**
   * Used to resolve an `unknown` type to an object
   * @see https://fettblog.eu/typescript-hasownproperty/
   *
   * @param obj
   * @param prop
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  private static objectHasProperty<X extends {}, Y extends PropertyKey>(
    obj: X,
    prop: Y,
  ): obj is X & Record<Y, unknown> {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }

  private generateUrlForIssueKey(issueKey: string): string {
    return `https://${this.preferences.jiraHost}/browse/${issueKey}`;
  }

  private static async asyncForEach<T>(
    array: T[],
    callback: (element: T, index: number, originalArray: T[]) => void,
  ) {
    for (let index = 0; index < array.length; index += 1) {
      // Todo: Run callbacks in parallel, not synchronously
      // eslint-disable-next-line no-await-in-loop
      await callback(array[index], index, array);
    }
  }
}
