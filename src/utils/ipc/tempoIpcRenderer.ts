import PromiseIpc from 'electron-promise-ipc/build/renderer';
import Preferences from '@/data/preferences';
import {
  AccountLinkByScopeResponse,
  ResultSetResponse,
  WorkAttributeResponse, WorklogResponse,
} from 'tempo-client/lib/responseTypes';
import { Worklog } from 'tempo-client/lib/requestTypes';

export default class TempoIpcRenderer {
  private preferences: Preferences = {
    jiraHost: '',
    jiraToken: '',
    jiraUsername: '',
    tempoToken: '',
  };

  setPreferences(preferences: Preferences): void {
    this.preferences = preferences;
  }

  async getWorkAttributes(): Promise<ResultSetResponse<WorkAttributeResponse>> {
    return await PromiseIpc.send('tempoGetWorkAttributes', {
      preferences: this.preferences,
    }) as Promise<ResultSetResponse<WorkAttributeResponse>>;
  }

  async getAccountLinksForProject(
    projectKey: string,
  ): Promise<ResultSetResponse<AccountLinkByScopeResponse>> {
    return await PromiseIpc.send('tempoGetAccountLinksForProject', {
      preferences: this.preferences,
      projectKey,
    }) as Promise<ResultSetResponse<AccountLinkByScopeResponse>>;
  }

  async postWorklog(
    worklog: Worklog,
  ): Promise<WorklogResponse> {
    return await PromiseIpc.send('tempoPostWorklog', {
      preferences: this.preferences,
      worklog,
    }) as Promise<WorklogResponse>;
  }
}
