import { app, BrowserWindow } from "electron";

app.disableHardwareAcceleration();

const createWindow = () => {
  const win = new BrowserWindow({
    width: 322,
    height: 534
  });

  win.setMenuBarVisibility(false);

  win.loadFile("./index.html");
};

app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});