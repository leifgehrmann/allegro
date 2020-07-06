<template>
  <Modal
    @close="close"
  >
    <template v-slot:header>
      Preferences
    </template>
    <template v-slot:body>
      <label for="jiraHost">JIRA Host</label>
      <input
        id="jiraHost"
        type="text"
        placeholder="example.atlassian.net"
        v-model="testPreferences.jiraHost"
      >
      <br>
      <label for="jiraUsername">JIRA Username</label>
      <input
        id="jiraUsername"
        type="text"
        placeholder="user@example.com"
        v-model="testPreferences.jiraUsername"
      >
      <br>
      <label for="jiraToken">JIRA API Token</label>
      <input id="jiraToken" type="text" v-model="testPreferences.jiraToken">
      <br>
      <label/>
      <button
        @click="testJiraConnection"
      >
        Test JIRA
        <font-awesome-icon icon="circle-notch" v-if="testJiraState==='testing'" spin/>
        <font-awesome-icon icon="check" v-if="testJiraState==='success'"/>
        <font-awesome-icon icon="times" v-if="testJiraState==='failed'"/>
      </button>
      <br>
      <label for="tempoToken">Tempo API Token</label>
      <input id="tempoToken" type="text" v-model="testPreferences.tempoToken">
      <br>
      <label/>
      <button
        @click="testTempoConnection"
      >
        Test Tempo
        <font-awesome-icon icon="circle-notch" v-if="testTempoState==='testing'" spin/>
        <font-awesome-icon icon="check" v-if="testTempoState==='success'"/>
        <font-awesome-icon icon="times" v-if="testTempoState==='failed'"/>
      </button>
    </template>
    <template v-slot:footer>
      <button
        @click="close"
      >
        Cancel
      </button>
      <button
        @click="save"
      >
        OK
      </button>
    </template>
  </Modal>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import Modal from '@/components/Modal.vue';
import Preferences from '@/data/preferences';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircleNotch, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import JiraIpcRenderer from '@/utils/ipc/jiraIpcRenderer';
import TempoIpcRenderer from '@/utils/ipc/tempoIpcRenderer';

library.add(faCircleNotch);
library.add(faCheck);
library.add(faTimes);

export default Vue.extend({
  name: 'PreferencesModal',
  props: {
    preferences: {
      type: Object,
      default: (): Preferences => ({
        jiraHost: '',
        jiraUsername: '',
        jiraToken: '',
        tempoToken: '',
      }),
    },
  },
  data: () => ({
    testPreferences: {
      jiraHost: '',
      jiraUsername: '',
      jiraToken: '',
      tempoToken: '',
    } as Preferences,
    testJiraState: 'untested' as 'untested'|'testing'|'failed'|'success',
    testTempoState: 'untested' as 'untested'|'testing'|'failed'|'success',
  }),
  components: {
    Modal,
    FontAwesomeIcon,
  },
  mounted(): void {
    this.initialize();
  },
  watch: {
    testPreferences: {
      handler() {
        this.testJiraState = 'untested';
        this.testTempoState = 'untested';
      },
      deep: true,
    },
  },
  methods: {
    initialize() {
      this.testPreferences = { ...this.preferences };
    },
    close() {
      this.$emit('close');
    },
    save() {
      this.$emit('save', { ...this.testPreferences });
      this.close();
    },
    testJiraConnection() {
      this.testJiraState = 'testing';
      const jiraIpcRenderer = new JiraIpcRenderer();
      jiraIpcRenderer.setPreferences(this.testPreferences);
      jiraIpcRenderer.getCurrentUser()
        .then(() => { this.testJiraState = 'success'; })
        .catch(() => { this.testJiraState = 'failed'; });
    },
    testTempoConnection() {
      this.testTempoState = 'testing';
      const tempoIpcRenderer = new TempoIpcRenderer();
      tempoIpcRenderer.setPreferences(this.testPreferences);
      tempoIpcRenderer.getWorkAttributes()
        .then(() => { this.testTempoState = 'success'; })
        .catch(() => { this.testTempoState = 'failed'; });
    },
  },
});
</script>

<style scoped>
label {
  display: inline-block;
  width: 140px;
  text-align: right;
  margin: 5px;
}
input {
  margin: 5px;
  font-family: monospace;
  width: 245px;
}
button {
  margin: 5px;
}
</style>
