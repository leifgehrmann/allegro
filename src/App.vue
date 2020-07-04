<template>
  <div id="app">
    <div class="content">
      <Worklogs/>
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
          Submit Worklogs (450m)
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

const store = new Store();

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
  }),
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
    },
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
