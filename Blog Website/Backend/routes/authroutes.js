import express from "express";
import { register , login , logout , getProfile} from "../controller/user.controller.js";
import { authentication } from "../middleware/authentication.js";
const authroutes = express();
authroutes.post("/register" , register);
authroutes.post("/login" , login);
authroutes.post("/logout" , logout);
authroutes.get("/profile" ,authentication, getProfile);
export default authroutes;