const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const url = require('url');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;
let backendProcess = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    const startUrl = 'http://localhost:5288';

    const loadUrlWithRetry = (retries = 5) => {
        mainWindow.loadURL(startUrl).catch(err => {
            if (retries > 0) {
                console.log(`Failed to load URL, retries left: ${retries - 1}`);
                setTimeout(() => loadUrlWithRetry(retries - 1), 2000);
            } else {
                const userDataPath = app.getPath('userData');
                const logPath = path.join(userDataPath, 'backend.log');
                dialog.showErrorBox(
                    'Application Load Error',
                    `Failed to connect to the backend at ${startUrl}. Please check the log file for details: ${logPath}`
                );
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
        const backendDir = path.join(process.resourcesPath, 'backend');
        const backendPath = path.join(backendDir, backendExecutableName);

        const userDataPath = app.getPath('userData');
        const dbPath = path.join(userDataPath, 'app.db');
        const logPath = path.join(userDataPath, 'backend.log');
        const frontendPath = path.join(app.getAppPath(), '..', 'app.asar.unpacked', 'build');

        // Create a writable stream for the log file
        const logStream = fs.createWriteStream(logPath, { flags: 'a' });

        try {
            console.log('--- Starting Backend ---');
            console.log(`Executable: ${backendPath}`);
            console.log(`Working Dir: ${backendDir}`);
            console.log(`Web Root: ${frontendPath}`);
            console.log(`Database: ${dbPath}`);
            console.log(`Log File: ${logPath}`);

            backendProcess = spawn(backendPath, [
                `--webroot=${frontendPath}`,
                `--ConnectionStrings:DefaultConnection=DataSource=${dbPath}`
            ], { cwd: backendDir }); // Set the working directory

            // Pipe backend output to the log file and to the console
            backendProcess.stdout.pipe(logStream);
            backendProcess.stderr.pipe(logStream);
            backendProcess.stdout.on('data', (data) => console.log(`BACKEND: ${data}`));
            backendProcess.stderr.on('data', (data) => console.error(`BACKEND_ERROR: ${data}`));

        } catch (error) {
            console.error('Failed to start backend process.', error);
            dialog.showErrorBox('Backend Error', `Could not start the backend service. See log for details: ${logPath}`);
            logStream.write(`Failed to spawn backend process: ${error.toString()}`);
            app.quit();
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

app.on('will-quit', () => {
    if (backendProcess) {
        console.log('Killing backend process.');
        backendProcess.kill();
    }
});