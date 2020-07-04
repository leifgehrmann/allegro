<template>
  <table class="worklogs">
    <tr>
      <th scope="col"></th>
      <th scope="col">Date</th>
      <th scope="col">Issue</th>
      <th scope="col">Minutes</th>
      <th scope="col">Message</th>
      <th scope="col">Account</th>
      <th scope="col">Category</th>
      <th scope="col">Actions</th>
    </tr>
    <draggable v-model="worklogs" tag="tbody" handle=".handle">
      <tr v-for="item in worklogs" :key="item.name">
        <td
          class="handle"
        >
          <font-awesome-icon icon="grip-lines"/>
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
        <td>
          <label>
            <select>
              <option>alpha</option>
              <option>beta</option>
              <option>gamma</option>
            </select>
          </label>
        </td>
        <td>
          <label>
            <select>
              <option>alpha</option>
              <option>beta</option>
              <option>gamma</option>
            </select>
          </label>
        </td>
        <td>
          <button
            name="delete"
            title="Delete worklog"
          >
            <font-awesome-icon icon="trash"/> Delete
          </button>
        </td>
      </tr>
    </draggable>
    <tr class="worklogs-add-row">
      <td></td>
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
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faGripLines, faPlus, faTrash, faExternalLinkAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Worklog from '@/data/worklog';
import DateSelector from '@/components/DateSelector.vue';
import IssueSelector from '@/components/IssueSelector.vue';

library.add(faGripLines);
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
  },
  props: {
    worklogs: {
      type: Array,
      default: (): Worklog[] => [],
    },
  },
  data: () => ({
    dragging: false,
  }),
  methods: {
    addWorklog() {
      this.worklogs.push(
        {
          date: '',
          issueKey: '',
          issueKeyIsValid: false,
          issueUrl: '',
          issueTitle: '',
          minutes: undefined,
          message: '',
          projectAccounts: [''],
          issueAccount: '',
        },
      );
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
  padding: 7px;
  padding-left: 9px;
  vertical-align: middle;
  top: 0;
  position: sticky;
  user-select: none;
  background: #FFFFFF;
  border-bottom: 1px solid #EEEEEE;
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
  padding: 7px;
  padding-left: 9px;
  vertical-align: bottom;
  background: #F7F7F7;
  top: 0;
  position: sticky;
  user-select: none;
  z-index: 1;
}
.worklogs td {
  padding: 5px;
}
table td:nth-child(1), table th:nth-child(1) {
  padding-left: 10px;
  padding-right: 10px;
  text-align: center;
}
table td:nth-child(2), table th:nth-child(2) {
  width: 180px; padding-left: 3px; padding-right: 3px;
}
table td:nth-child(3), table th:nth-child(3) {
  width: 60px; padding-left: 3px; padding-right: 3px;
}
table td:nth-child(4), table th:nth-child(4) {
  width: 30px; padding-left: 3px; padding-right: 3px;
}
table td:nth-child(5), table th:nth-child(5) {
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
