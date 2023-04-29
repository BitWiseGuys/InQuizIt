/***********************************************
Database insertion functions

-functions needed for question insertion into database
************************************************/

var knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./databases/InQuizIt.db"
  },
  useNullAsDefault: true
});



/************************************************
 * 
 * Database Merge/Replace Functions
 * 
 ***********************************************/

//given the path to another inquizit database file, merge all non redundant
//data into the main db
async function mergeDatabases(externDbPath) {
  console.log(externDbPath);
  // Connect second external database
  const knex2 = require("knex")({
    client: 'sqlite3',
    connection: {
      filename: externDbPath,
    },
    useNullAsDefault: true,
  });

  // Get a list of tables in the first database
  const tables = await knex2('sqlite_master')
    .where('type', 'table')
    .select('name');

  // For each table
  for (const table of tables) {
    try {
      // Get all rows from the table in the first database
      const rows = await knex2(table.name).select();

      // Insert all rows into the corresponding table in the second database
      await knex(table.name).insert(rows).onConflict().ignore();
    } catch (err) {
      console.error(`Error inserting data into table ${table.name}:`, err);
    }
  }

  console.log("Succefully Merged External Database in Main");

  // Close the connection
  await knex2.destroy();
}

//fully replace exisitng main db with specified file path
//also creates backup of original file
async function replaceDatabase(externDbPath){
  const fs = require('fs');
  const path = require('path');

//close current knex connection
await knex.destroy();

//create backup of original DB file
fs.copyFile('./databases/InQuizIt.db', './databases/InQuizIt-old.db', err => {
  if (err) throw err;
  console.log('Backup File copied and renamed successfully!');
});


//copies specified file as new main DB
const sourceFile = externDbPath;
const targetDir = './databases';
const targetFile = path.join(targetDir, 'InQuizIt.db');

fs.copyFile(sourceFile, targetFile, err => {
  if (err) throw err;
  console.log('New DB File copied and renamed successfully!');
});

//reopen new main knex connection
knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./databases/InQuizIt.db"
  },
  useNullAsDefault: true
});
console.log("Main DB successfully reconnected");

}






/*************************************************
 * 
 * Database Insertion Functions
 * Written by: Connor Marshall
 * 
 *************************************************/

//knex insert given row object and table name
async function insertToTable(row,table) {
  try {
    res = await knex(table).insert(row);
    console.log(`Successfully inserted row into ${table} table!`);
    return res;

  } catch (err) {
    console.error(`Error inserting row into ${table} table: ${err}`);
  }
};

//Create a new QuestionSet
async function newQuestionSet(Category, Name, Options, TentativeScore = 100,Package = 'Logicola') {
  const row = {PackageName: Package, SetCategory: Category, SetName: Name, SetOptions: Options, CompletionScore: TentativeScore};
  const table = "QuestionSets_T";
  
  res = await insertToTable(row,table);
  return res;
};

//Add a new question to an existing questionset
async function newQuestion(Category, Name, Options, Type, Question, Package = 'Logicola') {
  const row = {PackageName: Package, SetCategory: Category, SetName: Name, SetOptions: Options, QuestionType: Type, QuestionContent: Question};
  const table = "Questions_T";
  
  res = await insertToTable(row,table);
  return res;
};

//Adds a new answer to a specific questionID question
async function newAnswer(Category,Name,Options,Type,Question,Ans, Package = 'Logicola') {
  const row = {PackageName: Package, SetCategory: Category, SetName: Name, SetOptions: Options, QuestionType: Type, QuestionContent: Question, Answer: Ans};
  const table = "Answers_T";
  
  res = await insertToTable(row,table);
  return res;
};

async function newUser(FirstName, LastName) {
  const row = {FirstName: FirstName, LastName: LastName};
  const table = "Users_T";
  const res = await insertToTable(row, table);
  return res;
}


/*************************************************
 * 
 * Database Retrieval Functions
 * Written by: Eddie Stillman & Connor Marshall
 * 
 *************************************************/

async function getAllUsers() {
  const res = await knex.select("*").from("Users_T");
  return res;
}

//returns all available question sets 
async function getAllQuestionSets() {
  const res = await knex.select("*").from("QuestionSets_T");
  return res;
};

//returns all available question sets 
async function getAllCategories() {
  const res = await knex.select(knex.raw('distinct "SetCategory"')).from("QuestionSets_T");
  return res;
};

//return one question set given the (category, name, option)
async function getQuestionSet(setCategory, setName, setOptions) {
  const res = await knex.select("*").from("QuestionSets_T").where({SetName     : setName, 
                                                                   SetOptions  : setOptions, 
                                                                   SetCategory : setCategory});
return res;
};

async function getAllQuestions(setCategory, setName, setOptions) {
  const res = await knex.select("*").from("Questions_T").where({SetName     : setName, 
                                                                SetOptions  : setOptions, 
                                                                SetCategory : setCategory});
return res;
};

async function getAllAnswers(setCategory, setName, setOptions, questionContent, questionType) {
  const res = await knex.select("*").from("Answers_T").where({SetName         : setName, 
                                                              SetOptions      : setOptions,
                                                              SetCategory     : setCategory,
                                                              QuestionType    : questionType,
                                                              QuestionContent : questionContent});
return res;
};


/*************************************************
 * 
 * Database Deletion Functions
 * Written by: Connor Marshall
 * 
 * 
 *************************************************/
async function deleteQuestion(setCategory, setName, setOptions, questionContent, questionType) {
  const res = await knex.del('*').from("Answers_T")
  .where({SetName         : setName, 
          SetOptions      : setOptions,
          SetCategory     : setCategory,
          QuestionType    : questionType,
          QuestionContent : questionContent});

  const res2 = await knex.del('*').from("Questions_T")
  .where({SetName         : setName, 
          SetOptions      : setOptions,
          SetCategory     : setCategory,
          QuestionType    : questionType,
          QuestionContent : questionContent});

  return res2;
};

async function deleteQuestionSet(setCategory, setName, setOptions) {
  const res = await knex.del('*').from("Questions_T")
  .where({SetName         : setName, 
          SetOptions      : setOptions,
          SetCategory     : setCategory});

  const res2 = await knex.del('*').from("QestionSets_T")
  .where({SetName         : setName, 
          SetOptions      : setOptions,
          SetCategory     : setCategory});

  return res2;
};

async function deleteUser(firstName, lastName) {
  const res = await knex.del('*').from("Scores_T")
  .where({FirstName         : firstName, 
          LastName      : lastName});

  const res2 = await knex.del('*').from("Users_T")
          .where({FirstName      : firstName, 
                  LastName      : lastName});
  return res2;
};


/*************************************************
 * 
 * Database Score Functions
 * Written by: Connor Marshall
 * 
 * 
 *************************************************/

//retrieve all scores for a specific user
async function getAllScores(firstName,lastName) {
  const res = await knex.select("*")
  .from("Scores_T")
  .where({FirstName: firstName, LastName: lastName});
  return res;
};

//update or create a score value if not already present
async function updateScore(firstName,lastName, setCategory, setName, setOptions, scoreVal){
  const res = await knex("Scores_T")
  .insert({ FirstName: firstName, LastName: lastName, PackageName: "Logicola", SetCategory: setCategory, SetName: setName, SetOptions: setOptions, CurrentScore: scoreVal})
  .onConflict(["FirstName", "LastName", "PackageName", "SetCategory", "SetName", "SetOptions"]).merge();
  return res;
}




//EXPORTS
exports.mergeDatabases = mergeDatabases;
exports.replaceDatabase = replaceDatabase;

exports.newQuestionSet = newQuestionSet;
exports.newQuestion = newQuestion;
exports.newAnswer = newAnswer;
exports.newUser = newUser;

exports.getAllUsers = getAllUsers;
exports.getAllQuestionSets = getAllQuestionSets;
exports.getAllCategories = getAllCategories;
exports.getQuestionSet = getQuestionSet;
exports.getAllQuestions = getAllQuestions;
exports.getAllAnswers = getAllAnswers;

exports.deleteQuestion = deleteQuestion;
exports.deleteQuestionSet = deleteQuestionSet;
exports.deleteUser = deleteUser;

exports.getAllScores = getAllScores;
exports.updateScore = updateScore;

