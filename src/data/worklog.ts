export default interface Worklog {
  uuid: string;
  date: string;
  issueKey: string;
  issueKeyIsValid: boolean;
  issueUrl: string;
  issueTitle: string;
  minutes: string;
  message: string;
  projectAccounts: string[];
  issueAccount: string;
}
