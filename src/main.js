const { app, BrowserWindow, ipcMain, shell } = require('electron');
require('dotenv').config();
const { EXTERNAL_WINDOW_URLS, TIMEOUT_MS } = require('./constants');

const currentViewList = ['voyager', 'kibana', 'sentry'];
let currentViewIndex = 0;
const windowIds = {
  voyager: null,
  kibana: null,
  sentry: null,
};
let muted = false;
let muteDuration = 0;
let mutedOn = null;

const isMuted = () => {
  console.log({
    muted,
    mutedOn,
    muteDuration,
    now: Date.now(),
  })
  if (!muted) return false;
  if (mutedOn === null) return false;
  if (Date.now() - mutedOn > muteDuration) {
    muted = false;
    mutedOn = null;
    muteDuration = 0;
    return false;
  }
  return true;
}

const ignoredEscalationIDs = [];

const getVisibleWindow = (windows) => {
  return windows.find(window => window.isVisible() && !window.getURL().includes('main_window'));
}

app.whenReady().then(async () => {
  const windows = {
    voyager: new BrowserWindow({
      show: false,
      webPreferences: {
        preload: `${__dirname}/../../src/preload.js`,
        contextIsolation: false,
      }
    }),
    kibana: new BrowserWindow({
      show: false,
      webPreferences: {
        preload: `${__dirname}/../../src/preload.js`,
        contextIsolation: false,
      }
    }),
    sentry: new BrowserWindow({
      show: false,
      webPreferences: {
        preload: `${__dirname}/../../src/preload.js`,
        contextIsolation: false,
      }
    }),
  }
  Object.entries(windows).forEach(([key, window]) => {
    window.loadURL(EXTERNAL_WINDOW_URLS[key]);
    windowIds[key] = window.id;
  })
  ipcMain.handle('getEscalations', fetchEscalations);
  await handleNewView();
});

const fetchEscalations = async () => {
    const response = await fetch(`https://www.jotform.com/API/l3-tickets?activeTab=escalations&status=OPEN&apiKey=${process.env.JOTFORM_API_KEY}`, {
      headers: {
        referer: "https://www.jotform.com"
      }
    });
    const data = await response.json();
    return data.content.filter(escalation => !ignoredEscalationIDs.includes(escalation.id));
}

const muteEscalations = (duration) => {
  muted = true;
  mutedOn = Date.now();
  muteDuration = duration;
}

const handleNewView = async () => {
  if (!isMuted()) {
    const escalations = await fetchEscalations();
    if (escalations.length > 0) {
      const escalationWindow = new BrowserWindow({
        webPreferences: {
          preload: `${__dirname}/../../src/preload.js`,
        }
      });
      // load react app
      escalationWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
      escalationWindow.webContents.send('escalations', escalations);
      escalationWindow.maximize();
      escalationWindow.focus();
      escalationWindow.webContents.setWindowOpenHandler(({ url }) => {
        // open url in a browser and prevent default
        shell.openExternal(url);
        return { action: 'deny' };
    });
      return;
    }
  }
  const newWindow = BrowserWindow.fromId(windowIds[currentViewList[currentViewIndex]]);
  newWindow.reload();
  newWindow.maximize();
  newWindow.focus();
  currentViewIndex = (currentViewIndex + 1) % currentViewList.length;
}

let lastStagnant = 0;

ipcMain.on('stagnant', async (event, data) => {
  const { url, source } = data;
  if (Date.now() - lastStagnant < TIMEOUT_MS) return;
  lastStagnant = Date.now();
  const windows = BrowserWindow.getAllWindows();
  if (Object.keys(windows).length === 0) return;
  const visibleWindow = getVisibleWindow(windows);
  if (visibleWindow?.webContents.getURL() !== url) return;
  visibleWindow.hide();
  await handleNewView();
});

ipcMain.on('muteEscalations', async (event, duration) => {
  console.log(duration);
  muteEscalations(duration);
  await handleNewView();
});

ipcMain.on('ackEscalation', async (event, id) => {
  ignoredEscalationIDs.push(id);
  await handleNewView();
});
