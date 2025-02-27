const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  // Cria a janela principal
  mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      nodeIntegration: true, // Permite usar Node.js na interface
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  // Carrega o arquivo HTML da interface
  mainWindow.loadFile('index.html');

  // Abre o DevTools (ferramentas de desenvolvedor) - opcional
  // mainWindow.webContents.openDevTools();

  // Evento quando a janela é fechada
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Quando o Electron estiver pronto, cria a janela
app.on('ready', createWindow);

// Fecha a aplicação quando todas as janelas são fechadas
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Reabre a janela no macOS (comportamento padrão)
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});