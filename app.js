import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import 'dotenv/config'


const app = express()

app.use(
    cors({
      origin: "http://localhost:5173", // React app URL
      credentials: true, // Allow credentials (cookies)
    })
  );

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser())

// Middleware to parse JSON requests
app.use(express.json());

import { userRoute } from "./Routers/user.route.js";
import { postRouter } from "./Routers/post.router.js"
app.use("/api/v1/users", userRoute)
app.use("/api/v1/posts", postRouter)

export { app };

