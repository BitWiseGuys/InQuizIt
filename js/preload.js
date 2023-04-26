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
    //DATABASE RETRIEVAL CALLS
    /**
     * Gets all of the question sets from the database.
     * @returns {object[]}
     */
    getAllQuestionSets: async () => {
        const res = await ipcRenderer.invoke("getAllQuestionSets");
        console.log(res);
        return res;
    },

    /**
     * Gets all the question sets from the database again?
     * @returns {object[]}
     */
    getAllCategories: async () => {
        const res = await ipcRenderer.invoke("getAllCategories");
        console.log(res);
        return res;
    },

    /**
     * Gets the requested question set from the database.
     * @param {string} setCategory - The category's name
     * @param {string} setName - The subcategory's name
     * @param {string} setOptions - The subcategory's options
     * @returns {object}
     */
    getQuestionSet: async (setCategory, setName, setOptions) => {
        const res = await ipcRenderer.invoke(
            "getQuestionSet",
            setCategory,
            setName,
            setOptions
        );
        console.log(res);
        return res;
    },

    /**
     * Gets all of the question of the given question set from the database.
     * @param {string} setCategory - The category's name
     * @param {string} setName - The subcategory's name
     * @param {string} setOptions - The subcategory's options
     * @returns {object[]}
     */
    getAllQuestions: async (setCategory, setName, setOptions) => {
        const res = await ipcRenderer.invoke(
            "getAllQuestions",
            setCategory,
            setName,
            setOptions
        );
        console.log(res);
        return res;
    },

    /**
     * Gets all of the answers of the provided question from the database.
     * @param {string} setCategory - The category's name
     * @param {string} setName - The subcategory's name
     * @param {string} setOptions - The subcategory's options
     * @param {string} questionContent - The question's content (the actual question)
     * @param {string} questionType - The question's type
     * @returns {object[]}
     */
    getAllAnswers: async (
        setCategory,
        setName,
        setOptions,
        questionContent,
        questionType
    ) => {
        const res = await ipcRenderer.invoke(
            "getAllAnswers",
            setCategory,
            setName,
            setOptions,
            questionContent,
            questionType
        );
        console.log(res);
        return res;
    },

    /**
     * Gets all of the users from the database.
     * @returns {object[]}
     */
    getAllUsers: async () => {
        const res = await ipcRenderer.invoke("getAllUsers");
        console.log(res);
        return res;
    },

    //DATABASE INSERTION MAIN INVOKERS
    /**
     * Adds a new user to the database.
     * @param {string} FirstName - The user's first name
     * @param {string} LastName - The user's last name
     * @returns {Promise<string>}
     */
    newUser: async (FirstName, LastName) => {
        const res = await ipcRenderer.invoke("newUser", FirstName, LastName);
        console.log(res);
        return res;
    },

    /**
     * Creates a new QuestionSet.
     * @param {string} Category - The category's name
     * @param {string} Name - The subcategory's name
     * @param {string} Options - The subcategory's options
     * @param {number} TentativeScore - Optional subcategory score
     * @param {string} Package - Optional package name
     * @returns {Promise<string>}
     */
    newQuestionSet: async (Category, Name, Options) => {
        const res = await ipcRenderer.invoke(
            "newQuestionSet",
            Category,
            Name,
            Options
        );
        console.log(res);
        return res;
    },

    /**
     * Add a new question to an existing questionset.
     * @param {string} Category - The category's name
     * @param {string} Name - The subcategory's name
     * @param {string} Options - The subcategory's options
     * @param {string} Type - The question's type
     * @param {string} Question - The question's content
     * @param {string} Package - Optional package name
     * @returns {Promise<string>}
     */
    newQuestion: async (Category, Name, Options, Type, Question) => {
        const res = await ipcRenderer.invoke(
            "newQuestion",
            Category,
            Name,
            Options,
            Type,
            Question
        );
        console.log(res);
        return res;
    },

    /**
     * Deletes the given question from the database.
     * @param {string} setCategory - The category's name
     * @param {string} setName - The subcategory's name
     * @param {string} setOptions - The subcategory's options
     * @param {string} questionContent - The question's content (the actual question)
     * @param {string} questionType - The question's type
     * @returns {Promise<number>} The number of affected rows
     */
    deleteQuestion: async (Category, Name, Options, Type, Question) => {
        const answers = await ipcRenderer.invoke(
            "getAllAnswers",
            Category,
            Name,
            Options,
            Question,
            Type
        );
        for (let answer in answers) {
            const res = await ipcRenderer.invoke(
                "deleteAnswer",
                Category,
                Name,
                Options,
                Type,
                Question,
                answer
            );
            console.log(res);
        }
        const res = await ipcRenderer.invoke(
            "deleteQuestion",
            Category,
            Name,
            Options,
            Type,
            Question
        );
        console.log(res);
    },

    /**
     * Adds a new answer to a specific questionID question.
     * @param {string} Category - The category's name
     * @param {string} Name - The subcategory's name
     * @param {string} Options - The subcategory's options
     * @param {string} Type - The question's type
     * @param {string} Question - The question's content
     * @param {string} Ans - The answer's content
     * @param {string} Package - Optional package name
     * @returns {Promise<string>}
     */
    newAnswer: async (Category, Name, Options, Type, Question, Ans) => {
        const res = await ipcRenderer.invoke(
            "newAnswer",
            Category,
            Name,
            Options,
            Type,
            Question,
            Ans
        );
        console.log(res);
        return res;
    },

    /**
     * Adds a new question and answer to the database.
     * @param {string} Category - The category's name
     * @param {string} Name - The subcategory's name
     * @param {string} Options - The subcategory's options
     * @param {string} Type - The question's type
     * @param {string} Question - The question's content (the actual question)
     * @param {string} Ans - The question's answer
     * @returns {Promise<string>}
     */
    newQuestionWithAnswer: async (
        Category,
        Name,
        Options,
        Type,
        Question,
        Ans
    ) => {
        const res1 = await ipcRenderer.invoke(
            "newQuestion",
            Category,
            Name,
            Options,
            Type,
            Question
        );
        console.log(res1);
        const res2 = await ipcRenderer.invoke(
            "newAnswer",
            Category,
            Name,
            Options,
            Type,
            Question,
            Ans
        );
        console.log(res2);
        return res2;
    },

    //DELETION FUNCTIONS

    /**
     * Deletes the given question from the database.
     * @param {string} Category - The category's name
     * @param {string} Name - The subcategory's name
     * @param {string} Options - The subcategory's options
     * @param {string} Type - The question's type
     * @param {string} Question - The question's content (the actual question)
     * @returns {Promise<number>} The number of affected rows
     */
    delQuestion: async (Category, Name, Options, Type, Question) => {
        const res = await ipcRenderer.invoke(
            "delQuestion",
            Category,
            Name,
            Options,
            Type,
            Question
        );
        console.log(res);
        return res;
    },

    /**
     * Deletes the given question set from the database.
     * @param {string} setCategory - The category's name
     * @param {string} setName - The subcategory's name
     * @param {string} setOptions - The subcategory's options
     * @returns {Promise<number>} The number of affected rows
     */
    delQuestionSet: async (Category, Name, Options) => {
        const res = await ipcRenderer.invoke(
            "delQuestionSet",
            Category,
            Name,
            Options
        );
        console.log(res);
        return res;
    },

    /**
     * Deletes the given user from the database
     * @param {string} firstName - The user's first name
     * @param {string} lastName - The user's last name
     * @returns {Promise<number>} The number of affected rows
     */
    delUser: async (FirstName, LastName) => {
        const res = await ipcRenderer.invoke("delUser", FirstName, LastName);
        console.log(res);
        return res;
    },
});
