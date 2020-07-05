import Worklog from '@/data/worklog';
import TempoIpcRenderer from '@/utils/ipc/tempoIpcRenderer';
import IndexedCache from '@/utils/cache/indexedCache';
import Preferences from '@/data/preferences';
import { AccountLinkByScopeResponse, ResultSetResponse } from 'tempo-client/lib/responseTypes';

export default class ProjectAccountLinksPopulator {
  private readonly worklogs: Worklog[];

  private readonly preferences: Preferences;

  private readonly tempoIpc: TempoIpcRenderer;

  private readonly projectsAccountLinks: Record<string, AccountLinkByScopeResponse[]>;

  private readonly projectsAccountLinksCache: IndexedCache<AccountLinkByScopeResponse[]>;

  constructor(
    worklogs: Worklog[],
    projectsAccountLinks: Record<string, AccountLinkByScopeResponse[]>,
    preferences: Preferences,
    projectsAccountLinksCache: IndexedCache<AccountLinkByScopeResponse[]>,
  ) {
    this.worklogs = worklogs;
    this.projectsAccountLinks = projectsAccountLinks;
    this.preferences = preferences;
    this.tempoIpc = new TempoIpcRenderer();
    this.tempoIpc.setPreferences(preferences);
    this.projectsAccountLinksCache = projectsAccountLinksCache;
  }

  async populate(): Promise<void> {
    await ProjectAccountLinksPopulator.asyncForEach(this.worklogs, async (worklog) => {
      if (worklog.issueKey !== '') {
        const projectKey = ProjectAccountLinksPopulator.getProjectKeyFromIssueKey(worklog.issueKey);
        if (!(projectKey in this.projectsAccountLinks)) {
          this.projectsAccountLinks[projectKey] = await this.getProjectAccountLinks(
            projectKey,
          );
        }
      }
    });
  }

  private async getProjectAccountLinks(projectKey: string): Promise<AccountLinkByScopeResponse[]> {
    try {
      const cachedProjectAccountLinks = this.projectsAccountLinksCache.get(projectKey);
      if (cachedProjectAccountLinks !== null) {
        return cachedProjectAccountLinks;
      }
      const projectAccountLinksResultSet = (
        await this.tempoIpc.getAccountLinksForProject(projectKey)
      ) as ResultSetResponse<AccountLinkByScopeResponse>;
      const projectAccountLinks = projectAccountLinksResultSet.results;
      this.projectsAccountLinksCache.set(projectKey, projectAccountLinks);
      return projectAccountLinks;
    } catch (error) {
      // Todo: Don't silently error
      this.projectsAccountLinksCache.set(projectKey, []);
      return [];
    }
  }

  private static getProjectKeyFromIssueKey(issueKey: string): string {
    return issueKey.split('-')[0];
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
