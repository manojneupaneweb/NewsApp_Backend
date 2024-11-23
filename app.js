import express from "express";
import dotenv from "dotenv";

const app = express();
dotenv.config(
    { path: "/env" }
)



// Middleware to parse JSON requests
app.use(express.json());



export {app};