import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';

import { initDatabase, getDb } from './db/database.js';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.maximize();

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  try {
    await initDatabase();   // initializes database first
    createWindow();
  } catch (err) {
    console.error('Database initialization failed:', err);
    app.quit(); // no db = no app
  }
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers ----

// for getting all items (duh) from the database table
ipcMain.handle('get-all-items', async () => {
  const db = getDb();
  try {
    return db.prepare('SELECT * FROM Catalogue').all();
  } catch (err) {
    console.error(err);
    throw err;
  }
});

// add item
ipcMain.handle('add-item', (event, item) => {
  const db = getDb();
  const query = `
    INSERT INTO Catalogue (
      Index_ID, 
      Type, 
      Property_Description, 
      Brand, 
      Property_Number,
      Acquisition_Date, 
      Acquisition_Cost, 
      Memorandum_Receipt, 
      District, 
      Equipment_Location
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    item.Index_ID, 
    item.Type, 
    item.Property_Description, 
    item.Brand,
    item.Property_Number, 
    item.Acquisition_Date, 
    item.Acquisition_Cost,
    item.Memorandum_Receipt, 
    item.District, 
    item.Equipment_Location
  ];

  try {
    db.prepare(query).run(params);
    return { success: true };
  } catch (err) {
    console.error(err);
    throw err;
  }
});

// update item based on id
ipcMain.handle('update-item', (event, item) => {
  const db = getDb();
  const query = `
    UPDATE Catalogue
    SET 
      Property_Description = ?, 
      Brand = ?, 
      Property_Number = ?, 
      Type = ?,
      Acquisition_Date = ?, 
      Acquisition_Cost = ?, 
      Memorandum_Receipt = ?,
      District = ?, 
      Equipment_Location = ?
    WHERE Index_ID = ?
  `;
  const params = [
    item.Property_Description, 
    item.Brand, 
    item.Property_Number, 
    item.Type,
    item.Acquisition_Date, 
    item.Acquisition_Cost, 
    item.Memorandum_Receipt,
    item.District, 
    item.Equipment_Location, 
    item.Index_ID
  ];

  try {
    db.prepare(query).run(params);
    return { success: true };
  } catch (err) {
    console.error(err);
    throw err;
  }
});

// delete items based on ids in array
ipcMain.handle('delete-item', (event, indexIDs) => {
  const db = getDb();
  if (!Array.isArray(indexIDs)) indexIDs = [indexIDs];

  try {
    const stmt = db.prepare('DELETE FROM Catalogue WHERE Index_ID = ?');
    for (const id of indexIDs) {
      stmt.run(id);
    }
    return { success: true };
  } catch (err) {
    console.error(err);
    throw err;
  }
});

// get highest index and generate next id
const typePrefixes = { "ICT EQUIPMENT": "ICT", "OFFICE EQUIPMENT": "OFF" };
ipcMain.handle('generate-next-item-id', (event, type) => {
  const db = getDb();
  const prefix = typePrefixes[type] || type.slice(0, 3).toUpperCase();

  const row = db.prepare(`
    SELECT Index_ID FROM Catalogue
    WHERE Type = ?
    ORDER BY Index_ID DESC
    LIMIT 1
  `).get(type);

  let nextNumber = 1;
  if (row?.Index_ID) {
    const parts = row.Index_ID.match(/\d+$/);
    if (parts) nextNumber = Number.parseInt(parts[0], 10) + 1;
  }

  return `${prefix}${String(nextNumber).padStart(3, "0")}`;
});