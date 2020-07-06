<template>
  <div id="app">
    <div class="content">
      <Worklogs
        :worklogs="worklogs"
        :work-attributes="workAttributes"
        :projects-account-links="projectsAccountLinks"
      />
    </div>
    <Footer>
      <template v-slot:left>
        <button
          @click="showPreferencesModal">
          <font-awesome-icon icon="cog"/>
          Settings
        </button>
        (<font-awesome-icon :icon="['fab', 'jira']"/> JIRA: OK,
        <font-awesome-icon :icon="['far', 'check-circle']"/> Tempo: OK)
      </template>
      <template v-slot:right>
        <button
          id="submit-submitEntries"
          @click="submitWorklogs"
        >
          <font-awesome-icon icon="rocket"/>
          Submit Worklogs {{totalMinutes}}
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
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import { remote } from 'electron';
import jetpack from 'fs-jetpack';
import Worklogs from '@/components/Worklogs.vue';
import Footer from '@/components/Footer.vue';
import PreferencesModal from '@/components/PreferencesModal.vue';
import ValidationModal from '@/components/ValidationModal.vue';
import '@/style/global.scss';
import Preferences from '@/data/preferences';
import Store from 'electron-store';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCog, faRocket } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faJira } from '@fortawesome/free-brands-svg-icons';
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

library.add(faCog);
library.add(faCheckCircle);
library.add(faJira);
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
    PreferencesModal,
    ValidationModal,
    FontAwesomeIcon,
  },
  data: () => ({
    isPreferencesModalVisible: false,
    isValidationModalVisible: false,
    isSubmittingWorklogs: false,
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
    savePreferences(newPreferences: Preferences) {
      this.preferences = newPreferences;
      store.set('preferences', this.preferences);
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
    submitWorklogs() {
      // First validate
      const validator = new WorklogValidator(this.workAttributes);
      const hasInvalidWorklogs = this.worklogs.some((worklog) => !validator.validate(worklog));
      if (hasInvalidWorklogs) {
        this.showValidationModal();
      }

      if (this.currentUser === null) {
        // Todo: Show proper error message saying the user is not logged in
        this.showValidationModal();
      }

      // Then send
      this.isSubmittingWorklogs = true;
    },
    cancelSubmitWorklogs() {
      this.isSubmittingWorklogs = true;
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
