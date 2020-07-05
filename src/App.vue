<template>
  <div id="app">
    <div class="content">
      <Worklogs
        :worklogs="worklogs"
      />
    </div>
    <Footer>
      <template v-slot:left>
        <button
          @click="showModal">
          <font-awesome-icon icon="cog"/>
          Settings
        </button>
        (<font-awesome-icon :icon="['fab', 'jira']"/> JIRA: OK,
        <font-awesome-icon :icon="['far', 'check-circle']"/> Tempo: OK)
      </template>
      <template v-slot:right>
        <button id="submit-submitEntries">
          <font-awesome-icon icon="rocket"/>
          Submit Worklogs {{totalMinutes}}
        </button>
      </template>
    </Footer>
    <PreferencesModal
      :preferences="preferences"
      v-show="isPreferencesModalVisible"
      @close="closeModal"
      @save="savePreferences"
    />
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import { remote } from 'electron';
import jetpack from 'fs-jetpack';
import { v4 as uuidv4 } from 'uuid';
import Worklogs from '@/components/Worklogs.vue';
import Footer from '@/components/Footer.vue';
import PreferencesModal from '@/components/PreferencesModal.vue';
import '@/style/global.scss';
import Preferences from '@/data/preferences';
import Store from 'electron-store';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCog, faRocket } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faJira } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Worklog from '@/data/worklog';
import WorklogPopulator from '@/utils/worklogPopulator';
import IndexedCache from '@/utils/indexedCache';
import { JiraApiIssueResponse } from '@/data/jiraApiResponseTypes';
import ObjectCache from '@/utils/objectCache';
import { WorkAttributeResponse } from 'tempo-client/lib/responseTypes';
import WorkAttributePopulator from '@/utils/workAttributePopulator';

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

const worklogs: Worklog[] = [
  {
    uuid: uuidv4(),
    date: '2020-07-03',
    issueKey: 'TEST-123',
    issueKeyIsValid: true,
    issueUrl: 'https://test.atlassian.net/browser/TEST-123',
    issueTitle: 'This test issue is valid',
    minutes: '123',
    message: 'Hey, just want to leave a message saying, hi!',
    projectAccounts: [''],
    issueAccount: '',
  },
];
const workAttributes: WorkAttributeResponse[] = [];

const store = new Store();
const issueCache: IndexedCache<JiraApiIssueResponse> = new IndexedCache('jiraIssues', store);
const workAttributesCache: ObjectCache<WorkAttributeResponse[]> = new ObjectCache('tempoWorkAttributes', store);

preferences = { ...preferences, ...store.get('preferences') };

export default Vue.extend({
  name: 'App',
  components: {
    Worklogs,
    Footer,
    PreferencesModal,
    FontAwesomeIcon,
  },
  data: () => ({
    isPreferencesModalVisible: false,
    manifest,
    preferences,
    worklogs,
    workAttributes,
    issueCache,
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
    showModal() {
      this.isPreferencesModalVisible = true;
    },
    closeModal() {
      this.isPreferencesModalVisible = false;
    },
    savePreferences(newPreferences: Preferences) {
      this.preferences = newPreferences;
      store.set('preferences', this.preferences);
      this.clearCacheAndPopulate();
    },
    async clearCacheAndPopulate() {
      issueCache.invalidate();
      workAttributesCache.invalidate();
      this.populate();
    },
    async populate(): Promise<void> {
      this.workAttributes = await new WorkAttributePopulator(
        this.preferences,
        workAttributesCache,
      ).populate();
    },
  },
  watch: {
    worklogs: {
      handler() {
        // Todo: Defer to reduce massive I/O ops
        store.set('worklogs', this.worklogs);
        const populator = new WorklogPopulator(this.worklogs, this.preferences, issueCache);
        populator.populate();
      },
      deep: true,
    },
  },
  mounted(): void {
    worklogs.push(...store.get('worklogs') ?? []);
    this.populate();
  },
});
</script>

<style scoped>
.content {
  width: 100%;
  height: calc(100vh - 35px);
  margin-bottom: 37px;
  overflow: scroll;
}
</style>
