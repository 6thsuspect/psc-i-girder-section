import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function createWindow() {
  const win = new BrowserWindow({
    width: 1560,
    height: 940,
    minWidth: 1120,
    minHeight: 740,
    backgroundColor: '#0b1018',
    title: 'PSC-I Girder Mid-Section',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const devUrl = process.env.VITE_DEV_SERVER_URL;
  if (devUrl) {
    void win.loadURL(devUrl);
  } else {
    void win.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle(
  'save-file',
  async (
    _event,
    payload: { defaultPath: string; data: string; encoding?: 'utf8' | 'base64' },
  ) => {
    const result = await dialog.showSaveDialog({
      defaultPath: payload.defaultPath,
    });
    if (result.canceled || !result.filePath) return null;
    const encoding = payload.encoding === 'base64' ? 'base64' : 'utf8';
    await fs.writeFile(result.filePath, payload.data, { encoding });
    return result.filePath;
  },
);
