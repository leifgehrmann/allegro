export default interface Worklog {
  date: string;
  issueKey: string;
  issueKeyIsValid: boolean;
  issueUrl: string;
  issueTitle: string;
  minutes: number|undefined;
  message: string;
  projectAccounts: string[];
  issueAccount: string;
}
