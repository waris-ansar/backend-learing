import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { BASE_PREFIX_VERSION } from "./constants.js";
import { handleErrorResponse } from "./middleware/errorResponse.middleware.js";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes
import userRouter from "./routes/user.routes.js";

// routes declartion
app.use(`${BASE_PREFIX_VERSION}/users`, userRouter);

// app.use(handleErrorResponse);

export { app };
