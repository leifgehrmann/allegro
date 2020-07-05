import { PromiseIpcMain } from 'electron-promise-ipc/build/mainProcess';
import Preferences from '@/data/preferences';
import JiraApi from 'jira-client';

function createJiraClient(preferences: Preferences): JiraApi {
  // Todo: Cache the client to avoid recreating the instance for every request
  return new JiraApi({
    protocol: 'https',
    host: preferences.jiraHost,
    username: preferences.jiraUsername,
    password: preferences.jiraToken,
    apiVersion: '2',
    strictSSL: true,
  });
}

export default function initialiseJiraIpcMain(promiseIpcMain: PromiseIpcMain): void {
  promiseIpcMain.on('jiraGetIssue', async (data: unknown): Promise<JiraApi.JsonResponse> => {
    const dataParsed = data as {preferences: Preferences, issueKey: string};
    const jiraClient = createJiraClient(dataParsed.preferences);

    // const tempo = new TempoApi({
    //   protocol: 'https',
    //   host: 'api.tempo.io',
    //   bearerToken: preferences.tempoToken,
    //   apiVersion: '3',
    // });

    return jiraClient.findIssue(dataParsed.issueKey);
  });
}
