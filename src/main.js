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

// for getting all items (duh) from the database table
ipcMain.handle('get-all-items', async () => {
  const db = getDb();

  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM Catalogue', (err, rows) => {
      if (err) reject(err);
      else resolve(rows); // send all rows to renderer
    });
  });
});

// for updating edited items
ipcMain.handle('update-item', async (event, item) => {
  const db = getDb();
  console.log(db);

  return new Promise((resolve, reject) => {
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
      item.Index_ID   // WHERE clause
    ];

    db.run(query, params, function(err) {
      if (err) {
        reject(err)
      } else { 
        resolve({ success: true });
      }
    });
  });
});

// adds items to the table
ipcMain.handle('add-item', async (event, item) => {
  const db = getDb();

  return new Promise((resolve, reject) => {
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
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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

    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ success: true });
      }
    });
  });
});

const typePrefixes = { // type prefix for index id
	"ICT EQUIPMENT": "ICT",
	"OFFICE EQUIPMENT": "OFF",
};

// read index id number and increment straight from the database
ipcMain.handle('generate-next-item-id', async (event, type) => {
  const db = getDb();

  const prefix = typePrefixes[type] || type.slice(0, 3).toUpperCase(); // 3 letter prefix for index id

  return new Promise((resolve, reject) => { // gets most recent index id
    const query = `
      SELECT Index_ID FROM Catalogue
      WHERE Type = ?
      ORDER BY Index_ID DESC
      LIMIT 1
    `;
    db.get(query, [type], (err, row) => {
      if (err) return reject(err);

      let nextNumber = 1;
      if (row && row.Index_ID) {
        const parts = row.Index_ID.match(/\d+$/); // extracts the numeric end of the index id
        if (parts) nextNumber = Number.parseInt(parts[0], 10) + 1;
      }

      resolve(`${prefix}${String(nextNumber).padStart(3, "0")}`);
    });
  });
});

// deletes item based on index ID
ipcMain.handle('delete-item', async (event, indexID) => {
  const db = getDb();

  return new Promise((resolve, reject) => {
    const query = `
      DELETE FROM Catalogue 
      WHERE Index_ID = ?
    `;

    db.run(query, [indexID], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ success: true });
      }
    });
  });
});

