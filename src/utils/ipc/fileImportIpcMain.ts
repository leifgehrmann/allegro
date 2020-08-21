import { PromiseIpcMain } from 'electron-promise-ipc/build/mainProcess';
import { dialog } from 'electron';
import { promises } from 'fs';
import BrowserWindow = Electron.BrowserWindow;

export default function initialiseFileImportIpcMain(
  promiseIpcMain: PromiseIpcMain,
  browserWindow: BrowserWindow,
): void {
  promiseIpcMain.on('fileSelectAndRead', async (): Promise<string|null> => {
    const file = await dialog.showOpenDialog(browserWindow, {
      properties: ['openFile'],
      filters: [
        { name: 'CSV', extensions: ['csv'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });
    if (file.canceled) {
      return '';
    }

    return promises.readFile(file.filePaths[0], 'utf-8');
  });
}
