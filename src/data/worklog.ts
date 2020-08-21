export default interface Worklog {
  uuid: string;
  selected: boolean;
  date: string;
  issueKey: string;
  issueKeyIsValid: boolean;
  issueUrl: string;
  issueTitle: string;
  issueTempoAccountId: number|null;
  minutes: string;
  message: string;
  issueAccount: string;
  workAttributes: Record<string, string>;
}
