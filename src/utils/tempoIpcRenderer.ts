import PromiseIpc from 'electron-promise-ipc/build/renderer';
import Preferences from '@/data/preferences';
import { ResultSetResponse, WorkAttributeResponse } from 'tempo-client/lib/responseTypes';

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
}
