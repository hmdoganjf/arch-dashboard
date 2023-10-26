const { app, BrowserWindow } = require('electron');
const { EXTERNAL_WINDOW_URLS } = require('./constants');

const currentViewList = ['voyager', 'kibana', 'sentry'];
let currentViewIndex = 0;

const getCurrentWindow = (windows) => {
  if (currentViewIndex === 0) return windows[currentViewList[currentViewList.length - 1]];
  else return windows[currentViewList[currentViewIndex - 1]];
}

app.whenReady().then(() => {
  const windows = {
    voyager: new BrowserWindow({
      show: false,
    }),
    kibana: new BrowserWindow({
      show: false,
    }),
    sentry: new BrowserWindow({
      show: false,
    }),
  }
  Object.entries(windows).forEach(([key, window]) => {
    window.loadURL(EXTERNAL_WINDOW_URLS[key]);
  })
  windows[currentViewList[currentViewIndex]].maximize();
  currentViewIndex = (currentViewIndex + 1) % currentViewList.length;
  setInterval(() => {
    getCurrentWindow(windows).hide();
    const newWindow = windows[currentViewList[currentViewIndex]];
    newWindow.reload();
    newWindow.maximize();
    newWindow.focus();
    currentViewIndex = (currentViewIndex + 1) % currentViewList.length;
  }, 60 * 1000);
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
