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


//knex insert given row objct and table name
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
async function newQuestionSet(Catagory, Name, Options, TentativeScore = 100,Package = 'Logicola') {
  const row = {PackageName: Package, SetCatagory: Catagory, SetName: Name, SetOptions: Options, CompletionScore: TentativeScore};
  const table = "QuestionSets_T";
  
  res = await insertToTable(row,table);
  return res;
};

//Add a new question to an existing questionset
async function newQuestion(Catagory, Name, Options, Type, Question, Package = 'Logicola') {
  const row = {PackageName: Package, SetCatagory: Catagory, SetName: Name, SetOptions: Options, QuestionType: Type, QuestionContent: Question};
  const table = "Questions_T";
  
  res = await insertToTable(row,table);
  return res;
};

//Adds a new answer to a specific questionID question
async function newAnswer(Catagory,Name,Options,Type,Question,Ans, Package = 'Logicola') {
  const row = {PackageName: Package, SetCatagory: Catagory, SetName: Name, SetOptions: Options, QuestionType: Type, QuestionContent: Question, Answer: Ans};
  const table = "Answers_T";
  
  res = await insertToTable(row,table);
  return res;
};


//EXPORTS
exports.newQuestionSet = newQuestionSet;
exports.newQuestion = newQuestion;
exports.newAnswer = newAnswer;




