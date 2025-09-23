const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

// For development, we need to ignore certificate errors because of the self-signed certificate.
if (!app.isPackaged) {
    app.commandLine.appendSwitch('ignore-certificate-errors');
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    const startUrl = app.isPackaged
        ? url.format({
            pathname: path.join(__dirname, '..', 'build', 'index.html'),
            protocol: 'file:',
            slashes: true,
        })
        : 'https://localhost:7235';

    mainWindow.loadURL(startUrl);

    if (!app.isPackaged) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});