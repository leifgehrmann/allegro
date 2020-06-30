<template>
  <div id="app">
    <div class="content">
      <Worklogs/>
    </div>
    <div class="footer">
      <div class="align-left">
        <button
          @click="showModal">
          <img src="./assets/jira-connected.svg"> OK
          <img src="./assets/tempo-connected.svg"> OK
        </button>
      </div>
      <div class="align-right">
        <button id="submit-submitEntries">Submit Worklogs</button>
      </div>
    </div>
    <PreferencesModal
      v-show="isPreferencesModalVisible"
      @close="closeModal"
    />
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import { remote } from 'electron';
import jetpack from 'fs-jetpack';
import isElectron from 'is-electron';
import Worklogs from '@/components/Worklogs.vue';
import PreferencesModal from '@/components/PreferencesModal.vue';

let manifest = 'N/A';
if (isElectron()) {
  const { app } = remote;
  const appDir = jetpack.cwd(app.getAppPath());
  manifest = appDir.read('package.json', 'json');
}

export default Vue.extend({
  name: 'App',
  components: {
    Worklogs,
    PreferencesModal,
  },
  data: () => ({
    isPreferencesModalVisible: false,
    isElectronApp: isElectron() ? 'Yes' : 'No',
    manifest,
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

<style lang="scss">
body {
  margin: 0;
  background: #FFF;
  font-weight: 400;
  font-family: Helvetica, Arial, Verdana, sans-serif;
  font-size: 13px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body.window-unfocused button,
body.window-unfocused select,
body.window-unfocused input,
body.window-unfocused .textarea {
  opacity: 0.5;
}

button {
  background-color: rgba(0, 0, 0, 0.05);
  border: none;
  margin: 0;
  padding: 5px;
  border-radius: 5px;
  outline: none;
}

.icon {
  display: inline-block;
  vertical-align: middle;
  background-size: 16px 16px;
  background-position: left;
  background-position-x: 5px;
  background-position-y: 5px;
  background-repeat: no-repeat;
  width: calc(16px + 5px * 2);
  height: calc(16px + 5px * 2);
}
button.icon-jira-connected {
  background-image: url("./assets/jira-connected.svg");
}
button.icon-tempo-connected {
  background-image: url("./assets/tempo-connected.svg");
}
button.icon-labeled-horizontal {
  padding-left: calc(16px + 10px);
  width: auto;
}
input {
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  padding: 5px;
  outline: none;
}
input[type="date"] {
  padding: 5px;
  border-radius: 0;
}
input:focus {
  border-bottom: 1px solid rgba(0, 0, 0, 0.4);
}
.textarea {
  display: block;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  padding: 5px;
  outline: none;
  font-family: Helvetica, Arial, Verdana, sans-serif;
}
</style>
<style scoped>
.content {
  width: 100%;
  height: calc(100vh - 37px);
  margin-bottom: 37px;
  overflow: scroll;
}
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #EEEEEE;
  height: 37px;
  padding: 7px;
  box-sizing: border-box;
}
.footer .align-left {
  float: left;
}
.footer .align-right {
  float: right;
}
</style>
