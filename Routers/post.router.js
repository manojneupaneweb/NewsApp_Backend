import { Router } from "express";
import { createpost, deletepost, editpost, getAllPosts, getPostById } from "../Controllers/post.controller.js";
import { verifyJwt } from "../Middlewares/auth.middleware.js";
import { upload } from "../Middlewares/multer.js";

const router = Router();

// Route for creating a post
router.route("/createpost")
  .post(verifyJwt, upload.fields([{ name: "image", maxCount: 1 }]), createPost);

// Route for editing a post
router.route("/editpost/:id")
  .put(verifyJwt, upload.single('image'), editpost);

router.route('/getpostbyid/:id').get(verifyJwt, getPostById); 
router.route("/deletepost/:id").delete(verifyJwt, deletepost); 
router.route("/getallposts").get(verifyJwt, getAllPosts);

export { router as postRouter };