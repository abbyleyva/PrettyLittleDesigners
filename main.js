const { app, ipcMain, powerSaveBlocker } = require("electron");
const { menubar } = require("menubar");

const mb = menubar({
  preloadWindow: true,
  browserWindow: {
    width: 300,
    height: 450,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false,   // needed to stop the timer from lagging when not in focus
    },
  },
});

let powerSaveBlockerId;

mb.on("ready", () => {
  console.log("Menubar app is ready.");
  powerSaveBlockerId = powerSaveBlocker.start('prevent-app-suspension');
});

ipcMain.on("update-timer", (event, time) => {
  console.log(`Received time from renderer process: ${time}`); // Debugging log
  mb.tray.setTitle(time);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

mb.on("after-create-window", () => {
  console.log("Window created");
  mb.window.on("closed", () => {
    mb.window = null;
  });
});
