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
        <input type="text" placeholder="example.atlassian.net" v-model="preferences.jiraHost">
      </label>
      <br>
      <label>
        JIRA Username
        <input type="text" placeholder="user@example.com" v-model="preferences.jiraUsername">
      </label>
      <br>
      <label>
        JIRA API Token
        <input type="text" v-model="preferences.jiraToken">
      </label>
      <br>
      <label>
        Tempo API Token
        <input type="text" v-model="preferences.tempoToken">
      </label>
    </template>
    <template v-slot:footer>
      <button
        @click="testConnection"
      >
        Test Connections
      </button>
      <button
        @click="close"
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
import promiseIpc from 'electron-promise-ipc';

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
  components: {
    Modal,
  },
  methods: {
    close() {
      this.$emit('close');
    },
    testConnection() {
      console.log('hmmm');
      promiseIpc.send('testConnection', this.preferences)
        .then(() => {
          console.log('Hurray success!');
        });
    },
  },
});
</script>

<style scoped>

</style>
