import { Router } from "express";
import { createpost, deletepost, editpost, getAllPosts } from "../Controllers/post.controller.js";
import { verifyJwt } from "../Middlewares/auth.middleware.js";
import { upload } from "../Middlewares/multer.js";

const router = Router();

// router.route("/createpost").post(verifyJwt, upload.fields([
//     { name: "postImage", maxCount: 1 }
// ]), createpost);
router.route("/createpost").post(verifyJwt, createpost);
router.route("/editpost").post(verifyJwt, editpost);
router.route("/deletepost").post(verifyJwt, deletepost);
router.route("/getallposts").post(verifyJwt, getAllPosts);

export { router as postRouter };