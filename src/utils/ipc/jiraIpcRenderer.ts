import PromiseIpc from 'electron-promise-ipc/build/renderer';
import Preferences from '@/data/preferences';
import JiraApi from 'jira-client';

export default class JiraIpcRenderer {
  private preferences: Preferences = {
    jiraHost: '',
    jiraToken: '',
    jiraUsername: '',
    tempoToken: '',
  };

  setPreferences(preferences: Preferences): void {
    this.preferences = preferences;
  }

  async getIssue(issueKey: string): Promise<JiraApi.JsonResponse> {
    return await PromiseIpc.send('jiraGetIssue', {
      preferences: this.preferences,
      issueKey,
    }) as Promise<JiraApi.JsonResponse>;
  }

  async getCurrentUser(): Promise<JiraApi.JsonResponse> {
    return await PromiseIpc.send('jiraGetCurrentUser', {
      preferences: this.preferences,
    }) as Promise<JiraApi.JsonResponse>;
  }

  async getFields(): Promise<JiraApi.FieldObject[]> {
    return await PromiseIpc.send('jiraGetFields', {
      preferences: this.preferences,
    }) as Promise<JiraApi.FieldObject[]>;
  }
}
