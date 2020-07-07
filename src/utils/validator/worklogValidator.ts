import Worklog from '@/data/worklog';
import { WorkAttributeResponse } from 'tempo-client/lib/responseTypes';

export default class WorklogValidator {
  private workAttributes: WorkAttributeResponse[];

  constructor(workAttributes: WorkAttributeResponse[]) {
    this.workAttributes = workAttributes;
  }

  validate(worklog: Worklog): boolean {
    if (worklog.date.length === 0) {
      return false;
    }

    if (!worklog.issueKeyIsValid) {
      return false;
    }

    if (parseFloat(worklog.minutes) <= 0 || Number.isNaN(parseFloat(worklog.minutes))) {
      return false;
    }

    if (worklog.message.length === 0) {
      return false;
    }

    // Work Attributes
    let validWorkAttributeValue = true;
    this.workAttributes.forEach((workAttribute) => {
      const workAttributeKey = workAttribute.key;
      const workAttributeIsRequired = workAttribute.required;
      if (
        workAttributeIsRequired
        && (
          worklog.workAttributes[workAttributeKey] === undefined
          || worklog.workAttributes[workAttributeKey] === ''
        )
      ) {
        validWorkAttributeValue = false;
      }
    });

    return validWorkAttributeValue;
  }
}
