import { contextBridge, ipcMain, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { getPayments, updateBillState } from '../backend/controller';

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
  modifyApartment:(data)=>{
    return ipcRenderer.invoke('modifyApartment',data)
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
  },
  findTenant:(name)=>{
    return ipcRenderer.invoke('findTenant',name)
  },
  createBills:()=>{
    return ipcRenderer.invoke('createBills')
  },
  getBills:()=>{
    return ipcRenderer.invoke('getBills')
  },
  deleteMonthlyBill:(IDMonthlyBill)=>{
    return ipcRenderer.invoke('deleteMonthlyBills',IDMonthlyBill)
  },
  payBill:(IDFactura,dineroPagado,payerName)=>{
    const data= {IDFactura:IDFactura,dineroPagado:dineroPagado,payerName}
    return ipcRenderer.invoke('payBill',data)
  },
  getPayments:()=>{
    return ipcRenderer.invoke('getPayments');
  },
  updateBillState:()=>{
    return ipcRenderer.invoke('updateBillState');
  }
}


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
