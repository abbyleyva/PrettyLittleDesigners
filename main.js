const { app, ipcMain, powerSaveBlocker } = require("electron");
const { menubar } = require("menubar");

const mb = menubar({
  preloadWindow: true,
  browserWindow: {
    width: 300,
    height: 450,
    resizable: false,
    minimizable: false,
    maximizable: false,
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
  mb.window.webContents.openDevTools({ mode: 'detach' }); // Ensure DevTools is opened and detached
});

ipcMain.on("update-timer", (event, time) => {
  // console.log(`Received time from renderer process: ${time}`); // Debugging log
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

// Handle the 'reset-menubar' event
ipcMain.on('reset-menubar', () => {
  if (mb.window) {
    mb.window.setTitle('Timer App');
    mb.tray.setTitle('');
  }
});

// Handle transition from work to break in menu bar
ipcMain.on('work-break-trans', () => {
  if (mb.window) {
    mb.window.setTitle('Timer App');
    mb.tray.setTitle('Break Time!');
  }
});

// Handle transition from break to work in menu bar
ipcMain.on('break-work-trans', () => {
  if (mb.window) {
    mb.window.setTitle('Timer App');
    mb.tray.setTitle('Work Time!');
  }
});


// // hardware
// const {BrowserWindow } = require('electron');
// const path = require('path');
// const { SerialPort } = require('serialport');


// // Handle lifting phone
// ipcMain.on('phone-lift', () => {
//   if (mb.window) {
//     mb.window.setTitle('Timer App');
//     mb.tray.setTitle('Put Phone Back!');
//   }
// });

// // Initializing the USB port
// const port = new SerialPort({ path: '/dev/tty.usbmodem21201', baudRate: 9600 }); //On terminal, ls/dev/tty.*
// const Readline = require('@serialport/parser-readline');

// // Listening to Serial Data
// port.on('data', (data) => {
//     console.log('Received data:', data);
//     mb.window.webContents.send('Received data', data)
//   });


// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') app.quit();
// });