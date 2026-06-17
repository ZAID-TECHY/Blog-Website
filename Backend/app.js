import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authroutes from "./routes/authroutes.js";
import blogroutes from "./routes/blogroutes.js";
dotenv.config();
const server = express();
server.use(express.json());
server.use(cors());
mongoose.connect(process.env.MONGO_URL)//process.env.MONGO_URI
    .then(() => console.log("Database connection successful"))
    .catch((err) => console.error("Database connection failed:", err));

server.use("/", authroutes);
server.use("/blog", blogroutes);
const PORT = process.env.PORT || 5100;
server.listen(PORT, console.log("Server started"));