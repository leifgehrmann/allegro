import { app, protocol, BrowserWindow } from 'electron';
import {
  installVueDevtools,
} from 'vue-cli-plugin-electron-builder/lib';
import promiseIpc from 'electron-promise-ipc';
import { PromiseIpcMain } from 'electron-promise-ipc/build/mainProcess';
import createMainWindow from '@/backgroundMainWindow';
import initialiseJiraIpcMain from '@/utils/jiraIpcMain';
import initializePreferencesIpcMain from '@/utils/preferencesIpcMain';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Keep a global reference of the window and ipc object, if you don't, the instances will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null;
const ipc: PromiseIpcMain = promiseIpc;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installVueDevtools();
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  initializePreferencesIpcMain(ipc);
  initialiseJiraIpcMain(ipc);
  win = createMainWindow();
  win.on('closed', () => {
    win = null;
  });
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
