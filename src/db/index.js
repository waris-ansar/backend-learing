import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const monogoConnection = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.PORT}`,
      { dbName: DB_NAME }
    );
    console.log("Db is connected", monogoConnection.connection.host);
  } catch (error) {
    console.log("Error connecting db:", error);
    process.exit(1);
  }
};

export default connectDB;
