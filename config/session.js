const mongodbStore = require("connect-mongodb-session");
const expressSession = require('express-session');

const MongoDBStore = mongodbStore(expressSession);
const sessionStore = new MongoDBStore({
  uri: process.env.MONGODB_URL,//"mongodb://127.0.0.1:27017",
  databaseName: "onlineshop",
  collection: "sessions",
});

function sessionOptions() {
  return {
    secret: process.env.sessionSecret, 
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { maxAge: 15 * 60 * 1000 }, // 15 Minuten
  };
}

module.exports = sessionOptions;
