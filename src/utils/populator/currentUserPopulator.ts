import Preferences from '@/data/preferences';
import JiraIpcRenderer from '@/utils/ipc/jiraIpcRenderer';
import { JiraApiCurrentUserSuccessResponse } from '@/data/jiraApiResponseTypes';

export default class CurrentUserPopulator {
  private readonly jiraIpc: JiraIpcRenderer;

  constructor(preferences: Preferences) {
    this.jiraIpc = new JiraIpcRenderer();
    this.jiraIpc.setPreferences(preferences);
  }

  async get(): Promise<JiraApiCurrentUserSuccessResponse> {
    return await this.jiraIpc.getCurrentUser() as JiraApiCurrentUserSuccessResponse;
  }
}
