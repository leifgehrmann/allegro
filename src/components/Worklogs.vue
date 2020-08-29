<template>
  <table class="worklogs">
    <tr>
      <th scope="col" class="worklog-drag"/>
      <th scope="col" class="worklog-select"/>
      <th scope="col" class="worklog-validation"/>
      <th scope="col" class="worklog-date">Date</th>
      <th scope="col" class="worklog-issue">Issue</th>
      <th scope="col" class="worklog-minutes">Minutes</th>
      <th scope="col" class="worklog-message">Message</th>
      <th scope="col" v-for="workAttribute in workAttributes" :key="workAttribute.key">
        {{workAttribute.name}}
        <span v-if="workAttribute.required">*</span>
      </th>
    </tr>
    <draggable :list="worklogs" tag="tbody" handle=".handle">
      <tr v-for="(item, index) in worklogs" :key="item.uuid">
        <td
          class="worklog-drag"
          :class="{ handle: !disableUi }"
        >
          <IconButton
            icon="grip-lines"
            label="Click and drag to reorder"
            label-placement="right"
            variant="link"
            :disabled="disableUi"
          />
        </td>
        <td
          class="worklog-select"
        >
          <CheckBox
            label="Select"
            label-placement="right"
            :checked="item.selected"
            @toggle-exact="toggleWorklogSelection(index, item.selected)"
            @toggle-shift="toggleWorklogSelectionWithRange(index, item.selected)"
            :disabled="disableUi"
          />
        </td>
        <td
          class="worklog-validation"
        >
          <IconButton
            :label="worklogsValidation[index] ?
              'This worklog is valid ✨' :
              'A check-mark will display here when valid'"
            variant="link"
            :icon="worklogsValidation[index] ? 'check' : ''"
          />
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
                @change="resizeMessageTextarea"
                @click="resizeMessageTextarea"
                @input="resizeMessageTextarea"
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
            :issue-key-is-valid="item.issueKeyIsValid"
            :issue-tempo-account-id="item.issueTempoAccountId"
            :disabled="disableUi"
          />
        </td>
      </tr>
    </draggable>
  </table>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import Draggable from 'vuedraggable';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faGripLines, faCheck,
} from '@fortawesome/free-solid-svg-icons';
import Worklog from '@/data/worklog';
import DateSelector from '@/components/DateSelector.vue';
import IssueSelector from '@/components/IssueSelector.vue';
import WorkAttribute from '@/components/WorkAttribute.vue';
import { AccountLinkByScopeResponse, WorkAttributeResponse } from 'tempo-client/lib/responseTypes';
import WorklogValidator from '@/utils/validator/worklogValidator';
import IconButton from '@/components/IconButton.vue';
import CheckBox from '@/components/CheckBox.vue';

library.add(faGripLines);
library.add(faCheck);

export default Vue.extend({
  name: 'Worklogs',
  components: {
    Draggable,
    IconButton,
    CheckBox,
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
    lastSelectedIndex: null as null|number,
  }),
  computed: {
    worklogsValidation(): boolean[] {
      const validator = new WorklogValidator(this.workAttributes);
      return this.worklogs.map((worklog) => validator.validate(worklog));
    },
  },
  watch: {
    worklogs: {
      handler(val) {
        if (this.lastSelectedIndex !== null && val.length <= this.lastSelectedIndex) {
          this.lastSelectedIndex = null;
        }
      },
    },
  },
  methods: {
    toggleWorklogSelectionWithRange(index: number, checkBoxIsSelected: boolean) {
      const minRange = Math.min(
        index,
        this.lastSelectedIndex !== null ? this.lastSelectedIndex : index,
      );
      const maxRange = Math.max(
        index,
        this.lastSelectedIndex !== null ? this.lastSelectedIndex : index,
      );
      for (let i = minRange; i <= maxRange; i += 1) {
        this.worklogs[i].selected = !checkBoxIsSelected;
      }
      this.lastSelectedIndex = index;
    },
    toggleWorklogSelection(index: number, checkBoxIsSelected: boolean) {
      this.worklogs[index].selected = !checkBoxIsSelected;
      this.lastSelectedIndex = index;
    },
    resizeMessageTextarea(e: Event) {
      const textarea = e.target as HTMLTextAreaElement;
      if (textarea) {
        textarea.style.height = '';
        textarea.style.height = `${textarea.scrollHeight - 10}px`;
      }
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

.worklogs th {
  font-weight: inherit;
  text-align: left;
  padding: 7px 2px 7px 2px;
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
  padding: 2px;
}

.worklogs tr:first-child td {
  padding-top: 4px;
}

.worklogs tr:last-child td {
  padding-bottom: 4px;
}
table td.worklog-drag, table th.worklog-drag {
  white-space: nowrap;
  width: 25px; min-width: 25px;
  padding-left: 8px;
  padding-right: 3px;
  text-align: center;
}
table td.worklog-select, table th.worklog-select,
table td.worklog-validation, table th.worklog-validation {
  white-space: nowrap;
  width: 25px; min-width: 25px;
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
</style>
