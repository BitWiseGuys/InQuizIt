const { contextBridge } = require("electron");

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
            Translations: [
                {
                    metadata: {
                        number: [
                            "range(1-15)",
                            "range(5-10)",
                        ],
                        fruit: [
                            "apples",
                            "oranges",
                            "pears",
                        ]
                    },
                    body: [
                        "If {person:0(first-name)} has {number:0} {fruit} and {person:1(first-name)} has {number:1} {fruit}.",
                        "How many {fruit} does {person:0(first-name)} and {person:1(first-name)} have combined? <input></input>"
                    ],
                    answer: [
                        "{number:1} + {number:2}"
                    ]
                }
            ],
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
