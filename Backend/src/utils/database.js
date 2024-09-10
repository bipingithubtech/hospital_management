import mongoose from "mongoose";

const database = async () => {
  try {
    await mongoose.connect(process.env.server);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Optionally exit the process if the connection fails
  }
};

export default database;
