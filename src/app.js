import "./helpers/context_menu.js";
import "./helpers/external_links.js";

import { remote } from "electron";
import jetpack from "fs-jetpack";
import env from "env";
import Vue from "vue";
import App from './App.vue';

const app = remote.app;
const appDir = jetpack.cwd(app.getAppPath());

const manifest = appDir.read("package.json", "json");

const osMap = {
    win32: "Windows",
    darwin: "macOS",
    linux: "Linux"
};

Vue.config.productionTip = false;
console.log('hey!');

new Vue({
    render: (h) => h(App),
}).$mount('#app');
