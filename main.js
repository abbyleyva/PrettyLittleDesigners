const { app, ipcMain } = require("electron");
const { menubar } = require("menubar");

const mb = menubar({
  preloadWindow: true,
  browserWindow: {
    width: 300,
    height: 450,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  },
});

mb.on("ready", () => {
  console.log("Menubar app is ready.");
  npm;
});

// Listen for timer update messages from the renderer process
ipcMain.on("update-timer", (event, time) => {
  mb.tray.setTitle(time);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

mb.on("after-create-window", () => {
  // Additional configurations or actions after window creation
  console.log("Window created");

  // Example: setting the window to null when closed
  mb.window.on("closed", () => {
    mb.window = null;
  });
});
