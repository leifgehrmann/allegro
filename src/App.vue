<template>
  <div id="app">
    <Toolbar>
      <template v-slot:left>
        <Whitespace
          width="14px"
        />
        <CheckBox
          :checked="selectedWorklogsTotal > 0"
          :partial="selectedWorklogsTotal > 0 && selectedWorklogsTotal !== worklogs.length"
          :disabled="isSubmittingWorklogs"
          label="Select"
          @toggle="toggleSelectionOfAllWorklogs"
        />
        <Whitespace
          width="25px"
        />
        <IconButton
          icon="plus"
          label="Add new worklog"
          variant="primary"
          @click-button="addNewWorklog"
          :disabled="isSubmittingWorklogs"
        />
        <IconButton
          icon="file-import"
          label="Import worklogs from CSV file"
          variant="primary"
          @click-button="fileImportWorklogs"
          :disabled="isSubmittingWorklogs"
        />
        <Whitespace
          width="25px"
          v-if="selectedWorklogsTotal > 0"
        />
        <IconButton
          icon="pen"
          label="Bulk edit selected worklogs"
          v-if="selectedWorklogsTotal > 0"
          @click-button="showBulkEditWorklogsModal"
          :disabled="isSubmittingWorklogs"
        />
        <IconButton
          icon="layer-group"
          label="Merge selected worklogs"
          v-if="selectedWorklogsTotal > 0"
          @click-button="showMergeWorklogsModal"
          :disabled="isSubmittingWorklogs"
        />
        <IconButton
          icon="trash"
          label="Delete selected worklogs"
          variant="danger"
          v-if="selectedWorklogsTotal > 0"
          @click-button="deleteSelectedWorklogs"
          :disabled="isSubmittingWorklogs"
        />
      </template>
      <template v-slot:right>
        <IconButton
          icon="cog"
          @click-button="showPreferencesModal"
          label="Preferences"
          :disabled="isSubmittingWorklogs"
        />
        <ConnectionStatus
          v-if="jiraConnectionState !== 'connected' || tempoConnectionState !== 'connected'"
          :jira-state="jiraConnectionState"
          :tempo-state="tempoConnectionState"
        />
        <button
          id="submit-submitEntries"
          @click="submitWorklogs"
          v-if="!isSubmittingWorklogs"
        >
          <font-awesome-icon icon="rocket"/>
          Submit Worklogs {{totalMinutes}}
        </button>
        <button
          id="submit-cancelSubmission"
          @click="cancelSubmitWorklogs"
          v-if="isSubmittingWorklogs"
        >
          <font-awesome-icon icon="times"/>
          Cancel Submitting
        </button>
      </template>
    </Toolbar>
    <div class="content">
      <Worklogs
        :worklogs="worklogs"
        :work-attributes="workAttributes"
        :projects-account-links="projectsAccountLinks"
        :disable-ui="isSubmittingWorklogs"
      />
    </div>
    <FileImportWorklogsModal
      :settings.sync="fileImportWorklogsSettings"
      :fileData="fileImportWorklogsData"
      v-show="isFileImportWorklogsModalVisible"
      @close="closeFileImportWorklogsModal"
      @importWorklogs="addWorklogData"
    />
    <BulkEditWorklogsModal
      :worklogs="worklogs"
      v-show="isBulkEditWorklogsModalVisible"
      @close="closeBulkEditWorklogsModal"
      @bulkEdit="bulkEditSelectedWorklogs"
    />
    <MergeWorklogsModal
      :worklogs="worklogs"
      v-show="isMergeWorklogsModalVisible"
      @close="closeMergeWorklogsModal"
      @merge="mergeSelectedWorklogsIntoWorklog"
    />
    <PreferencesModal
      :preferences="preferences"
      v-show="isPreferencesModalVisible"
      @resetCache="clearCacheAndPopulate"
      @close="closePreferencesModal"
      @save="savePreferences"
    />
    <ValidationModal
      v-show="isValidationModalVisible"
      @close="closeValidationModal"
    />
    <ErrorModal
      :error-message="errorModalMessage"
      v-show="isErrorModalVisible"
      @close="closeErrorModal"
    />
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import { remote } from 'electron';
import jetpack from 'fs-jetpack';
import Worklogs from '@/components/Worklogs.vue';
import Toolbar from '@/components/Toolbar.vue';
import ConnectionStatus from '@/components/ConnectionStatus.vue';
import FileImportWorklogsModal from '@/components/FileImportWorklogsModal.vue';
import BulkEditWorklogsModal from '@/components/BulkEditWorklogsModal.vue';
import MergeWorklogsModal from '@/components/MergeWorklogsModal.vue';
import PreferencesModal from '@/components/PreferencesModal.vue';
import ValidationModal from '@/components/ValidationModal.vue';
import ErrorModal from '@/components/ErrorModal.vue';
import '@/style/global.scss';
import Preferences from '@/data/preferences';
import Store from 'electron-store';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCog,
  faRocket,
  faTimes,
  faFileImport,
  faPen,
  faLayerGroup,
  faTrash,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Worklog from '@/data/worklog';
import WorklogPopulator from '@/utils/populator/worklogPopulator';
import IndexedCache from '@/utils/cache/indexedCache';
import {
  JiraApiCurrentUserSuccessResponse, JiraApiFieldObjectResponse,
  JiraApiIssueResponse,
} from '@/data/jiraApiResponseTypes';
import ObjectCache from '@/utils/cache/objectCache';
import { AccountLinkByScopeResponse, WorkAttributeResponse } from 'tempo-client/lib/responseTypes';
import WorkAttributePopulator from '@/utils/populator/workAttributePopulator';
import ProjectAccountLinksPopulator from '@/utils/populator/projectAccountLinksPopulator';
import WorklogValidator from '@/utils/validator/worklogValidator';
import CurrentUserPopulator from '@/utils/populator/currentUserPopulator';
import WorklogSubmitter from '@/utils/worklogSubmitter';
import ConnectionState from '@/utils/connectionState';
import JiraTempoFieldPopulator from '@/utils/populator/jiraTempoFieldPopulator';
import IconButton from '@/components/IconButton.vue';
import Whitespace from '@/components/Whitespace.vue';
import CheckBox from '@/components/CheckBox.vue';
import { v4 as uuidv4 } from 'uuid';
import FileImportIpcRenderer from '@/utils/ipc/fileImportIpcRenderer';
import FileImportWorklogsSettings from '@/data/fileImportWorklogsSettings';

library.add(faCog);
library.add(faTimes);
library.add(faRocket);
library.add(faFileImport);
library.add(faPen);
library.add(faLayerGroup);
library.add(faTrash);
library.add(faPlus);

let manifest = 'N/A';

const { app } = remote;
const appDir = jetpack.cwd(app.getAppPath());
manifest = appDir.read('package.json', 'json');

let preferences: Preferences = {
  jiraHost: '',
  jiraToken: '',
  jiraUsername: '',
  tempoToken: '',
};

const worklogs: Worklog[] = [];
const workAttributes: WorkAttributeResponse[] = [];
const projectsAccountLinks: Record<string, AccountLinkByScopeResponse[]> = {};

const store = new Store();
const issueCache: IndexedCache<JiraApiIssueResponse> = new IndexedCache('jiraIssues', store);
const jiraTempoFieldCache: ObjectCache<JiraApiFieldObjectResponse> = new ObjectCache('jiraTempoField', store);
const projectsAccountLinksCache: IndexedCache<AccountLinkByScopeResponse[]> = new IndexedCache('tempoProjectsAccountLinks', store);
const workAttributesCache: ObjectCache<WorkAttributeResponse[]> = new ObjectCache('tempoWorkAttributes', store);

preferences = { ...preferences, ...store.get('preferences') };

export default Vue.extend({
  name: 'App',
  components: {
    Worklogs,
    Toolbar,
    ConnectionStatus,
    FileImportWorklogsModal,
    BulkEditWorklogsModal,
    MergeWorklogsModal,
    PreferencesModal,
    ValidationModal,
    ErrorModal,
    FontAwesomeIcon,
    IconButton,
    CheckBox,
    Whitespace,
  },
  data: () => ({
    jiraConnectionState: 'unknown' as 'unknown'|'connected'|'errored',
    tempoConnectionState: 'unknown' as 'unknown'|'connected'|'errored',
    isFileImportWorklogsModalVisible: false,
    isBulkEditWorklogsModalVisible: false,
    isMergeWorklogsModalVisible: false,
    isPreferencesModalVisible: false,
    isValidationModalVisible: false,
    isErrorModalVisible: false,
    isSubmittingWorklogs: false,
    fileImportWorklogsSettings: {} as FileImportWorklogsSettings,
    fileImportWorklogsData: '' as string,
    errorModalMessage: '',
    manifest,
    preferences,
    currentUser: null as JiraApiCurrentUserSuccessResponse|null,
    worklogs,
    jiraTempoField: null as JiraApiFieldObjectResponse|null,
    projectsAccountLinks,
    workAttributes,
    issueCache,
    jiraTempoFieldCache,
    projectsAccountLinksCache,
    workAttributesCache,
  }),
  computed: {
    selectedWorklogsTotal(): number {
      return this.worklogs.reduce(
        (sumSelected, worklog) => (worklog.selected ? sumSelected + 1 : sumSelected),
        0,
      );
    },
    totalMinutes(): string {
      const total = this.worklogs.reduce(
        (accumulator, worklog) => {
          if (worklog.minutes !== '') {
            return accumulator + parseFloat(worklog.minutes ?? '0');
          }
          return accumulator;
        },
        0,
      );
      if (total === 0) {
        return '';
      }
      return `(${total}m)`;
    },
  },
  methods: {
    showFileImportWorklogsModal() {
      this.isFileImportWorklogsModalVisible = true;
    },
    closeFileImportWorklogsModal() {
      this.isFileImportWorklogsModalVisible = false;
    },
    showBulkEditWorklogsModal() {
      this.isBulkEditWorklogsModalVisible = true;
    },
    closeBulkEditWorklogsModal() {
      this.isBulkEditWorklogsModalVisible = false;
    },
    showMergeWorklogsModal() {
      this.isMergeWorklogsModalVisible = true;
    },
    closeMergeWorklogsModal() {
      this.isMergeWorklogsModalVisible = false;
    },
    showPreferencesModal() {
      this.isPreferencesModalVisible = true;
    },
    closePreferencesModal() {
      this.isPreferencesModalVisible = false;
    },
    showValidationModal() {
      this.isValidationModalVisible = true;
    },
    closeValidationModal() {
      this.isValidationModalVisible = false;
    },
    showErrorModal(message: string) {
      this.errorModalMessage = message;
      this.isErrorModalVisible = true;
    },
    closeErrorModal() {
      this.isErrorModalVisible = false;
    },
    clearConnectionStatus() {
      this.jiraConnectionState = 'unknown';
      this.tempoConnectionState = 'unknown';
    },
    async updateConnectionStatus() {
      const connectionState = new ConnectionState(this.preferences);
      this.jiraConnectionState = await connectionState.getJiraState();
      this.tempoConnectionState = await connectionState.getTempoState();
    },
    savePreferences(newPreferences: Preferences) {
      this.preferences = newPreferences;
      store.set('preferences', this.preferences);
      this.clearConnectionStatus();
      this.updateConnectionStatus();
      this.loadUser();
      this.clearCacheAndPopulate();
    },
    async clearCacheAndPopulate() {
      issueCache.invalidate();
      this.jiraTempoField = null;
      this.workAttributes = [];
      this.projectsAccountLinks = {};
      jiraTempoFieldCache.invalidate();
      workAttributesCache.invalidate();
      projectsAccountLinksCache.invalidate();
      // Todo: Force clear the Worklogs metadata, since the title and account will be set even when
      // the cache is cleared.
      this.populate();
    },
    async populate(): Promise<void> {
      const jiraTempoFieldPopulator = new JiraTempoFieldPopulator(
        this.preferences,
        this.jiraTempoFieldCache,
      );
      this.jiraTempoField = await jiraTempoFieldPopulator.populate();
      this.workAttributes = await new WorkAttributePopulator(
        this.preferences,
        workAttributesCache,
      ).populate();
      const ProjectsAccountLinksPopulator = new ProjectAccountLinksPopulator(
        this.worklogs,
        this.projectsAccountLinks,
        this.preferences,
        this.projectsAccountLinksCache,
      );
      await ProjectsAccountLinksPopulator.populate();
      const worklogPopulator = new WorklogPopulator(
        this.worklogs,
        this.preferences,
        this.jiraTempoField,
        this.issueCache,
      );
      await worklogPopulator.populate();
    },
    async loadUser() {
      const currentUserPopulator = new CurrentUserPopulator(this.preferences);
      this.currentUser = await currentUserPopulator.get();
    },
    bulkEditSelectedWorklogs(newDate: string): void {
      this.worklogs.forEach((worklog, index) => {
        if (worklog.selected) {
          this.worklogs[index].date = newDate;
        }
      });
    },
    mergeSelectedWorklogsIntoWorklog(selectedWorklogIndexToMergeInto: number) {
      // 1. Sum up all the minutes
      const totalMergedMinutes = this.worklogs.reduce((accumulator, worklog) => {
        const parsedMinutes = parseFloat(worklog.minutes);
        if (worklog.selected && (parsedMinutes >= 0 && !Number.isNaN(parsedMinutes))) {
          return accumulator + parsedMinutes;
        }
        return accumulator;
      }, 0);

      // 2. Set the minutes against the selected worklog to merge into
      this.worklogs[selectedWorklogIndexToMergeInto].minutes = `${totalMergedMinutes}`;

      // 3. Remove all worklogs except for the selected worklog to merge into
      this.worklogs[selectedWorklogIndexToMergeInto].selected = false;
      this.deleteSelectedWorklogs();
    },
    toggleSelectionOfAllWorklogs() {
      const newSelectedValue = !(this.selectedWorklogsTotal > 0);
      this.worklogs.forEach((worklog, index) => {
        this.worklogs[index].selected = newSelectedValue;
      });
    },
    addWorklog(date = '', issueKey = '', minutes = '', message = ''): void {
      // Get the last worklog entries date
      let newDate = date;
      if (date === '' && this.worklogs.length !== 0) {
        newDate = this.worklogs[this.worklogs.length - 1].date;
      }

      this.worklogs.push(
        {
          uuid: uuidv4(),
          selected: false,
          date: newDate,
          issueKey,
          issueKeyIsValid: false,
          issueUrl: '',
          issueTitle: '',
          issueTempoAccountId: null,
          minutes,
          message,
          issueAccount: '',
          workAttributes: {},
        },
      );
    },
    addNewWorklog(): void {
      this.addWorklog();
    },
    addWorklogData(
      newWorklogsData: {date: string, minutes: string, message: string, issueKey: string}[],
    ): void {
      newWorklogsData.forEach((newWorklogData) => {
        this.addWorklog(
          newWorklogData.date,
          newWorklogData.issueKey,
          newWorklogData.minutes,
          newWorklogData.message,
        );
      });
    },
    async fileImportWorklogs(): Promise<void> {
      this.fileImportWorklogsData = await FileImportIpcRenderer.fileSelectAndRead();
      if (this.fileImportWorklogsData !== '') {
        this.showFileImportWorklogsModal();
      }
    },
    deleteSelectedWorklogs(): void {
      this.worklogs = this.worklogs.filter((worklog) => (!worklog.selected));
    },
    async submitWorklogs() {
      // Clean worklogs
      this.worklogs.forEach((worklog, worklogIndex) => {
        Object.entries(worklog.workAttributes).forEach((entry) => {
          const isValidateAttribute = this.workAttributes.some(
            (workAttribute) => workAttribute.key === entry[0],
          );
          if (!isValidateAttribute) {
            delete this.worklogs[worklogIndex].workAttributes[entry[0]];
          }
        });
      });

      // Validate
      const validator = new WorklogValidator(this.workAttributes);
      const hasInvalidWorklogs = this.worklogs.some((worklog) => !validator.validate(worklog));
      if (hasInvalidWorklogs) {
        this.showValidationModal();
        return;
      }

      if (this.currentUser === null) {
        this.showErrorModal('JIRA User not found. Please check preferences.');
        return;
      }
      const currentUserAccountId = this.currentUser.accountId;

      // Then send
      this.isSubmittingWorklogs = true;

      const submitter = new WorklogSubmitter(this.preferences, currentUserAccountId);
      while (this.worklogs.length > 0) {
        const currentWorklog = this.worklogs[0];
        try {
          // We deliberately submit the worklogs one at a time for now. We could look into
          // parallelization when we are more comfortable doing so.
          // eslint-disable-next-line no-await-in-loop
          const result = await submitter.submitWorklog(currentWorklog);
          console.log(result);
          this.worklogs.splice(0, 1);
        } catch (error) {
          console.log(error);
          this.showErrorModal('An error occurred while submitting worklogs. Please try again.');
          break;
        }
      }
      this.isSubmittingWorklogs = false;
    },
    cancelSubmitWorklogs() {
      this.isSubmittingWorklogs = false;
    },
  },
  watch: {
    worklogs: {
      handler() {
        // Todo: Defer to reduce massive I/O ops
        store.set('worklogs', this.worklogs);
        this.populate();
      },
      deep: true,
    },
  },
  mounted(): void {
    worklogs.push(...store.get('worklogs') ?? []);
    this.updateConnectionStatus();
    this.loadUser();
    this.populate();
  },
});
</script>

<style scoped>

.content {
  width: 100%;
  height: calc(100vh - 57px);
  overflow: scroll;
}
</style>
