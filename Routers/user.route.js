import { Router } from "express";
import { registerUser } from "../Controllers/user.controller.js";
import { upload } from "../Middlewares/multer.js";

Router.Route("/register").post( upload, registerUser)

// protected route

