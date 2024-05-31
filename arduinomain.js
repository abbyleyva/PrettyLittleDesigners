// const { app, BrowserWindow } = require('electron');
// const SerialPort = require('serialport');

// let mainWindow;
// let port;

// function createWindow() {
//     mainWindow = new BrowserWindow({
//             width: 800,
//             height: 600,
//             webPreferences: {
//               preload: path.join(__dirname, 'preload.js'),
//               nodeIntegration: true, // Enable Node.js integration
//               contextIsolation: false, // Disable context isolation
//         },
//     });

//   // Open the serial port
//   port = new SerialPort('/dev/tty.usbmodem11201', { // Replace with your serial port path
//     baudRate: 9600 // Replace with your baud rate
//   });

//   // Listen for data on the serial port
//   port.on('data', (data) => {
//     console.log('Data:', data); // Log the received data
//     mainWindow.webContents.send('serial-data', data); // Send data to renderer process
//   });
//   //mainWindow.loadFile('index.html');
// }

// app.whenReady().then(createWindow);




const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { SerialPort } = require('serialport');

// Initializing the USB port
const port = new SerialPort({ path: '/dev/tty.usbmodem1201', baudRate: 9600 }); //On terminal, ls/dev/tty.*
const Readline = require('@serialport/parser-readline');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true, // Enable Node.js integration
      contextIsolation: false, // Disable context isolation
    },
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Listening to Serial Data
port.on('data', (data) => {
    console.log('Received data:', data);
    
    // Send the data to the renderer process
    mainWindow.webContents.send('serial-data', data);
  });


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});






