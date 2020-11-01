export interface JiraApiFieldObjectResponse {
  id: string;
  key: string;
}

export interface JiraApiIssueSuccessResponse {
  key: string;
  fields: {
    [key: string]: unknown;
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

export interface JiraApiIssueResponse
  extends JiraApiIssueSuccessResponse, JiraApiIssueErrorResponse {}
