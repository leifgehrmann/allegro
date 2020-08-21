import { PromiseIpcMain } from 'electron-promise-ipc/build/mainProcess';
import { dialog } from 'electron';
import BrowserWindow = Electron.BrowserWindow;
import { promises } from 'fs';

export default function initialiseFileImportIpcMain(
  promiseIpcMain: PromiseIpcMain,
  browserWindow: BrowserWindow
): void {
  promiseIpcMain.on('fileSelectAndRead', async (data: unknown): Promise<string|null> => {
    const file = await dialog.showOpenDialog(browserWindow,{
      properties: ['openFile'],
      filters: [
        { name: 'CSV', extensions: ['csv'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    });
    if (file.canceled) {
      return '';
    }

    return await promises.readFile(file.filePaths[0], 'utf-8');
  });
}
