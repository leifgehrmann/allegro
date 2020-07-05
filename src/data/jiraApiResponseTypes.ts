export interface JiraApiIssueResponse
  extends JiraApiIssueSuccessResponse, JiraApiIssueErrorResponse {}

export interface JiraApiIssueSuccessResponse {
  key: string;
  fields: {
    summary: string;
  }
}

export interface JiraApiCurrentUserSuccessResponse {
  accountId: string;
}

export interface JiraApiIssueErrorResponse {
  errorMessages: string[],
  errors: Record<string, unknown>
}
