const mongoDb = require("mongodb");

let database;
let mongodbUrl = "mongodb://127.0.0.1:27017";

if(process.env.MONGODB_URL){
  mongodbUrl = process.env.MONGODB_URL;
}
// const MongoClient = mongoDb.MongoClient;

// const client = new MongoClient("mongodb://127.0.0.1:27017");

async function initializeDatabase(){
  const client = await mongoDb.MongoClient.connect(mongodbUrl);
  database = client.db("onlineshop");
}

// function connectToDb() {
//   database = client.db("onlineshop");
// }

function getDb() {
  if(!database){
    throw new Error("No database connected!");
  }

  return database;
}

// function closeDb() {
//   client.close();
// }

module.exports = {
  // database: database,
  initializeDatabase: initializeDatabase,
  getDb: getDb,
  // closeDb: closeDb,
};
