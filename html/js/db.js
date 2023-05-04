// Source: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

var context = { root: undefined, package: "", category: "", set: "", options: [], questions: [], questionQueue: [], };

/**
 * When called will reload the underlying databases and will notify the Vue frontend of the change.
 */
window.reloadDatabases = ()=> {
    var promise = window.db.getAllQuestionSets();
    promise.then((res)=>{
        var dbs = {};
        for(var i in res) {
            var pkg = res[i];
            let name = pkg.PackageName;
            let cat = pkg.SetCategory;
            let set = pkg.SetName;
            if(name in dbs) {
                let cats = dbs[name];
                if(cat in cats) {
                    let sets = cats[cat];
                    if(set in sets)
                        sets[set].push(pkg.SetOptions.split(","));
                    else sets[set] = [ pkg.SetOptions.split(",") ];
                }
                else {
                    cats[cat] = {};
                    cats[cat][set] = [ pkg.SetOptions.split(",") ];
                }
            }
            else {
                dbs[name] = {};
                dbs[name][cat] = {};
                dbs[name][cat][set] = [ pkg.SetOptions.split(",") ];
            }
        }
        window.databases = dbs;
        if(context.root != undefined) context.root.databases = dbs;
        context.package = "";
        context.category = "";
        context.set = "";
        context.options = [];
        context.questions = [];
        context.questionQueue = [];
    });
};

/**
 * Sets the underlying package that we are going to use.
 * @param {String} package The name of the package we are going to use.
 * @returns True if we have changed to this package, otherwise false.
 */
window.loadDatabase = (package) => {
    if(!(package in window.databases)) return false;
    context.package = package;
    context.category = "";
    context.set = "";
    context.options = [];
    context.questions = [];
    context.questionQueue = [];
    return true;
}

/**
 * Sets the underlying category that we are going to use.
 * @param {String} category The name of the category we are going to use.
 * @returns True if we have changed to this category, otherwise false.
 */
window.loadCategory = (category) => {
    if(!(context.package in window.databases)) return false;
    if(!(category in window.databases[context.package])) return false;
    context.category = category;
    context.set = "";
    context.options = [];
    context.questions = [];
    context.questionQueue = [];
    return true;
}

/**
 * Sets the underlying set name that we are going to use.
 * @param {String} set The name of the set we are going to use.
 * @returns True if we have changed to this set, otherwise false.
 */
window.loadSet = (set) => {
    if(!(context.package in window.databases)) return false;
    if(!(context.category in window.databases[context.package])) return false;
    if(!(set in window.databases[context.package][context.category])) return false;
    context.set = set;
    context.options = [];
    context.questions = [];
    context.questionQueue = [];
    return true;
}

/**
 * Adds the option to the underlying options that we are going to use.
 * @param {String} option The name of the option we are going to add.
 * @returns True if we have added this option, otherwise false.
 */
window.addOption = (option) => {
    if(!(context.package in window.databases)) return false;
    if(!(context.category in window.databases[context.package])) return false;
    if(!(context.set in window.databases[context.package][context.category])) return false;
    if(window.databases[context.package][context.category][context.set].indexOf(option) == -1) return false;
    context.options.push(option);
    return true;
}

/**
 * Sets the underlying options that we are going to use.
 * @param {String} options The name of the options we are going to use.
 * @returns True if we have changed to this options, otherwise false.
 */
window.setOption = (options) => {
    if(!(context.package in window.databases)) return false;
    if(!(context.category in window.databases[context.package])) return false;
    if(!(context.set in window.databases[context.package][context.category])) return false;
    let opts_group = window.databases[context.package][context.category][context.set];
    var found = false;
    for(var i in opts_group) {
        let opts = opts_group[i];
        for(var j in options) {
            let option = options[j];
            if(option[j] != opts[j]) { found = false; break; }
        }
        if(options.length != opts.length) continue;
        if(found) break;
    }
    context.options = options;
    window.db.getQuestionSet(context.category, context.set, context.options.join(",")).then((res)=>{
        res = res[0];
        if(app) {
            app.$refs.questions.max_score = res.CompletionScore;
            app.QDescription = res.setDescription;
        }
    });
    return true;
}

/**
 * A quick three in one call to load in the package, category and set that we are going to use.
 * @param {String} package The name of the package we are going to use.
 * @param {String} category The name of the category we are going to use.
 * @param {String} set The name of the set we are going to use.
 * @returns True if we have changed to this combination, otherwise false.
 */
window.loadQuestionSet = (package, category, set) => {
    return (window.loadDatabase(package) && window.loadCategory(category) && window.loadSet(set));
};

/**
 * Loads in all of the questions that are apart of the loaded combination of package, category, set and options.
 * @returns {Promise<Array>} A promise that when resolved will pass an array or all options within the loaded package, category, set and options combo.
 */
window.loadQuestions = async() => {
    return new Promise((resolve, reject) => {
        // Check if we have loaded a valid question set.
        if(context.package.length && context.category.length && context.set.length && context.options.length) {
            window.db.getAllQuestions(context.category, context.set, context.options.join(","))
            .then((res)=>{
                context.questions = [];
                res.forEach(async (val)=>{
                    var answers = await window.db.getAllAnswers(context.category, context.set, context.options.join(","), val.QuestionContent, val.QuestionType);
                    val.answers = [];
                    answers.forEach((a)=>{ val.answers.push(a.Answer); });
                    context.questions.push({content: val.QuestionContent, type: val.QuestionType, answers: val.answers});
                });
                context.questionQueue = [];
                resolve(res);
            }).catch((err)=>{
                context.questions = [];
                context.questionQueue = [];
                reject(err);
            });
        }
        else {
            // No question set has been loaded, we have failed this check.
            return reject("No question set has been loaded at this time.");
        }
    })
};

/**
 * Selects the next question within the underlying question pool.
 * @returns {Object} The question object that is next in the question pool.
 */
window.selectNextQuestion = () => {
    if(context.questionQueue.length)
        return context.questionQueue.pop();
    context.questionQueue = shuffle(Array(...context.questions));
    return context.questionQueue.pop();
};

/**
 * Adds a new question to the database.
 * @param {String} type The question type.
 * @param {String} content The question content.
 * @param {Array} answers An array of answers to the question.
 * @returns {Promise} A promise that indicates the result of the insert question operation.
 */
window.addQuestion = (type, content, answers) => {
    return new Promise((resolve, reject) => {
        // Check if we have been given two non-empty string.
        if(typeof(type) != "string" || !type.length) return reject("Parameter 'type' needs to be a non-empty string. it is " + typeof type);
        if(typeof(content) != "string" || !content.length) return reject("Parameter 'content' needs to be a non-empty string. it is "+ type);
        // Check if we have been given an non-empty array.
        if(!Array.isArray(answers) || !answers.length) return reject("Parameter 'answers' needs to be a non-empty array.");
        // Check if we have loaded into a valid question set.
        if(context.package.length && context.category.length && context.set.length && context.options.length) {
            // Add in the new question.
            window.db.newQuestion(context.category, context.set, context.options.join(","), type, content)
            .then(async (res) => {
                for(var i in answers)
                    await window.db.newAnswer(context.category, context.set, context.options.join(","), type, content, answers[i]);
                // Reload the question set.
                window.loadQuestions().then(()=>{resolve(res)}).catch((err)=>{reject(err)});
            }).catch((err) => {
                reject(err);
            });
        }
        else {
            // No question set has been loaded, we have failed this check.
            reject("No question set has been loaded at this time.");
        }
    });
}

/**
 * Deletes a question from the underyling question database.
 * @param {String} type The question type. 
 * @param {String} content The question content.
 * @returns {Promise} A promise that will indicate the success or failure of the operation.
 */
window.deleteQuestion = async(type, content) => {
    return new Promise((resolve, reject) => {
        if(typeof(type) != "string" || !type.length) return resolve("Parameter 'type' needs to be a non-empty string.");
        if(typeof(content) != "string" || !content.length) return resolve("Parameter 'content' needs to be a non-empty string.");
        if(context.package.length && context.category.length && context.set.length && context.options.length) {
            window.db.delQuestion(context.category, context.set, context.options.join(","),content, type)
            .then((res) => {
                window.loadQuestions().then(()=>{resolve(res)}).catch((err)=>{reject(err)});
            }).catch((err) => {
                reject(err);
            })
        }
    })
};

/**
 * Adds a category to the database.
 * @param {String} package The package name that the category will be added under.
 * @param {String} category The category name that the category will be added under.
 * @param {String} name The name of the set that the category will be added as.
 * @param {String} options The options that this category will have.
 * @returns A promise that when resolved will indicate the operation success or failure.
 */
window.addCategory = (package, category, name, options) => {
    return window.db.newQuestionSet(category, name, options);
};

/**
 * Gets the scores for the user with the matching first and last names.
 * @param {String} firstName The users first name.
 * @param {String} lastName The users last name.
 * @returns {Array<Object>} An array of objects that represent the users scores. 
 */
window.getScores = async (firstName, lastName) => {
    return await window.db.getAllScores(firstName, lastName);
}

/**
 * Sets the underlying score for the given database combo.
 * @param {String} firstName The first name of the user that the score is for.
 * @param {String} lastName The last name of the user that the score is for.
 * @param {String} package The name of the package that the score is for.
 * @param {String} category The name of the category that the score is for.
 * @param {String} set The name of the set that the score is for.
 * @param {Array<String>} options An array of strings that represent the options for this set.
 * @param {Number} score The score that will be stored. 
 */
window.setScore = async (firstName, lastName, package, category, set, options, score) => {
    return await window.db.updateScore(firstName, lastName, category, set, options.join(","), score);
}

/**
 * Gets the underlying score for the given database combo.
 * @param {String} firstName The first name of the user that the score is for.
 * @param {String} lastName The last name of the user that the score is for.
 * @param {String} package The name of the package that the score is for.
 * @param {String} category The name of the category that the score is for.
 * @param {String} set The name of the set that the score is for.
 * @param {Array<String>} options An array of strings that represent the options for this set.
 */
window.getScore = async (firstName, lastName, package, category, set, options) => {
    console.log(firstName, lastName, package, category, set, options.join(","));
    var scores = await window.db.getAllScores(firstName, lastName);
    for(var i in scores) {
        let score = scores[i];
        console.log(score);
        if(/*score.PackageName == package &&*/ score.SetCategory == category && score.SetName == set && score.SetOptions == options.join(",")) {
            console.log(score.CurrentScore);
            return score.CurrentScore;
        }
    }
    return 0;
}

/**
 * Gets the underlying options for the database combo.
 * @returns {Array<String>} An array of strings for the question sets options.
 */
window.getOptions = () => {
    return context.options;
};