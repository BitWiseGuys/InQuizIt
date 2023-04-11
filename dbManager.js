/***********************************************
Database insertion functions

-functions needed for question insertion into database
************************************************/

var knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./databases/InQuizIt.db"
  }
});



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
 * Written by: Eddie Stillman
 * 
 *************************************************/

async function getUsers() {
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







//EXPORTS
exports.newQuestionSet = newQuestionSet;
exports.newQuestion = newQuestion;
exports.newAnswer = newAnswer;

exports.getAllQuestionSets = getAllQuestionSets;
exports.getAllCategories = getAllCategories;
exports.getQuestionSet = getQuestionSet;
exports.getAllQuestions = getAllQuestions;
exports.getAllAnswers = getAllAnswers;




