// Saves and loads the selected file path for future use
import fs from 'node:fs';
import path from 'node:path';
import { app } from 'electron';

const configPath = path.join(app.getPath("userData"), "config.json");

export function saveDbPath(dbPath) { 
    fs.writeFileSync(
        configPath,
        JSON.stringify({ dbPath }, null, 2)
    );
}

export function loadDbPath() { 
    try {
        if (!fs.existsSync(configPath)) return null;

        const raw = fs.readFileSync(configPath, 'utf-8');
        const config = JSON.parse(raw);

        return typeof config.dbPath === 'string' ? config.dbPath : null;
    } catch (err) {
        console.error("Failed to load config:", err);
        return null;
    }
}
