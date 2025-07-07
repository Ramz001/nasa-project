import mongoose from "mongoose";
require("dotenv").config();

const MONGODB_SECRET = process.env.MONGODB_SECRET ?? "";

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGODB_SECRET);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

export { mongoConnect, mongoDisconnect }; 