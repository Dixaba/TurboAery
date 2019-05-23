const { app, BrowserWindow } = require('electron')

function createWindow() {
  // Создаем окно браузера.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadURL('http://localhost:3000/');
}

app.on('ready', createWindow)