// External Dependencies
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

// Global Variables
// export const collections: { users?: mongoDB.Collection } = {}
export let usersCollection: mongoDB.Collection;
export let businessEntityCollection: mongoDB.Collection;

// Initialize Connection
export async function connectToDatabse() {
  dotenv.config();
  const client: mongoDB.MongoClient = 
    new mongoDB.MongoClient(process.env.DB_CONN_STRING!);
  await client.connect();
  const db: mongoDB.Db = client.db(process.env.DB_NAME);

  usersCollection = db.collection(process.env.USERS_COLLECTION_NAME!);
  businessEntityCollection = db.collection(process.env.BUSINESS_ENTITY_COLLECTION_NAME!);
  console.log(`Successfully connected to database: ${db.databaseName} and collection: ${usersCollection.collectionName}, ${businessEntityCollection.collectionName}`);
}