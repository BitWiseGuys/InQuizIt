const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("versions", {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    // we can also expose variables, not just functions
});

//dbManager Calls For Front end
contextBridge.exposeInMainWorld("db", {

  mergeDB : async (dbPath) => {
     const res = await ipcRenderer.invoke('mergeDB',dbPath);
     return res;
   },

  replaceDB : async (dbPath) => {
      const res = await ipcRenderer.invoke('replaceDB',dbPath);
      return res;
    },
  
    databaseAction : async (bReplace) => {
      const res = await ipcRenderer.invoke('databaseAction',bReplace);
      return res;
    },
  
   //DATABASE RETRIEVAL CALLS

 getAllQuestionSets : async () => {
    const res = await ipcRenderer.invoke('getAllQuestionSets');
    return res;
  },

  getAllCategories : async () => {
  const res = await ipcRenderer.invoke('getAllCategories');
  return res;
  },

   getQuestionSet : async (setCategory, setName, setOptions) => {
    const res = await ipcRenderer.invoke('getQuestionSet', setCategory, setName, setOptions);
    return res;
  },

   getAllQuestions : async (setCategory, setName, setOptions) => {
    const res = await ipcRenderer.invoke('getAllQuestions', setCategory, setName, setOptions);
    return res;
  },

  getAllAnswers : async (setCategory, setName, setOptions, questionContent, questionType) => {
    const res = await ipcRenderer.invoke('getAllAnswers', setCategory, setName, setOptions, questionContent, questionType);
    return res;
  },

  getAllUsers : async () => {
    const res = await ipcRenderer.invoke('getAllUsers');
    return res;
  },



  //DATABASE INSERTION MAIN INVOKERS

  newUser: async (FirstName,LastName) => {
    const res = await ipcRenderer.invoke('newUser', FirstName,LastName);
    return res;
  },


  //CREATES NEW QUESTIONSET DATA ROW GIVEN Category, NAME, SUBOPTIONS
  //window.db.newQuestionSet(Category,Name,Options);
  newQuestionSet: async (Category, Name, Options) => {
    const res = await ipcRenderer.invoke('newQuestionSet', Category, Name, Options);
    return res;
  },
 

  //CREATES NEW QUESTION DATA ROW GIVEN Category, NAME, SUBOPTIONS, QUESTIONTYPE, QUESTIONCONTENT
  //window.db.newQuestion(Category,Name,Options,Type, Question);
  newQuestion: async (Category, Name, Options, Type, Question) => {
    const res = await ipcRenderer.invoke('newQuestion', Category, Name, Options, Type, Question);
    return res;
  },

  deleteQuestion: async (Category, Name, Options, Type, Question) => {
    const answers = await ipcRenderer.invoke('getAllAnswers', Category, Name, Options, Question, Type);
    for (let answer in answers) {
        const res = await ipcRenderer.invoke('deleteAnswer', Category, Name, Options, Type, Question, answer);
        console.log(res);
    }
    const res = await ipcRenderer.invoke('deleteQuestion', Category, Name, Options, Type, Question);
  },

  //CREATE NEW ANSWER FOR AN ALREADY EXISTING QUESTION
  //window.db.newAnswer(Category,Name,Options,Type,Question,Ans);
  newAnswer: async (Category, Name, Options, Type, Question, Ans) => {
    const res = await ipcRenderer.invoke('newAnswer', Category, Name, Options, Type, Question,Ans);
    return res;
  },

  //CREATE NEW ANSWER AND A NEW QUESTION
  //window.db.newQuestionWithAnswer(Category,Name,Options,Type,Question,Ans);
  newQuestionWithAnswer: async (Category, Name, Options, Type, Question, Ans) => {
    const res1 = await ipcRenderer.invoke('newQuestion', Category, Name, Options, Type, Question);
    const res2 = await ipcRenderer.invoke('newAnswer', Category, Name, Options, Type, Question,Ans);
    return res2;
  },


  //DELETION FUNCTIONS

  //DELETE GIVEN QUESTION AND ALL REFERENCES TO THIS
  delQuestion: async (Category, Name, Options, Type, Question) => {
    const res = await ipcRenderer.invoke('delQuestion', Category, Name, Options, Type, Question);
    return res;
  },

   //DELETE GIVEN QUESTIONSET AND ALL REFERENCES TO THIS
   delQuestionSet: async (Category, Name, Options) => {
    const res = await ipcRenderer.invoke('delQuestionSet', Category, Name, Options);
    return res;
  },

  //DELETE GIVEN QUESTIONSET AND ALL REFERENCES TO THIS
  delUser: async (FirstName,LastName) => {
    const res = await ipcRenderer.invoke('delUser', FirstName,LastName);
    return res;
  },

  /*******************************************************
   * Score Database Functions
   *******************************************************/
  
  //return a promise to all scores of inputted user
  getAllScores: async (FirstName,LastName) => {
    const res = await ipcRenderer.invoke('getAllScores', FirstName,LastName);
    return res;
  },
  
  //return a promise to update or add a score value for the user and problem set inputted
  updateScore: async (firstName,lastName, setCategory, setName, setOptions, scoreVal) => {
    const res = await ipcRenderer.invoke('updateScore', firstName,lastName, setCategory, setName, setOptions, scoreVal);
    return res;
  },







  /*******************************************************
   * Score Validation Funcitons
   *******************************************************/
  encryptScore: (scoreString) => {
    return ipcRenderer.invoke('encryptScore',scoreString);  
  },

  decryptScore: (str1,str2,str3) => {
    return ipcRenderer.invoke('decryptScore',str1,str2,str3);
  }

});

