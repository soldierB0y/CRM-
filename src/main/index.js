import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'

import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { DB } from '../backend/db.js'
import { checkLogin,createApartment, getApartments,deleteApartment,createTenant,getTenants, deleteTenant, getTenant, updateTenant, modifyApartment, findTenant} from '../backend/controller.js'


var mainWindow;

try {
  (
    async()=>{
      await DB.authenticate()
      console.log('conexion establecida')
  }
  )()
  
} catch (error) {
  console.log('fallo en la conexion con la base  datos',error)
}




function createWindow() {
  // Create the browser window.
   mainWindow = new BrowserWindow({
    width: 1080,
    height: 750,
    minWidth:1080,
    minHeight:750,
    show: false,
    fullscreen:false,
    autoHideMenuBar: true,
    frame:false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false
    }
  })


  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // HANDLES

//Login
  ipcMain.handle('sendLogin',async(e,data)=>{
          const check= await checkLogin(data)

      if(check.result==1) 
      {
        console.log('Login successful:', data);
        return true;
      }
      else if (check.result==0)
      {
        console.log('Login failed:', data);
        return false;
      }

    })

  //Apartment
  ipcMain.handle('getApartments',async(e)=>{
      const check= await getApartments();
      console.log(check);
      if(check.result <=0)
      {
        console.log('get Apartments failed');
        return {result:false,error:check.error}
      }
      else
      {
        console.log('get Apartments success')
        return {result:true,object:check.object}
      }
  })


    ipcMain.handle('createApartment',async (e,data)=>{
      const check= await createApartment(data);
      console.log('main result',check.result)
      if(check.result==1) 
      {
        console.log('created successfully:', data);
        return true;
      }
      else if (check.result==0)
      {
        console.log('created failed:', data);
        return false;
      }
    })

    ipcMain.handle('deleteApartment',async (e,IDApartment)=>{
        const check= await deleteApartment(IDApartment);
        if(check==true)
        {
          return true
        }
        else
        {
          return false
        }
    })

    ipcMain.handle('modifyApartment',async(e,data)=>{
      console.log(data);
      const check= await modifyApartment(data);
      if (check==true)
          return true
      else
        return false
    })

    //Tenant

    ipcMain.handle('findTenant',async (e,name)=>{
        const result= await findTenant(name)
        return result;
    })
      ipcMain.handle('getTenants',async(e)=>{
      const check= await getTenants();
      console.log(check);
      if(check.result <=0)
      {
        console.log('get tenants failed');
        return {result:false,error:check.error}
      }
      else
      {
        console.log('get tenants success')
        return {result:true,object:check.object}
      }
  })

    ipcMain.handle('createTenant',async(e,data)=>{
      const check= await createTenant(data);
      if(check.result==1)
      {
        console.log('created successfully:', data);
        return true;
      }
      else
      {
        console.log('created failed:', data);
        return false;
      }
    })
    ipcMain.handle('deleteTenant',async(e,ID)=>{
      const check= await deleteTenant(ID);
      if (check==true)
        return true
      else
        return false
    })
    ipcMain.handle('getTenant',async(e,ID)=>{
      const check= await getTenant();
      return check;
    })

    ipcMain.handle('updateTenant',async(e,data)=>{
      const check=await updateTenant(data);
      return check;
    })



    //screen
    ipcMain.handle('closeWindow',(e)=>{
      mainWindow.close();
    })
    
    ipcMain.handle('minimizeWindow',(e)=>{
      mainWindow.minimize();
    }
    )
    ipcMain.handle('changeSizeWindow',()=>{
      if(mainWindow.isMaximized())
      {
        console.log('max')
        mainWindow.unmaximize()
      }
      else
      {
        console.log('min')
        mainWindow.maximize()
      }
    })
    
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
