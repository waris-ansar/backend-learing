import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./env",
});

connectDB();

// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

//     app.on("error", (error) => {
//       console.log("Error connecting with the app:", error);
//       //   throw error;
//     });

//     app.listen(process.env.PORT, () => {
//       console.log(`APP is listening on port: ${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.log("error connecting database:", error);
//     // throw error;
//   }
// })();
