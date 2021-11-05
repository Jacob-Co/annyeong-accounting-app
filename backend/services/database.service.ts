// External Dependencies
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

export class DBWrapper {
  public static usersCollection?: mongoDB.Collection;
  public static businessEntityCollection?: mongoDB.Collection;

  public static async connectToDatabase() {
    dotenv.config();
    const client: mongoDB.MongoClient = 
      new mongoDB.MongoClient(process.env.DB_CONN_STRING!);
    await client.connect();
    const db: mongoDB.Db = client.db(process.env.DB_NAME);
  
    usersCollection = db.collection(process.env.USERS_COLLECTION_NAME!);
    businessEntityCollection = db.collection(process.env.BUSINESS_ENTITY_COLLECTION_NAME!);
    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${usersCollection.collectionName}, ${businessEntityCollection.collectionName}`);
  }
}


// Global Variables
// export const collections: { users?: mongoDB.Collection } = {}
export let usersCollection: mongoDB.Collection;
export let businessEntityCollection: mongoDB.Collection;
export let expenseTypesCollection: mongoDB.Collection;
export let expensesCollection: mongoDB.Collection;

// Initialize Connection
export async function connectToDatabse() {
  dotenv.config();
  const client: mongoDB.MongoClient = 
    new mongoDB.MongoClient(process.env.DB_CONN_STRING!);
  await client.connect();
  const db: mongoDB.Db = client.db(process.env.DB_NAME);

  usersCollection = db.collection(process.env.USERS_COLLECTION_NAME!);
  businessEntityCollection = db.collection(process.env.BUSINESS_ENTITY_COLLECTION_NAME!);
  expenseTypesCollection = db.collection(process.env.EXPENSE_TYPE_COLLECTION_NAME!);
  expensesCollection = db.collection(process.env.EXPENSES_COLLECTION_NAME!); 
  console.log(`Successfully connected to database: ${db.databaseName} and collection: ${usersCollection.collectionName}, ${businessEntityCollection.collectionName}`);
}