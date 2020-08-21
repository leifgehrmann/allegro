import PromiseIpc from 'electron-promise-ipc/build/renderer';

export default class FileImportIpcRenderer {
  static async fileSelectAndRead(): Promise<string> {
    return await PromiseIpc.send('fileSelectAndRead') as Promise<string>;
  }
}
