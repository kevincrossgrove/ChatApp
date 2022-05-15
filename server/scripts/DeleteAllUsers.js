const mongo = require("mongodb");
require("dotenv").config();

const uri = process.env.MDB_CONNECT;
const client = new mongo.MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("myFirstDatabase");
    const users = database.collection("users");
    // Query for all movies with a title containing the string "Santa"
    const query = { email: { $regex: ".*" } };
    const result = await users.deleteMany(query);
    console.log("Deleted " + result.deletedCount + " documents");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
