import express from "express";
import dotenv from "dotenv";
import database from "./src/utils/database.js";
import { userRouter } from "./src/Respository/user.js";

import { doctorRouter } from "./src/Respository/DoctorRepo.js";
import { PatientRouter } from "./src/Respository/PateintRepo.js";
import { mangemantRouter } from "./src/Respository/ManagementRepo.js";
dotenv.config();
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.use("/api/user", userRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/patient",PatientRouter)
app.use("/api/management",mangemantRouter)
app.listen(port, () => {
  database();
  console.log("srever is running in port number :", port);
});
