/// <reference types="vite/client" />

export {};

declare global {
  interface Window {
    girderDesktop?: {
      isElectron: boolean;
      saveFile: (payload: {
        defaultPath: string;
        data: string;
        encoding?: 'utf8' | 'base64';
      }) => Promise<string | null>;
    };
  }
}
