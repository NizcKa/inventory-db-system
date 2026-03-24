// prompts the user to select a file path to use if no other exists yet
import { dialog } from 'electron';

export async function selectDatabaseFile() {
    const result = await dialog.showOpenDialog({
        title: "Select Inventory Database",
        filters: [
            { name: "SQLite Database", extensions: [ "db" ] }
        ],
        properties: [ "openFile" ],
    });

    if (result.canceled) return null;
    return result.filePaths[0];
}
