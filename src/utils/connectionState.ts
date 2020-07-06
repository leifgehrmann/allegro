import Preferences from '@/data/preferences';
import JiraIpcRenderer from '@/utils/ipc/jiraIpcRenderer';
import TempoIpcRenderer from '@/utils/ipc/tempoIpcRenderer';

type State = 'connected'|'errored';

export default class ConnectionState {
  private readonly preferences: Preferences;

  constructor(preferences: Preferences) {
    this.preferences = preferences;
  }

  async getJiraState(): Promise<State> {
    const jiraIpcRenderer = new JiraIpcRenderer();
    jiraIpcRenderer.setPreferences(this.preferences);
    try {
      await jiraIpcRenderer.getCurrentUser();
      return 'connected';
    } catch (error) {
      return 'errored';
    }
  }

  async getTempoState(): Promise<State> {
    const tempoIpcRenderer = new TempoIpcRenderer();
    tempoIpcRenderer.setPreferences(this.preferences);
    try {
      await tempoIpcRenderer.getWorkAttributes();
      return 'connected';
    } catch (error) {
      return 'errored';
    }
  }
}
