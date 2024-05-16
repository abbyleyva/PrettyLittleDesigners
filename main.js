// const { app, BrowserWindow, ipcMain } = require('electron');

// const createWindow = () => {
//   const win = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       nodeIntegration: true,
//       contextIsolation: false,
//       enableRemoteModule: false  // We are not using remote module now
//     }
//   });

//   win.loadFile('index.html');

//   ipcMain.on('close-window', () => {
//     win.close();
//   });
// };

// app.whenReady().then(createWindow);

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

///// FUNCTIONAL COUNTDOWN BUT NOT SYNC W TIMER.JS ///////////

// const { app } = require('electron');
// const { menubar } = require('menubar');

// const mb = menubar({
//   preloadWindow: true,
//   browserWindow: {
//     width: 300,
//     height: 200,
//     webPreferences: {
//       nodeIntegration: true,
//       contextIsolation: false
//     }
//   }
// });

// let totalTime = 25 * 60; // 25 minutes in seconds

// mb.on('ready', () => {
//   console.log('Menubar app is ready.');

//   // Update the tray title to show remaining time every second
//   setInterval(() => {
//     if (totalTime >= 0) {
//       const minutes = Math.floor(totalTime / 60);
//       const seconds = totalTime % 60;
//       const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
//       mb.tray.setTitle(formattedTime);
//       totalTime--;
//     } else {
//       mb.tray.setTitle('Time\'s up!');
//     }
//   }, 1000);
// });

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
