const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

var knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./databases/InQuizIt.db"
  }
});

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

//database API Handlers

//EXAMPLE SQL ASYNC HANDLER
ipcMain.handle('readTable', async (event, tableName)=> {
  const res = await knex.select("*").from(tableName);
  return res;
});

ipcMain.handle('getQuestionSets', async (event) => {
  const res = await knex.select("*").from("QuestionSets_T");
  return res;
})

ipcMain.handle('getQuestionSet', async (event, setName, setOptions, setCategory) => {
  const res = await knex.select("*").from("QuestionSets_T").where({SetName     : setName, 
                                                                   SetOptions  : setOptions, 
                                                                   SetCategory : setCategory});
  return res;
});

ipcMain.handle('getQuestionsFromSet', async (event, setName, setOptions, setCategory) => {
  const res = await knex.select("*").from("Questions_T").where({SetName     : setName, 
                                                                SetOptions  : setOptions, 
                                                                SetCategory : setCategory});
  return res;
});

ipcMain.handle('getAnswersToQuestion', async (event, setName, setOptions, setCategory, questionContent, questionType) => {
  const res = await knex.select("*").from("Answers_T").where({SetName         : setName, 
                                                              SetOptions      : setOptions,
                                                              SetCategory     : setCategory,
                                                              QuestionType    : questionType,
                                                              QuestionContent : questionContent});
  return res;
});