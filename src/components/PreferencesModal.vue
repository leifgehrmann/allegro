<template>
  <Modal
    @close="close"
  >
    <template v-slot:header>
      Preferences
    </template>
    <template v-slot:body>
      <label>
        JIRA Host
        <input type="text" placeholder="example.atlassian.net" v-model="testPreferences.jiraHost">
      </label>
      <br>
      <label>
        JIRA Username
        <input type="text" placeholder="user@example.com" v-model="testPreferences.jiraUsername">
      </label>
      <br>
      <label>
        JIRA API Token
        <input type="text" v-model="testPreferences.jiraToken">
      </label>
      <br>
      <label>
        Tempo API Token
        <input type="text" v-model="testPreferences.tempoToken">
      </label>
    </template>
    <template v-slot:footer>
      <button
        @click="testConnection"
      >
        Test Connections
      </button>
      <button
        @click="save"
      >
        Save
      </button>
    </template>
  </Modal>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import Modal from '@/components/Modal.vue';
import Preferences from '@/data/preferences';
import PromiseIpc from 'electron-promise-ipc/build/renderer';

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
  }),
  components: {
    Modal,
  },
  mounted(): void {
    this.initialize();
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
    testConnection() {
      PromiseIpc.send('testConnection', this.testPreferences)
        .then(() => {
          console.log('Hurray success!');
        });
    },
  },
});
</script>

<style scoped>

</style>
