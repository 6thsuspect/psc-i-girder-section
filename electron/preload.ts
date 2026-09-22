import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('girderDesktop', {
  isElectron: true,
  saveFile: (payload: {
    defaultPath: string;
    data: string;
    encoding?: 'utf8' | 'base64';
  }) => ipcRenderer.invoke('save-file', payload) as Promise<string | null>,
});
