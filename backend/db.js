
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";



const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const dbName = process.env.MONGODB_DB_NAME;
const host = process.env.MONGODB_HOST;
const port = process.env.MONGODB_PORT;

const dbUri = `mongodb://${username}:${password}@${host}:${port}/${dbName}`;

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
