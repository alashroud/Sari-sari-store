// main.js
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')

// File where data will be stored
const dataFile = path.join(__dirname, 'data.json')

// Create window
function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'renderer.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.loadFile('index.html')
}

// Create window when app is ready
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// Read data from file
function readData() {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify([]))
  }
  const data = fs.readFileSync(dataFile)
  return JSON.parse(data)
}

// Write data to file
function writeData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2))
}

// Handle add item
ipcMain.on('add-item', (event, item) => {
  const items = readData()
  items.push(item)
  writeData(items)
  event.reply('item-added', items)
})

// Handle get items
ipcMain.on('get-items', (event) => {
  const items = readData()
  event.reply('items-list', items)
})

// Handle delete item
ipcMain.on('delete-item', (event, name) => {
  let items = readData()
  items = items.filter(i => i.name !== name)
  writeData(items)
  event.reply('item-deleted', items)
})
