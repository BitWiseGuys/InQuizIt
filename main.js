const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const dbInsert = require('./dbInserter');


const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
        preload: path.join(__dirname, '/js/preload.js'),
    },
  });

  // We cannot require the screen module until the app is ready.
  const { screen } = require('electron')

  // Create a window that fills the screen's available work area.
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  win.setMinimumSize(width / 2, height / 2);
  win.loadFile('html/index.html');
};

app.whenReady().then(() => {
    ipcMain.handle("openPackagesDir", async () => {
        return dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
            properties: ["openFile", "multiSelections"],
            filters: [
                { name: "Packages", extensions: ["db"], }
            ],
        });
    });

    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }

});


//ELECTRON MAIN HANDLERS FOR DATA INSERTIONS
ipcMain.handle('newQuestionSet', async (event, Catagory, Name, Options)=> {
  const res = await dbInsert.newQuestionSet(Catagory, Name, Options);
  return res;
});

ipcMain.handle('newQuestion', async (event, Catagory, Name, Options, Type, Question)=> {
  const res = await dbInsert.newQuestion(Catagory, Name, Options, Type, Question);
  return res;
});

ipcMain.handle('newAnswer', async (event, Catagory, Name, Options, Type, Question,Ans)=> {
  const res = await dbInsert.newAnswer(Catagory, Name, Options, Type, Question,Ans);
  return res;
});

