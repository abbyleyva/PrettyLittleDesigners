// Sending data to renderer
const { ipcRenderer } = require('electron');

ipcRenderer.on('serial-data', (event, data) => {
  // Update the UI with the received data
  const dataElement = document.getElementById('serial-data');
  dataElement.textContent += data;
});
