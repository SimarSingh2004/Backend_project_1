import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" })); // data from json format
app.use(express.urlencoded({ extended: true })); // data from url
app.use(express.static("public"));
app.use(cookieParser());

//routes
app.use("/api/v1/users", userRouter);

export { app };
