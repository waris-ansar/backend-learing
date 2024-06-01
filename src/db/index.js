import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const monogoConnection = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.PORT}`
    );
    console.log("Db is connected", monogoConnection.connection.host);
  } catch (error) {
    console.log("Error connecting db:", error);
    process.exit(1);
  }
};

export default connectDB;
