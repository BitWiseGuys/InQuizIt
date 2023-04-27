const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("versions", {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    // we can also expose variables, not just functions
});

//dbManager Calls For Front end
contextBridge.exposeInMainWorld("db", {

//DATABASE RETRIEVAL CALLS
 getAllQuestionSets : async () => {
    const res = await ipcRenderer.invoke('getAllQuestionSets');
    console.log(res);
    return res;
  },

  getAllCategories : async () => {
  const res = await ipcRenderer.invoke('getAllCategories');
  console.log(res);
  return res;
  },

   getQuestionSet : async (setCategory, setName, setOptions) => {
    const res = await ipcRenderer.invoke('getQuestionSet', setCategory, setName, setOptions);
    console.log(res);
    return res;
  },

   getAllQuestions : async (setCategory, setName, setOptions) => {
    const res = await ipcRenderer.invoke('getAllQuestions', setCategory, setName, setOptions);
    console.log(res);
    return res;
  },

  getAllAnswers : async (setCategory, setName, setOptions, questionContent, questionType) => {
    const res = await ipcRenderer.invoke('getAllAnswers', setCategory, setName, setOptions, questionContent, questionType);
    console.log(res);
    return res;
  },

  getAllUsers : async () => {
    const res = await ipcRenderer.invoke('getAllUsers');
    console.log(res);
    return res;
  },



  //DATABASE INSERTION MAIN INVOKERS

  newUser: async (FirstName,LastName) => {
    const res = await ipcRenderer.invoke('newUser', FirstName,LastName);
    console.log(res);
    return res;
  },


  //CREATES NEW QUESTIONSET DATA ROW GIVEN Category, NAME, SUBOPTIONS
  //window.db.newQuestionSet(Category,Name,Options);
  newQuestionSet: async (Category, Name, Options) => {
    const res = await ipcRenderer.invoke('newQuestionSet', Category, Name, Options);
    console.log(res);
    return res;
  },
 

  //CREATES NEW QUESTION DATA ROW GIVEN Category, NAME, SUBOPTIONS, QUESTIONTYPE, QUESTIONCONTENT
  //window.db.newQuestion(Category,Name,Options,Type, Question);
  newQuestion: async (Category, Name, Options, Type, Question) => {
    const res = await ipcRenderer.invoke('newQuestion', Category, Name, Options, Type, Question);
    console.log(res);
    return res;
  },

  deleteQuestion: async (Category, Name, Options, Type, Question) => {
    const answers = await ipcRenderer.invoke('getAllAnswers', Category, Name, Options, Question, Type);
    for (let answer in answers) {
        const res = await ipcRenderer.invoke('deleteAnswer', Category, Name, Options, Type, Question, answer);
        console.log(res);
    }
    const res = await ipcRenderer.invoke('deleteQuestion', Category, Name, Options, Type, Question);
    console.log(res);
  },

  //CREATE NEW ANSWER FOR AN ALREADY EXISTING QUESTION
  //window.db.newAnswer(Category,Name,Options,Type,Question,Ans);
  newAnswer: async (Category, Name, Options, Type, Question, Ans) => {
    const res = await ipcRenderer.invoke('newAnswer', Category, Name, Options, Type, Question,Ans);
    console.log(res);
    return res;
  },

  //CREATE NEW ANSWER AND A NEW QUESTION
  //window.db.newQuestionWithAnswer(Category,Name,Options,Type,Question,Ans);
  newQuestionWithAnswer: async (Category, Name, Options, Type, Question, Ans) => {
    const res1 = await ipcRenderer.invoke('newQuestion', Category, Name, Options, Type, Question);
    console.log(res1);
    const res2 = await ipcRenderer.invoke('newAnswer', Category, Name, Options, Type, Question,Ans);
    console.log(res2);
    return res2;
  },


  //DELETION FUNCTIONS

  //DELETE GIVEN QUESTION AND ALL REFERENCES TO THIS
  delQuestion: async (Category, Name, Options, Type, Question) => {
    const res = await ipcRenderer.invoke('delQuestion', Category, Name, Options, Type, Question);
    console.log(res);
    return res;
  },

   //DELETE GIVEN QUESTIONSET AND ALL REFERENCES TO THIS
   delQuestionSet: async (Category, Name, Options) => {
    const res = await ipcRenderer.invoke('delQuestionSet', Category, Name, Options);
    console.log(res);
    return res;
  },

  //DELETE GIVEN QUESTIONSET AND ALL REFERENCES TO THIS
  delUser: async (FirstName,LastName) => {
    const res = await ipcRenderer.invoke('delUser', FirstName,LastName);
    console.log(res);
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

