<template>
  <Modal
    @close="close"
  >
    <template v-slot:header>
      Import worklogs from file
    </template>
    <template v-slot:body>
      <div class="merge-worklogs-scrollable">
        <h2>1. Date</h2>
        <p>
          Select the column containing the worklogs date.
          Must either be <code>YYYY-MM-DD</code> or <code>DD-MM-YYYY</code>.
        </p>
        <label>
          <select
            v-model="selectedSettings.dateColumn"
          >
            <option
              v-for="(column, index) in columns"
              :key="index"
              :value="column"
            >{{ column }}</option>
          </select>
        </label>
        <hr>
        <h2>2. Minutes</h2>
        <p>
          Select the column containing the duration of the worklog.
          Either <code>H:M:S</code>, <code>H:M</code>, or <code>M</code>.
        </p>
        <label>
          <select
            v-model="selectedSettings.minutesColumn"
          >
            <option
              v-for="(column, index) in columns"
              :key="index"
              :value="column"
            >{{ column }}</option>
          </select>
        </label>
        <hr>
        <h2>3. Message</h2>
        <p>Select columns to be concatenated into a message.</p>
        <span
          v-for="(column, index) in columns"
          :key="index"
        >
          <label
            :for="`fileImportWorklogsMessageColumns-${index}`"
          >
            <input
              type="checkbox"
              v-model="checkedNames"
              :id="`fileImportWorklogsMessageColumns-${index}`"
              :value="column"
            >
            {{ column }}
          </label>
        </span>
        <p>Extract JIRA issue keys (e.g. <code>ABC-123</code>) from message?</p>
        <label>
          <input
            type="radio"
            name="fileImportWorklogsParseMessageForIssueKey"
            v-model="selectedSettings.parseMessageForIssueKey"
            :value="true"
          >
          Yes
        </label>
        <label>
          <input
            type="radio"
            name="fileImportWorklogsParseMessageForIssueKey"
            v-model="selectedSettings.parseMessageForIssueKey"
            :value="false"
          >
          No
        </label>
      </div>
    </template>
    <template v-slot:footer>
      <button @click="close">Cancel</button>
      <button
        :disabled="isImporting"
        @click="importWorklogs"
      >
        Import Worklogs
      </button>
    </template>
  </Modal>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import Modal from '@/components/Modal.vue';
import FileImportWorklogsSettings from '@/data/fileImportWorklogsSettings';
import * as CSV from 'csv-string';

export default Vue.extend({
  name: 'FileImportWorklogsModal',
  components: {
    Modal,
  },
  props: {
    fileData: {
      type: String,
      default: '',
    },
    settings: {
      type: Object as () => FileImportWorklogsSettings,
      default: (): FileImportWorklogsSettings => ({}),
    },
  },
  data: () => ({
    selectedSettings: {} as FileImportWorklogsSettings,
    isImporting: false,
    checkedNames: [] as string[] | undefined,
  }),
  computed: {
    splitData(): string[][] {
      return CSV.parse(this.fileData);
    },
    columns(): string[] {
      return this.splitData[0];
    },
    dataByColumns(): Record<string, string>[] {
      const { columns } = this;
      const rowObjects = [] as Record<string, string>[];
      this.splitData.forEach((row, index) => {
        // Skip the header row
        if (index === 0) {
          return;
        }
        const rowObject = {} as Record<string, string>;
        row.forEach((columnValue, columnIndex) => {
          rowObject[columns[columnIndex]] = columnValue;
        });
        rowObjects.push(rowObject);
      });
      return rowObjects;
    },
  },
  watch: {
    fileData() {
      this.checkedNames = [];
    },
    checkedNames() {
      this.selectedSettings.messageColumns = this.checkedNames;
    },
    selectedSettings: {
      handler() {
        this.$emit('update:settings', this.selectedSettings);
      },
      deep: true,
    },
  },
  mounted(): void {
    if (this.settings.messageColumns) {
      this.checkedNames = this.settings.messageColumns;
    }
    this.selectedSettings = { ...this.settings };
  },
  methods: {
    generateParsedData(): {date: string, minutes: string, message: string, issueKey: string}[] {
      return this.dataByColumns.map((row) => {
        const date = this.normaliseDate(row, this.settings.dateColumn);
        const minutes = this.normaliseMinutes(row, this.settings.minutesColumn);
        const message = this.normaliseMessage(row, this.settings.messageColumns);
        const issueKey = this.normaliseIssueKey(message, this.settings.parseMessageForIssueKey);
        return {
          date,
          minutes,
          message,
          issueKey,
        };
      });
    },
    normaliseDate(row: Record<string, string>, dateColumn?: string): string {
      if (dateColumn) {
        const unsanitisedDate = row[dateColumn];
        const ymdMatch = unsanitisedDate.match(/([\d]{4})[^\d]([\d]{2})[^\d]([\d]{2})/);
        if (ymdMatch !== null) {
          return `${ymdMatch[1]}-${ymdMatch[2]}-${ymdMatch[3]}`;
        }
        const dmyMatch = unsanitisedDate.match(/([\d]{2})[^\d]([\d]{2})[^\d]([\d]{4})/);
        if (dmyMatch !== null) {
          return `${dmyMatch[3]}-${dmyMatch[2]}-${dmyMatch[1]}`;
        }
      }
      return '';
    },
    normaliseMinutes(row: Record<string, string>, minuteColumn?: string): string {
      if (minuteColumn) {
        const unsanitisedMinutes = row[minuteColumn];
        const hoursMinutesSecondsMatch = unsanitisedMinutes.match(/([\d]+)[^\d]([\d]{2})[^\d]([\d]{2})/);
        if (hoursMinutesSecondsMatch !== null) {
          return Math.round(
            parseFloat(hoursMinutesSecondsMatch[1]) * 60
            + parseFloat(hoursMinutesSecondsMatch[2])
            + parseFloat(hoursMinutesSecondsMatch[3]) / 60,
          ).toString();
        }
        const hoursMinutesMatch = unsanitisedMinutes.match(/([\d]+)[^\d]([\d]{2})/);
        if (hoursMinutesMatch !== null) {
          return Math.round(
            parseFloat(hoursMinutesMatch[1]) * 60
            + parseFloat(hoursMinutesMatch[2]),
          ).toString();
        }
        const minutesMatch = unsanitisedMinutes.match(/[\d]+/);
        if (minutesMatch !== null) {
          return `${minutesMatch[0]}`;
        }
      }
      return '';
    },
    normaliseMessage(row: Record<string, string>, messageColumns?: string[]): string {
      let message = '';
      if (messageColumns) {
        messageColumns.forEach((column) => {
          if (message.length > 0 && row[column] && row[column].length > 0) {
            message += ', ';
          }
          message += row[column];
        });
      }
      return message;
    },
    normaliseIssueKey(message: string, parseMessageForIssueKey?: boolean): string {
      if (parseMessageForIssueKey) {
        const issueKeyMatches = message.match(/[a-zA-Z]+-[\d]+/);
        if (issueKeyMatches !== null) {
          // eslint-disable-next-line prefer-destructuring
          return issueKeyMatches[0];
        }
      }
      return '';
    },
    close() {
      this.$emit('close');
    },
    importWorklogs() {
      this.isImporting = true;
      this.$emit('import-worklogs', this.generateParsedData());
      this.close();
      this.isImporting = false;
    },
  },
});
</script>

<style scoped>
p {
  max-width: 400px;
  user-select: none;
}
h2 {
  font-size: 0.9rem;
  user-select: none;
}
hr {
  border: 1px solid rgba(0, 0, 0, 0.1);
}
code {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  padding-left: 2px;
  padding-right: 2px;
}
button {
  margin: 5px;
  user-select: none;
}
label {
  display: block;
  margin-bottom: 5px;
}
input[type=checkbox], input[type=radio] {
  margin-right: 5px;
}
.merge-worklogs-scrollable {
  overflow-y: scroll;
  max-height: 320px;
}
</style>
