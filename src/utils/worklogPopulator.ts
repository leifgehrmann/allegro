import Worklog from '@/data/worklog';
import JiraIpcRenderer from '@/utils/jiraIpcRenderer';
import Cache from '@/utils/cache';
import Preferences from '@/data/preferences';
import { JiraApiIssueResponse } from '@/data/jiraApiResponseTypes';

export default class WorklogPopulator {
  private readonly worklogs: Worklog[];

  private readonly preferences: Preferences;

  private readonly jiraIpc: JiraIpcRenderer;

  private readonly issueCache: Cache<JiraApiIssueResponse>;

  constructor(
    worklogs: Worklog[],
    preferences: Preferences,
    issueCache: Cache<JiraApiIssueResponse>,
  ) {
    this.worklogs = worklogs;
    this.preferences = preferences;
    this.jiraIpc = new JiraIpcRenderer();
    this.jiraIpc.setPreferences(preferences);
    this.issueCache = issueCache;
  }

  async populate(): Promise<void> {
    await WorklogPopulator.asyncForEach(this.worklogs, async (worklog, index) => {
      if (worklog.issueKey !== '') {
        const jiraIssue = await this.getIssue(worklog.issueKey);
        if (jiraIssue.key === worklog.issueKey) {
          this.worklogs[index].issueKeyIsValid = true;
          this.worklogs[index].issueTitle = jiraIssue.fields.summary;
          this.worklogs[index].issueUrl = this.generateUrlForIssueKey(worklog.issueKey);
          return;
        }
      }
      this.worklogs[index].issueKeyIsValid = false;
      this.worklogs[index].issueTitle = '';
      this.worklogs[index].issueUrl = '';
    });
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

  private generateUrlForIssueKey(issueKey: string): string {
    return `https://${this.preferences.jiraHost}/browse/${issueKey}`;
  }

  private static async asyncForEach<T>(
    array: T[],
    callback: (element: T, index: number, array: T[]) => void,
  ) {
    for (let index = 0; index < array.length; index += 1) {
      // Todo: Run callbacks in parallel, not synchronously
      // eslint-disable-next-line no-await-in-loop
      await callback(array[index], index, array);
    }
  }
}
