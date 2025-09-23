const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const url = require('url');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess = null;

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

    const startUrl = 'https://localhost:7235';

    // Retry logic to give the backend time to start
    const loadUrlWithRetry = (retries = 5) => {
        mainWindow.loadURL(startUrl).catch(err => {
            if (retries > 0) {
                console.log(`Failed to load URL, retries left: ${retries - 1}`);
                setTimeout(() => loadUrlWithRetry(retries - 1), 2000);
            } else {
                dialog.showErrorBox('Application Load Error', `Failed to connect to ${startUrl}. The application will close.`);
                app.quit();
            }
        });
    };

    loadUrlWithRetry();

    if (!app.isPackaged) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', () => {
    if (app.isPackaged) {
        const backendExecutableName = process.platform === 'win32' ? 'FinanceTracker.Web.exe' : 'FinanceTracker.Web';
        const backendPath = path.join(process.resourcesPath, 'backend', backendExecutableName);

        try {
            backendProcess = spawn(backendPath);
            console.log(`Started backend process from ${backendPath}`);
        } catch (error) {
            console.error('Failed to start backend process.', error);
            dialog.showErrorBox('Backend Error', 'Could not start the backend service.');
        }
    }
    createWindow();
});

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

// Make sure to kill the backend process when the app quits
app.on('will-quit', () => {
    if (backendProcess) {
        console.log('Killing backend process.');
        backendProcess.kill();
    }
});