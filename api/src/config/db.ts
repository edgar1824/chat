import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO!);
    console.log("Conected to mongoDB");
  } catch (err) {
    console.log("MongoDB Disconnected");
    throw err;
  }
};
mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});
