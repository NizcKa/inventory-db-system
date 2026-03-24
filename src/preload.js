// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts


import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  getAllItems: () => ipcRenderer.invoke('get-all-items'),
  updateItem: (item) => ipcRenderer.invoke("update-item", item),
  addItem: (item) => ipcRenderer.invoke('add-item', item),
  generateNextItemId: (type) => ipcRenderer.invoke('generate-next-item-id', type),
  deleteItem: (indexID) => ipcRenderer.invoke('delete-item', indexID)
});