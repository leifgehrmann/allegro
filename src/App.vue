<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <div>isElectron: {{ isElectronApp }}</div>
    <div>manifest: {{ manifest }}</div>
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { remote } from 'electron';
import jetpack from 'fs-jetpack';
import isElectron from 'is-electron';
import HelloWorld from './components/HelloWorld.vue';

let manifest = 'N/A';
if (isElectron()) {
  const { app } = remote;
  const appDir = jetpack.cwd(app.getAppPath());
  manifest = appDir.read('package.json', 'json');
}

@Component({
  components: {
    HelloWorld,
  },
  data: () => ({
    isElectronApp: isElectron() ? 'Yes' : 'No',
    manifest,
  }),
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
