import createWindowFromState from '@/helpers/window';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import BrowserWindow = Electron.BrowserWindow;

export default function createMainWindow(): BrowserWindow {
  // Create the browser window.
  const win: BrowserWindow | null = createWindowFromState('main', {
    width: 900,
    height: 600,
    minWidth: 900,
    minHeight: 200,
    backgroundColor: '#FFFFFF',
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // for more info, see:
      // nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration
      nodeIntegration: (process.env
        .ELECTRON_NODE_INTEGRATION as unknown) as boolean,
    },
    show: false,
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }

  win.on('blur', () => win?.webContents.executeJavaScript('document.body.classList.add("window-unfocused")'));
  win.on('focus', () => win?.webContents.executeJavaScript('document.body.classList.remove("window-unfocused")'));
  win.once('ready-to-show', () => win?.show());

  return win;
}
