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
          class="handle"
        >
          <font-awesome-icon icon="grip-lines"/>
        </td>
        <td>
          <font-awesome-icon
            icon="check"
            :style="{ visibility: worklogsValidation[index] ? 'visible' : 'hidden' }"
            title="This worklog is valid ✨"
          />
        </td>
        <td>
          <DateSelector :value.sync="item.date"/>
        </td>
        <td>
          <IssueSelector
            :issue-key.sync="item.issueKey"
            :issue-key-is-valid="item.issueKeyIsValid"
            :issue-url="item.issueUrl"
            :issue-title="item.issueTitle"
          />
        </td>
        <td>
          <div class="minutesField">
            <label>
              <input
                type="number"
                min="0"
                placeholder="0"
                v-model="item.minutes"
              >
            </label>
          </div>
        </td>
        <td>
          <div class="messageField">
            <label>
              <textarea
                rows="1"
                v-model="item.message"
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
          />
        </td>
        <td>
          <button
            name="delete"
            title="Delete worklog"
            @click="deleteWorklog(index)"
          >
            <font-awesome-icon icon="trash"/> Delete
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Worklog from '@/data/worklog';
import DateSelector from '@/components/DateSelector.vue';
import IssueSelector from '@/components/IssueSelector.vue';
import WorkAttribute from '@/components/WorkAttribute.vue';
import { AccountLinkByScopeResponse, WorkAttributeResponse } from 'tempo-client/lib/responseTypes';
import WorklogValidator from '@/utils/validator/worklogValidator';

library.add(faGripLines);
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
      this.worklogs.push(
        {
          uuid: uuidv4(),
          date: '',
          issueKey: '',
          issueKeyIsValid: false,
          issueUrl: '',
          issueTitle: '',
          minutes: '',
          message: '',
          projectAccounts: [''],
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
  padding: 7px 7px 7px 9px;
  vertical-align: middle;
  top: 0;
  position: sticky;
  user-select: none;
  background: #FFFFFF;
  border-bottom: 1px solid #EEEEEE;
}

@media (prefers-color-scheme: dark) {
  .worklogs tr {
    background: #333234;
    border-bottom: 1px solid #444444;
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
  padding: 7px 7px 7px 9px;
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
  padding: 5px;
}
table td:nth-child(1), table th:nth-child(1) {
  padding-left: 10px;
  padding-right: 10px;
  text-align: center;
}
table td:nth-child(3), table th:nth-child(3) {
  width: 180px; padding-left: 3px; padding-right: 3px;
}
table td:nth-child(4), table th:nth-child(4) {
  width: 60px; padding-left: 3px; padding-right: 3px;
}
table td:nth-child(5), table th:nth-child(5) {
  width: 30px; padding-left: 3px; padding-right: 3px;
}
table td:nth-child(6), table th:nth-child(6) {
  width: 220px; padding-left: 3px; padding-right: 3px;
}
.minutesField input {
  width: 50px;
}
.messageField textarea {
  min-width: 300px;
  min-height: 15px;
  width: 300px;
}
.messageField textarea {
  min-width: 300px;
  max-width: 300px;
  min-height: 15px;
  width: 300px;
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
