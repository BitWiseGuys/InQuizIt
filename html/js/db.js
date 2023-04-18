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

// When called will reload the databases.
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

// Loads in the package (so long as it exists in the database).
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

// Loads in the category (so long as it exists in the database).
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

// Loads in the category (so long as it exists in the database).
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

// Loads in the category (so long as it exists in the database).
window.addOption = (option) => {
    if(!(context.package in window.databases)) return false;
    if(!(context.category in window.databases[context.package])) return false;
    if(!(context.set in window.databases[context.package][context.category])) return false;
    if(window.databases[context.package][context.category][context.set].indexOf(option) == -1) return false;
    context.options.push(option);
    return true;
}

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
    return true;
}

window.loadQuestionSet = (package, category, set) => {
    return (window.loadDatabase(package) && window.loadCategory(category) && window.loadSet(set));
};

window.loadQuestions = () => {
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

window.selectNextQuestion = () => {
    if(context.questionQueue.length)
        return context.questionQueue.pop();
    context.questionQueue = shuffle(Array(...context.questions));
    return context.questionQueue.pop();
};

window.addQuestion = (type, content, answers) => {
    return new Promise((resolve, reject) => {
        // Check if we have been given two non-empty string.
        if(typeof(type) != "string" || !type.length) return reject("Parameter 'type' needs to be a non-empty string.");
        if(typeof(content) != "string" || !content.length) return reject("Parameter 'content' needs to be a non-empty string.");
        // Check if we have been given an non-empty array.
        if(!Array.isArray(answers) || !answers.length) return reject("Parameter 'answers' needs to be a non-empty array.");
        // Check if we have loaded into a valid question set.
        if(context.package.length && context.category.length && context.set.length && context.options.length) {
            // Add in the new question.
            window.db.newQuestion(context.category, context.set, context.options.join(""), type, content)
            .then(async (res) => {
                for(var i in answers)
                    await window.db.newAnswer(context.category, context.set, context.options.join(""), type, content, answers[i]);
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

window.addCategory = (package, category, name, options) => {
    return window.db.newQuestionSet(category, name, options);
};