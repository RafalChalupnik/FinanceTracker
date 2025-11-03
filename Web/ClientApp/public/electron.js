const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
// The url module is unused.
const { spawn } = require('child_process');
const fs = require('fs');

app.setName('Finance Tracker');

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

    // --- CORRECTED LOGIC ---
    // In development, we load from the Vite server.
    // In production, we load from the ASP.NET Core server that we start.
    const startUrl = app.isPackaged
        ? 'http://localhost:5288'
        : 'http://localhost:3000';
    // -----------------------

    const loadUrlWithRetry = (retries = 5) => {
        mainWindow.loadURL(startUrl).catch(err => {
            if (retries > 0) {
                console.log(`Failed to load URL, retries left: ${retries - 1}`);
                setTimeout(() => loadUrlWithRetry(retries - 1), 2000);
            } else {
                const errorMessage = app.isPackaged
                    ? `Failed to connect to the backend at ${startUrl}.`
                    : `Failed to connect to the Vite dev server at ${startUrl}. Please ensure it is running.`;
                dialog.showErrorBox('Application Load Error', errorMessage);
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

// The rest of your file remains exactly the same.
app.on('ready', () => {
    if (app.isPackaged) {
        const resourcesPath = process.resourcesPath;
        const backendDir = path.join(resourcesPath, 'backend');
        const backendPath = path.join(backendDir, process.platform === 'win32' ? 'FinanceTracker.Web.exe' : 'FinanceTracker.Web');

        const userDataPath = app.getPath('userData');
        const logPath = path.join(userDataPath, 'backend.log');
        const logStream = fs.createWriteStream(logPath, { flags: 'a' });

        logStream.write(`--- NEW SESSION: ${new Date().toISOString()} ---\n`);

        try {
            const dbConnectionString = `DataSource=${path.join(userDataPath, 'app.db')}`;
            const env = { ...process.env, 'ConnectionStrings__DefaultConnection': dbConnectionString };

            logStream.write(`Starting backend: ${backendPath}\n`);
            logStream.write(`Working directory: ${backendDir}\n`);

            backendProcess = spawn(backendPath, [], { cwd: backendDir, env });

            backendProcess.stdout.on('data', (data) => logStream.write(`STDOUT: ${data.toString()}`));
            backendProcess.stderr.on('data', (data) => logStream.write(`STDERR: ${data.toString()}`));
            backendProcess.on('error', (err) => logStream.write(`SPAWN_ERROR: ${err.toString()}\n`));
            backendProcess.on('exit', (code) => logStream.write(`EXIT_CODE: ${code}\n`));

        } catch (error) {
            logStream.write(`FATAL_LAUNCH_ERROR: ${error.toString()}\n`);
            dialog.showErrorBox('Backend Error', `Could not start the backend. See log for details: ${logPath}`);
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