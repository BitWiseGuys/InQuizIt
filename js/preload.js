const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("versions", {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    // we can also expose variables, not just functions
});

var loadedProblemSets = [
    {
        title: "Syllogistic",
        sets: {
            Translations: [],
            Arguments: [],
        },
    },
    {
        title: "Propositional",
        sets: {
            Translations: {},
            "Truth Tables": {},
            Arguments: {},
            Inference: {},
            Proofs: {},
        },
    },
    {
        title: "Quantificational",
        sets: {
            Translations: {},
            Proofs: {},
        },
    },
    {
        title: "Modal",
        sets: {
            Translations: {},
            Proofs: {},
        },
    },
    {
        title: "Deontic",
        sets: {
            Translations: {},
            Proofs: {},
        },
    },
    {
        title: "Belief",
        sets: {
            Translations: {},
            Proofs: {},
        },
    },
    {
        title: "Informal",
        sets: {
            Probability: {},
            Definitions: {},
            Fallacies: {},
        },
    },
];

var packages = ["LogiCola"];

contextBridge.exposeInMainWorld("ProblemSets", {
    packages: () => packages,
    categories: () => loadedProblemSets,
    load: (package) => {
        // Check if we even have this package right now.
        if (!packages.includes(package)) return false;
        // TODO: Call main file (using ipcRenderer) to do the actual loading up.

        // Success!
        return true;
    },
    unload: () => {
        loadedProblemSets = [];
    },
    reloadPackages: () => {},
});



//dbManager Calls For Front end
contextBridge.exposeInMainWorld("db", {

//Data Retrieval Calls
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





  //DATABASE INSERTION MAIN INVOKERS

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
  }

 
});

