import Worklog from '@/data/worklog';
import JiraIpcRenderer from '@/utils/jiraIpcRenderer';
import Preferences from '@/data/preferences';

export default class WorklogPopulator {
  private readonly worklogs: Worklog[];

  private readonly preferences: Preferences;

  private readonly jiraIpc: JiraIpcRenderer;

  constructor(worklogs: Worklog[], preferences: Preferences) {
    this.worklogs = worklogs;
    this.preferences = preferences;
    this.jiraIpc = new JiraIpcRenderer();
    this.jiraIpc.setPreferences(preferences);
  }

  async populate(): Promise<void> {
    await WorklogPopulator.asyncForEach(this.worklogs, async (worklog, index) => {
      try {
        const jiraIssue = await this.jiraIpc.getIssue(worklog.issueKey);
        console.log(jiraIssue);
        if (jiraIssue.fields?.summary !== undefined) {
          this.worklogs[index].issueKeyIsValid = true;
          this.worklogs[index].issueTitle = jiraIssue.fields.summary;
          this.worklogs[index].issueUrl = this.generateUrlForIssueKey(worklog.issueKey);
        } else {
          this.worklogs[index].issueKeyIsValid = false;
          this.worklogs[index].issueTitle = '';
        }
      } catch (e) {
        this.worklogs[index].issueKeyIsValid = false;
        this.worklogs[index].issueTitle = '';
      }
    });
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
