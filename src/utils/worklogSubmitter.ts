import Preferences from '@/data/preferences';
import TempoIpcRenderer from '@/utils/ipc/tempoIpcRenderer';
import Worklog from '@/data/worklog';
import { WorklogResponse } from 'tempo-client/lib/responseTypes';

export default class WorklogSubmitter {
  private readonly tempoIpc: TempoIpcRenderer;
  private readonly authorAccountId: string;

  constructor(preferences: Preferences, authorAccountId: string) {
    this.tempoIpc = new TempoIpcRenderer();
    this.tempoIpc.setPreferences(preferences);
    this.authorAccountId = authorAccountId;
  }

  submitWorklog(worklog: Worklog): Promise<WorklogResponse> {
    const seconds = Math.round(parseFloat(worklog.minutes) * 60);
    const attributes = Object.entries(worklog.workAttributes)
      .map((entry) => ({key: entry[0], value: entry[1]}));

    return this.tempoIpc.postWorklog({
      remainingEstimateSeconds: 0, // Todo: Remove when fix is made node-tempo-client
      authorAccountId: this.authorAccountId,
      billableSeconds: seconds,
      issueKey: worklog.issueKey,
      startDate: worklog.date,
      startTime: "12:00:00", // Todo: Is timezone a concern? Hopefully date has us covered.
      timeSpentSeconds: seconds,
      description: worklog.message,
      attributes,
    })
  }
}
