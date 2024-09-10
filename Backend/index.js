import express from "express";
import dotenv from "dotenv";
import database from "./src/utils/database.js";
import { userRouter } from "./src/Respository/user.js";

import { doctorRouter } from "./src/Respository/DoctorRepo.js";
dotenv.config();
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.use("/api/user", userRouter);
app.use("/api/doctor", doctorRouter);
app.listen(port, () => {
  database();
  console.log("srever is running in port number :", port);
});
