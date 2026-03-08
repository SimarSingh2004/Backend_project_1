// load environment variables as early as possible
import "dotenv/config"; // automatically reads .env from project root

import mongoose from "mongoose";
import express from "express";
import { app } from "./app.js";

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}`).then(() => {
      console.log("Connected to MongoDb");
    });
    app.on("error", (error) => {
      console.log("Error ", error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Error ", error);
    throw error;
  }
})();
