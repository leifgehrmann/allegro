import promiseIpc from 'electron-promise-ipc';
import JiraApi from 'jira-client';
import TempoApi from 'tempo-client';
import Preferences from '@/data/preferences';
import { PromiseIpcMain } from 'electron-promise-ipc/build/mainProcess';

export default function initializeIpc(): PromiseIpcMain {
  promiseIpc.on('testConnection', async (data: unknown|Preferences): Promise<void> => {
    const preferences = data as Preferences;

    const jira = new JiraApi({
      protocol: 'https',
      host: preferences.jiraHost,
      username: preferences.jiraUsername,
      password: preferences.jiraToken,
      apiVersion: '2',
      strictSSL: true,
    });
    const tempo = new TempoApi({
      protocol: 'https',
      host: 'api.tempo.io',
      bearerToken: preferences.tempoToken,
      apiVersion: '3',
    });

    const jiraResult = await jira.getCurrentUser();
    console.log(jiraResult);
    const tempoResult = await tempo.workAttributes.get();
    console.log(tempoResult);
  });
  return promiseIpc;
}
