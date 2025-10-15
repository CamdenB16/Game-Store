const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const dbName = "rawgGames";

const client = new MongoClient(url);
let db;

async function connectToDb() {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
}

function getDb() {
  return db;
}

module.exports = { connectToDb, getDb };
