import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { getApartaments, getTenants } from '../backend/controller';

// Custom APIs for renderer
const api = {
  sendLogin: (data)=>{
    return ipcRenderer.invoke('sendLogin',data);
  },
  createApartment:(data)=>{
    return ipcRenderer.invoke('createApartment',data);
  },
  getApartments: ()=>{
    return ipcRenderer.invoke('getApartments')
  },
  closeWindow:()=>{
    return ipcRenderer.invoke('closeWindow');
  },
  minimizeWindow:()=>{
    return ipcRenderer.invoke('minimizeWindow');
  },
  changeSizeWindow:()=>{
    return ipcRenderer.invoke('changeSizeWindow')
  },
  deleteApartment:(IDApartment)=>{
    return ipcRenderer.invoke('deleteApartment',IDApartment);
  },
  createTenant:(data)=>{
    return ipcRenderer.invoke('createTenant',data);
  },
  getTenants:()=>{
    return ipcRenderer.invoke('getTenants')
  },
  deleteTenant:(data)=>{
    return ipcRenderer.invoke('deleteTenant',data);
  },
  getTenant:(ID)=>{
    return ipcRenderer.invoke('getTenant',ID);
  },
  updateTenant:(data)=>{
    return ipcRenderer.invoke('updateTenant',data);
  }
}




// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
