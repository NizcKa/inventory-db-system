// Loads the database into the app
import sqlite3 from 'sqlite3';
import { app } from 'electron';
import path from 'path';

import { saveDbPath, loadDbPath } from './config.js';  
import { selectDatabaseFile } from './select-db.js';  

let db = null; // initialized to hold the database

export async function initDatabase() {
    let dbPath = loadDbPath();

    if (!dbPath) { // prompt to select db file path if there's none yet
        dbPath = await selectDatabaseFile();

        if (!dbPath) {
            throw new Error("No database selected");
        }

        saveDbPath(dbPath);
    }

    db = new sqlite3.Database(dbPath, (err) => { // loads the database saved filepath to db
        if (err) {
            console.error("Failed to open database:", err);
        } else {
            console.log("Connected to SQLite DB:", dbPath);
        }
    });

    return db;
}

export function getDb() { //helper to get db
    if (!db) {
        throw new Error("Database not initialized");
    }
    return db;
}
