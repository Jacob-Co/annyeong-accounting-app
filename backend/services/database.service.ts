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
export let mongoDBClient: mongoDB.MongoClient;

export let usersCollection: mongoDB.Collection;
export let businessEntityCollection: mongoDB.Collection;
export let expenseTypesCollection: mongoDB.Collection;
export let expensesCollection: mongoDB.Collection;
export let dailyAccountingsCollection: mongoDB.Collection;
export let creditorsCollection: mongoDB.Collection;
export let creditsCollection: mongoDB.Collection;
export let distributorsCollection: mongoDB.Collection;

// Initialize Connection
export async function connectToDatabse() {
  dotenv.config();
  mongoDBClient = 
    new mongoDB.MongoClient(process.env.DB_CONN_STRING!);
  await mongoDBClient.connect();
  const db: mongoDB.Db = mongoDBClient.db(process.env.DB_NAME);

  distributorsCollection = db.collection(process.env.DISTRIBUTORS_COLLECTION_NAME!);
  creditsCollection = db.collection(process.env.CREDITS_COLLECTION_NAME!);
  creditorsCollection = db.collection(process.env.CREDITORS_COLLECTION_NAME!);
  usersCollection = db.collection(process.env.USERS_COLLECTION_NAME!);
  businessEntityCollection = db.collection(process.env.BUSINESS_ENTITY_COLLECTION_NAME!);
  expenseTypesCollection = db.collection(process.env.EXPENSE_TYPE_COLLECTION_NAME!);
  expensesCollection = db.collection(process.env.EXPENSES_COLLECTION_NAME!);
  dailyAccountingsCollection = db.collection(process.env.DAILY_ACCOUNTINGS_COLLECTION_NAME!); 
  console.log(`Successfully connected to database: ${db.databaseName} and collection: ${usersCollection.collectionName}, ${businessEntityCollection.collectionName}`);
}