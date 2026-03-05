// Saves and loads the selected file path for future use
import fs from 'fs';
import path from 'path';
import { app } from 'electron';

const configPath = path.join(app.getPath("userData"), "config.json");

export function saveDbPath(dbPath) { 
    fs.writeFileSync(
        configPath,
        JSON.stringify({ dbPath }, null, 2)
    );
}

export function loadDbPath() { 
    if (!fs.existsSync(configPath)) return null;
    const config = JSON.parse(fs.readFileSync(configPath));
    return config.dbPath || null;
}
