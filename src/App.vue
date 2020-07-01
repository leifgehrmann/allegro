<template>
  <div id="app">
    <div class="content">
      <Worklogs/>
    </div>
    <Footer>
      <template v-slot:left>
        <button
          @click="showModal">
          <img src="./assets/jira-connected.svg" alt="JIRA"> OK
          <img src="./assets/tempo-connected.svg" alt="Tempo"> OK
        </button>
      </template>
      <template v-slot:right>
        <button id="submit-submitEntries">Submit Worklogs</button>
      </template>
    </Footer>
    <PreferencesModal
      :preferences="preferences"
      v-show="isPreferencesModalVisible"
      @close="closeModal"
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

let manifest = 'N/A';

const { app } = remote;
const appDir = jetpack.cwd(app.getAppPath());
manifest = appDir.read('package.json', 'json');

const preferences: Preferences = {
  jiraHost: '',
  jiraToken: '',
  jiraUsername: '',
  tempoToken: '',
};

export default Vue.extend({
  name: 'App',
  components: {
    Worklogs,
    Footer,
    PreferencesModal,
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
