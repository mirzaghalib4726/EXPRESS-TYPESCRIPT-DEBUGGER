import mongoose from "mongoose";

const connectDatabase = async () => {
  const uri = process.env.MONGODB_URI || "";
  try {
    await mongoose.connect(uri, {
      autoIndex: true,
      autoCreate: true,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
  }
};

export default connectDatabase;
