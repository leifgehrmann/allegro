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
      </button>
      <transition name="slide-fade">
        <font-awesome-icon icon="circle-notch" v-if="testJiraState==='testing'" spin/>
        <font-awesome-icon icon="check" v-if="testJiraState==='success'"/>
        <font-awesome-icon icon="times" v-if="testJiraState==='failed'"/>
      </transition>
      <hr>
      <br>
      <label for="tempoToken">Tempo API Token</label>
      <input id="tempoToken" type="text" v-model="testPreferences.tempoToken">
      <br>
      <label/>
      <button
        @click="testTempoConnection"
      >
        Test Tempo
      </button>
      <transition name="slide-fade">
        <font-awesome-icon icon="circle-notch" v-if="testTempoState==='testing'" spin/>
        <font-awesome-icon icon="check" v-if="testTempoState==='success'"/>
        <font-awesome-icon icon="times" v-if="testTempoState==='failed'"/>
      </transition>
      <hr>
      <label/>
      <button
        @click="resetCache"
      >
        Reset Cache
      </button>
      <transition name="slide-fade">
        <font-awesome-icon icon="check" v-if="resettedCache"/>
      </transition>
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
    resettedCache: false,
    indicatorTimeout: 3000,
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
    resetCache() {
      this.$emit('reset-cache');
      this.resettedCache = true;
      setTimeout(() => {
        this.resettedCache = false;
      }, this.indicatorTimeout);
    },
    close() {
      this.$emit('close');
    },
    save() {
      this.$emit('save', { ...this.testPreferences });
      this.close();
    },
    async testJiraConnection() {
      this.testJiraState = 'testing';
      const jiraIpcRenderer = new JiraIpcRenderer();
      jiraIpcRenderer.setPreferences(this.testPreferences);
      try {
        await jiraIpcRenderer.getCurrentUser();
        this.testJiraState = 'success';
      } catch (error) {
        this.testJiraState = 'failed';
      }
      setTimeout(() => {
        this.testJiraState = 'untested';
      }, this.indicatorTimeout);
    },
    async testTempoConnection() {
      this.testTempoState = 'testing';
      const tempoIpcRenderer = new TempoIpcRenderer();
      tempoIpcRenderer.setPreferences(this.testPreferences);
      try {
        await tempoIpcRenderer.getWorkAttributes();
        this.testTempoState = 'success';
      } catch (error) {
        this.testTempoState = 'failed';
      }
      setTimeout(() => {
        this.testTempoState = 'untested';
      }, this.indicatorTimeout);
    },
  },
});
</script>

<style scoped>
hr {
  border: 1px solid rgba(0,0,0,0.1);
}
label {
  display: inline-block;
  width: 110px;
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
.slide-fade-enter-active {
  transition: all;
}
.slide-fade-leave-active {
  transition: all .3s ease;
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(5px);
  opacity: 0;
}
</style>
