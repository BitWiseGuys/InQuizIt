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


//database API functions
contextBridge.exposeInMainWorld('db', {

  //EXAMPLE RENDERER FUNCTION FOR FRONT END CALL
  selectAllTable: async (tableName) => {
    const res = await ipcRenderer.invoke('readTable', tableName);
    console.log(res);
    return res;
  },


  //DATABASE INSERTION MAIN INVOKERS

  //CREATES NEW QUESTIONSET DATA ROW GIVEN CATAGORY, NAME, SUBOPTIONS
  //window.db.newQuestionSet(Catagory,Name,Options);
  newQuestionSet: async (Catagory, Name, Options) => {
    const res = await ipcRenderer.invoke('newQuestionSet', Catagory, Name, Options);
    console.log(res);
    return res;
  },

  //CREATES NEW QUESTION DATA ROW GIVEN CATAGORY, NAME, SUBOPTIONS, QUESTIONTYPE, QUESTIONCONTENT
  //window.db.newQuestion(Catagory,Name,Options,Type, Question);
  newQuestion: async (Catagory, Name, Options, Type, Question) => {
    const res = await ipcRenderer.invoke('newQuestion', Catagory, Name, Options, Type, Question);
    console.log(res);
    return res;
  }


});
