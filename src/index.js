import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.log(err, "error running server");
      throw errror;
    });
    app.listen(
      process.env.PORT,
      console.log(`server is runnin at the port ${process.env.PORT || 8000}`)
    );
  })
  .catch((err) => console.log("connection failed", err));

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
