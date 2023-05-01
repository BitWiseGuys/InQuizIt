const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

//backend js files
const dbMngr = require('./dbManager');
const scoreVal = require('./scoreValidation');


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



/********************************************************
 * 
 * ELECTRON MAIN HANDLERS FOR KNEX DB CALL
 * 
 *******************************************************/

//merge inputted database path to main database
ipcMain.handle('mergeDB', async (event, dbPath)=> {
  const res = await dbMngr.mergeDatabases(dbPath);
  return res;
});

ipcMain.handle('replaceDB', async (event, dbPath)=> {
  const res = await dbMngr.replaceDatabase(dbPath);
  return res;
});

//Question Data Insertion
ipcMain.handle('newQuestionSet', async (event, Category, Name, Options)=> {
  const res = await dbMngr.newQuestionSet(Category, Name, Options);
  return res;
});

ipcMain.handle('newQuestion', async (event, Category, Name, Options, Type, Question)=> {
  const res = await dbMngr.newQuestion(Category, Name, Options, Type, Question);
  return res;
});

ipcMain.handle('newAnswer', async (event, Category, Name, Options, Type, Question,Ans)=> {
  const res = await dbMngr.newAnswer(Category, Name, Options, Type, Question,Ans);
  return res;
});


//user insertion
ipcMain.handle('newUser', async (event, FirstName, LastName)=> {
  const res = await dbMngr.newUser(FirstName, LastName);
  return res;
});



//user retrieval
ipcMain.handle('getAllUsers', async (event) => {
  const res = await dbMngr.getAllUsers();
  return res;
});


//Question data retrieval
ipcMain.handle('getAllQuestionSets', async (event) => {
  const res = await dbMngr.getAllQuestionSets();
  return res;
});

ipcMain.handle('getAllCategories', async (event) => {
  const res = await dbMngr.getAllCategories();
  return res;
});

ipcMain.handle('getQuestionSet', async (event,setCategory, setName, setOptions) => {
  const res = await dbMngr.getQuestionSet(setCategory, setName, setOptions);
  return res;
});

ipcMain.handle('getAllQuestions', async (event, setCategory, setName, setOptions) => {
  const res = await dbMngr.getAllQuestions(setCategory, setName, setOptions);
  return res;
});

ipcMain.handle('getAllAnswers', async (event,  setCategory, setName, setOptions, questionContent, questionType) => {
  const res = await dbMngr.getAllAnswers(setCategory, setName, setOptions, questionContent, questionType);
  return res;
});


//Deletion
ipcMain.handle('delQuestion', async (event,  setCategory, setName, setOptions, questionContent, questionType) => {
  const res = await dbMngr.deleteQuestion(setCategory, setName, setOptions, questionContent, questionType);
  return res;
});

ipcMain.handle('delQuestionSet', async (event,  setCategory, setName, setOptions) => {
  const res = await dbMngr.deleteQuestionSet(setCategory, setName, setOptions);
  return res;
});

ipcMain.handle('delUser', async (event,  firstName, lastName) => {
  const res = await dbMngr.deleteUser(firstName, lastName);
  return res;
});


/*******************************************************
   * Score Database Functions
   *******************************************************/
  
  ipcMain.handle('getAllScores', async (event,firstName,lastName) => {
    const res = await dbMngr.getAllScores(firstName,lastName);
    return res;
  });
  
  ipcMain.handle('updateScore', async (event,firstName,lastName, setCategory, setName, setOptions, scoreVal) => {
    const res = await dbMngr.updateScore(firstName,lastName, setCategory, setName, setOptions, scoreVal);
    return res;
  });



/*******************************************************
 * Score Validation Funcitons
 *******************************************************/

ipcMain.handle('encryptScore', (event,scoreString) => {
  return scoreVal.encryptScore(scoreString);
});

ipcMain.handle('decryptScore', (event,str1,str2,str3) => {
  return scoreVal.decryptScore(str1,str2,str3);
});