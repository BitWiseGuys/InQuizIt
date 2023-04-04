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

/***********************************************
Database insertion functions

-functions needed for question insertion into database
************************************************/

//knex insert given row objct and table name
async function insertToTable(row,table) {
  try {
    res = await knex(table).insert(row);
    console.log(`Successfully inserted row into ${table} table!`);
    return res;

  } catch (err) {
    console.error(`Error inserting row into ${table} table: ${err}`);
  }
}


async function getQuestionID()









//Create a new QuestionSet
async function newQuestionSet(Catagory, Name, Options, TentativeScore = 100,Package = 'Logicola') {
  const row = {PackageName: Package, SetCatagory: Catagory, SetName: Name, SetOptions: Options, CompletionScore: TentativeScore};
  const table = "QuestionSets_T";
  
  res = await insertToTable(row,table);
  return res;
};

//Add a new question to an existing questionset
async function newQuestion(Catagory, Name, Options, Type, Question, Package = 'Logicola') {
  const row = {PackageName: Package, SetCatagory: Catagory, SetName: Name, SetOptions: Options, QuestionType: Type, QuestionContent: Question};
  const table = "Questions_T";
  
  res = await insertToTable(row,table);
  return res;
};

//Adds a new answer to a specific questionID question
async function newAnswer(ID, Ans) {
  const row = {QuestionID: ID, Answer: Ans};
  const table = "Answers_T";
  
  res = await insertToTable(row,table);
  return res;
};





//ELECTRON MAIN HANDLERS FOR DATA INSERTIONS
ipcMain.handle('newQuestionSet', async (event, Catagory, Name, Options)=> {
  const res = await newQuestionSet(Catagory, Name, Options);
  return res;
});

ipcMain.handle('newQuestion', async (event, Catagory, Name, Options, Type, Question)=> {
  const res = await newQuestion(Catagory, Name, Options, Type, Question);
  return res;
});

