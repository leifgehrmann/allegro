import { PromiseIpcMain } from 'electron-promise-ipc/build/mainProcess';
import Preferences from '@/data/preferences';
import TempoApi from 'tempo-client';
import {
  AccountLinkByScopeResponse,
  ResultSetResponse,
  WorkAttributeResponse,
} from 'tempo-client/lib/responseTypes';

function createTempoClient(preferences: Preferences): TempoApi {
  // Todo: ObjectCache the client to avoid recreating the instance for every request
  return new TempoApi({
    protocol: 'https',
    host: 'api.tempo.io',
    bearerToken: preferences.tempoToken,
    apiVersion: '3',
  });
}

export default function initialiseTempoIpcMain(promiseIpcMain: PromiseIpcMain): void {
  promiseIpcMain.on(
    'tempoGetWorkAttributes',
    async (data: unknown): Promise<ResultSetResponse<WorkAttributeResponse>> => {
      const dataParsed = data as { preferences: Preferences };
      const tempoClient = createTempoClient(dataParsed.preferences);
      return tempoClient.workAttributes.get();
    },
  );

  promiseIpcMain.on(
    'tempoGetAccountLinksForProject',
    async (data: unknown): Promise<ResultSetResponse<AccountLinkByScopeResponse>> => {
      const dataParsed = data as { preferences: Preferences, projectKey: string };
      const tempoClient = createTempoClient(dataParsed.preferences);
      return tempoClient.accountLinks.getForProject(dataParsed.projectKey);
    },
  );
}
