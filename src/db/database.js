// Loads the database into the app
import Database from 'better-sqlite3';
import fs from 'node:fs';
import { app } from 'electron';
import path from 'node:path';

import { saveDbPath, loadDbPath } from './config.js';  
import { selectDatabaseFile } from './select-db.js';  

let db = null;

export async function initDatabase() {
    let dbPath = loadDbPath();

    // If no path is saved, or the file no longer exists, prompt user
    if (!dbPath || !fs.existsSync(dbPath)) {
        dbPath = await selectDatabaseFile();

        if (!dbPath) {
            throw new Error("No database selected");
        }

        saveDbPath(dbPath);
    }

    try {
        db = new Database(dbPath); // synchronous open
        console.log("Connected to SQLite DB:", dbPath);
    } catch (err) {
        console.error("Failed to open database:", err);
        throw err;
    }

    return db;
}

export function getDb() {
    if (!db) throw new Error("Database not initialized");
    return db;
}