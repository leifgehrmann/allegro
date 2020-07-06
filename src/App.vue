<template>
  <div id="app">
    <div class="content">
      <Worklogs
        :worklogs="worklogs"
        :work-attributes="workAttributes"
        :projects-account-links="projectsAccountLinks"
        :disable-ui="isSubmittingWorklogs"
      />
    </div>
    <Footer>
      <template v-slot:left>
        <button
          @click="showPreferencesModal">
          <font-awesome-icon icon="cog"/>
          Settings
        </button>
        <ConnectionStatus
          :jira-state="jiraConnectionState"
          :tempo-state="tempoConnectionState"
        />
      </template>
      <template v-slot:right>
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
    </Footer>
    <PreferencesModal
      :preferences="preferences"
      v-show="isPreferencesModalVisible"
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
import Footer from '@/components/Footer.vue';
import ConnectionStatus from '@/components/ConnectionStatus.vue';
import PreferencesModal from '@/components/PreferencesModal.vue';
import ValidationModal from '@/components/ValidationModal.vue';
import ErrorModal from '@/components/ErrorModal.vue';
import '@/style/global.scss';
import Preferences from '@/data/preferences';
import Store from 'electron-store';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCog, faRocket, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Worklog from '@/data/worklog';
import WorklogPopulator from '@/utils/populator/worklogPopulator';
import IndexedCache from '@/utils/cache/indexedCache';
import {
  JiraApiCurrentUserSuccessResponse,
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

library.add(faCog);
library.add(faTimes);
library.add(faRocket);

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
const projectsAccountLinksCache: IndexedCache<AccountLinkByScopeResponse[]> = new IndexedCache('tempoProjectsAccountLinks', store);
const workAttributesCache: ObjectCache<WorkAttributeResponse[]> = new ObjectCache('tempoWorkAttributes', store);

preferences = { ...preferences, ...store.get('preferences') };

export default Vue.extend({
  name: 'App',
  components: {
    Worklogs,
    Footer,
    ConnectionStatus,
    PreferencesModal,
    ValidationModal,
    ErrorModal,
    FontAwesomeIcon,
  },
  data: () => ({
    jiraConnectionState: 'unknown' as 'unknown'|'connected'|'errored',
    tempoConnectionState: 'unknown' as 'unknown'|'connected'|'errored',
    isPreferencesModalVisible: false,
    isValidationModalVisible: false,
    isErrorModalVisible: false,
    isSubmittingWorklogs: false,
    errorModalMessage: '',
    manifest,
    preferences,
    currentUser: null as JiraApiCurrentUserSuccessResponse|null,
    worklogs,
    projectsAccountLinks,
    workAttributes,
    issueCache,
    projectsAccountLinksCache,
    workAttributesCache,
  }),
  computed: {
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
      this.workAttributes = [];
      this.projectsAccountLinks = {};
      workAttributesCache.invalidate();
      projectsAccountLinksCache.invalidate();
      // Todo: Force clear the Worklogs metadata, since the title and account will be set even when
      // the cache is cleared.
      this.populate();
    },
    async populate(): Promise<void> {
      const worklogPopulator = new WorklogPopulator(
        this.worklogs,
        this.preferences,
        this.issueCache,
      );
      await worklogPopulator.populate();
      const ProjectsAccountLinksPopulator = new ProjectAccountLinksPopulator(
        this.worklogs,
        this.projectsAccountLinks,
        this.preferences,
        this.projectsAccountLinksCache,
      );
      await ProjectsAccountLinksPopulator.populate();
      this.workAttributes = await new WorkAttributePopulator(
        this.preferences,
        workAttributesCache,
      ).populate();
    },
    async loadUser() {
      const currentUserPopulator = new CurrentUserPopulator(this.preferences);
      this.currentUser = await currentUserPopulator.get();
    },
    async submitWorklogs() {
      // First validate
      const validator = new WorklogValidator(this.workAttributes);
      const hasInvalidWorklogs = this.worklogs.some((worklog) => !validator.validate(worklog));
      if (hasInvalidWorklogs) {
        this.showValidationModal();
        return;
      }

      if (this.currentUser === null) {
        this.showErrorModal('JIRA User not found. Please check settings.');
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
  height: calc(100vh - 37px);
  margin-bottom: 37px;
  overflow: scroll;
}
</style>
