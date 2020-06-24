import "./helpers/context_menu.ts";
import "./helpers/external_links.ts";

import { remote } from "electron";
import jetpack from "fs-jetpack";
// @ts-ignore
import env from "env";
import Vue, {VNode} from "vue";
import App from "./App.vue";

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
    render: (h): VNode => h(App),
}).$mount('#app');
