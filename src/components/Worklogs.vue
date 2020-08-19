<template>
  <table class="worklogs">
    <tr>
      <th scope="col" />
      <th scope="col" />
      <th scope="col">Date</th>
      <th scope="col">Issue</th>
      <th scope="col">Minutes</th>
      <th scope="col">Message</th>
      <th scope="col" v-for="workAttribute in workAttributes" :key="workAttribute.key">
        {{workAttribute.name}}
        <span v-if="workAttribute.required">*</span>
      </th>
      <th scope="col">Actions</th>
    </tr>
    <draggable :list="worklogs" tag="tbody" handle=".handle">
      <tr v-for="(item, index) in worklogs" :key="item.uuid">
        <td
          class="worklog-drag"
          :class="{ handle: !disableUi }"
        >
          <button>
          <font-awesome-icon
            icon="grip-lines"
            v-if="!worklogsValidation[index]"
            title="Click and drag to reorder"
          />
          <font-awesome-icon
            icon="check"
            v-if="worklogsValidation[index]"
            title="This worklog is valid ✨"
          />
          </button>
        </td>
        <td
          class="worklog-select"
        >
          <button>
          <font-awesome-icon
            icon="check"
            title="Select"
          />
          </button>
        </td>
        <td
          class="worklog-date"
        >
          <DateSelector
            :value.sync="item.date"
            :disabled="disableUi"
          />
        </td>
        <td
          class="worklog-issue"
        >
          <IssueSelector
            :issue-key.sync="item.issueKey"
            :issue-key-is-valid.sync="item.issueKeyIsValid"
            :issue-url="item.issueUrl"
            :issue-title="item.issueTitle"
            :disabled="disableUi"
          />
        </td>
        <td
          class="worklog-minutes"
        >
          <div class="minutesField">
            <label>
              <input
                type="number"
                min="0"
                placeholder="0"
                v-model="item.minutes"
                :disabled="disableUi"
              >
            </label>
          </div>
        </td>
        <td
          class="worklog-message"
        >
          <div class="messageField">
            <label>
              <textarea
                rows="1"
                v-model="item.message"
                :disabled="disableUi"
              />
            </label>
          </div>
        </td>
        <td v-for="workAttribute in workAttributes" :key="workAttribute.key">
          <WorkAttribute
            :value.sync="item.workAttributes[workAttribute.key]"
            :work-attribute="workAttribute"
            :projects-account-links="projectsAccountLinks"
            :issue-key="item.issueKey"
            :issue-tempo-account-id="item.issueTempoAccountId"
            :disabled="disableUi"
          />
        </td>
        <td>
          <button
            name="delete"
            title="Delete worklog"
            @click="deleteWorklog(index)"
            :disabled="disableUi"
          >
            <font-awesome-icon icon="trash"/>
          </button>
        </td>
      </tr>
    </draggable>
    <tr class="worklogs-add-row">
      <td />
      <td />
      <td colspan="100">
        <button
          name="add"
          title="Add new worklog row"
          @click="addWorklog"
          :disabled="disableUi"
        >
          <font-awesome-icon icon="plus"/> Add Worklog
        </button>
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import Draggable from 'vuedraggable';
import { v4 as uuidv4 } from 'uuid';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faGripLines, faCheck, faPlus, faTrash, faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Worklog from '@/data/worklog';
import DateSelector from '@/components/DateSelector.vue';
import IssueSelector from '@/components/IssueSelector.vue';
import WorkAttribute from '@/components/WorkAttribute.vue';
import { AccountLinkByScopeResponse, WorkAttributeResponse } from 'tempo-client/lib/responseTypes';
import WorklogValidator from '@/utils/validator/worklogValidator';

library.add(faGripLines);
library.add(faSquare);
library.add(faCheck);
library.add(faPlus);
library.add(faTrash);
library.add(faTrash);
library.add(faExternalLinkAlt);

export default Vue.extend({
  name: 'Worklogs',
  components: {
    Draggable,
    FontAwesomeIcon,
    DateSelector,
    IssueSelector,
    WorkAttribute,
  },
  props: {
    worklogs: {
      type: Array as () => Worklog[],
      default: (): Worklog[] => [],
    },
    workAttributes: {
      type: Array as () => WorkAttributeResponse[],
      default: (): WorkAttributeResponse[] => [],
    },
    projectsAccountLinks: {
      type: Object as () => Record<string, AccountLinkByScopeResponse[]>,
      default: (): Record<string, AccountLinkByScopeResponse[]> => ({}),
    },
    disableUi: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    dragging: false,
  }),
  computed: {
    worklogsValidation(): boolean[] {
      const validator = new WorklogValidator(this.workAttributes);
      return this.worklogs.map((worklog) => validator.validate(worklog));
    },
  },
  methods: {
    addWorklog() {
      // Get the last worklog entries date
      let date = '';
      if (this.worklogs.length !== 0) {
        date = this.worklogs[this.worklogs.length - 1].date;
      }

      this.worklogs.push(
        {
          uuid: uuidv4(),
          date,
          issueKey: '',
          issueKeyIsValid: false,
          issueUrl: '',
          issueTitle: '',
          issueTempoAccountId: null,
          minutes: '',
          message: '',
          issueAccount: '',
          workAttributes: {},
        },
      );
    },
    deleteWorklog(index: number) {
      this.worklogs.splice(index, 1);
    },
  },
});
</script>

<style scoped>
.worklogs {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  position: relative;
}
.worklogs tr {
  font-weight: inherit;
  text-align: left;
  vertical-align: top;
  top: 0;
  position: sticky;
  user-select: none;
  background: #FFFFFF;
}

@media (prefers-color-scheme: dark) {
  .worklogs tr {
    background: #333234;
  }
}

.worklogs tr.worklogs-add-row {
  border-bottom: none;
}
.worklogs tr.worklogs-add-row td {
  border-bottom: none;
}
.worklogs th {
  font-weight: inherit;
  text-align: left;
  padding: 7px 3px 7px 3px;
  vertical-align: bottom;
  background: #F7F7F7;
  top: 0;
  position: sticky;
  user-select: none;
  z-index: 1;
  white-space: nowrap;
}

@media (prefers-color-scheme: dark) {
  .worklogs th {
    background: #444444;
  }
}

.worklogs td {
  padding: 5px 3px 0 3px;
}
table td.worklog-drag, table th.worklog-drag {
  white-space: nowrap;
  width: 13px; min-width: 13px;
  padding-left: 8px;
  padding-right: 3px;
  text-align: center;
}
table td.worklog-date, table th.worklog-date {
  width: 128px; min-width: 128px;
}
table td.worklog-issue, table th.worklog-issue {
  width: 325px; min-width: 325px;
}
table td.worklog-minutes, table th.worklog-minutes {
  width: 60px; min-width: 60px;
}
table td.worklog-message, table th.worklog-message {
  width: 260px; min-width: 260px;
}
table td:nth-last-child(1), table th:nth-last-child(1) {
  width: 100%;
}
.minutesField input {
  width: 50px;
}
.messageField textarea {
  min-width: 250px;
  min-height: 15px;
  width: 250px;
}

button[name=delete] {
  background: rgba(255, 0, 0, 0.2);
  white-space: nowrap;
}

button[name=add] {
  background: rgba(0, 128, 255, 0.2);
  white-space: nowrap;
}
</style>
