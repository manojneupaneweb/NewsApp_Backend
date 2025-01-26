import { Post } from "../Models/post.model.js"
import { asyncHandler } from "../Utils/asyncHandler.util.js"
import { ApiError } from "../Utils/apiError.util.js"
import { ApiResponse } from "../Utils/apiResponse.util.js"
import { uploadOnCloudinary } from "../Utils/cloudiny.util.js"

const createpost = asyncHandler(async (req, res) => {
    const { title, content, category, tags } = req.body;

    // Log the incoming fields for debugging
    console.log("Received Data:", { title, content, category, tags });

    // Validate required fields
    if ([title, content, category].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields (title, content, and category) are required");
    }

    // Ensure the uploaded image exists
    if (!req.files || !req.files.image || req.files.image.length === 0) {
        throw new ApiError(400, "Image is required");
    }

    const localFilePath = req.files.image[0].path; // Access the first uploaded file
    console.log("Image Path:", localFilePath);

    // Upload the image to Cloudinary
    const postImageUrl = await uploadOnCloudinary(localFilePath);

    // Create the post in the database
    const post = await Post.create({
        title,
        content,
        image: postImageUrl,
        category,
        tags: tags ? JSON.parse(tags) : [], // Parse tags if they are a JSON string
        author: req.user._id,
    });

    // Respond with success
    return res.status(201).json(
        new ApiResponse(
            201,
            "Post created successfully",
            post
        )
    );
});

const editpost = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const post = await Post.findByIdAndUpdate(
        postId,
        req.body,
        { new: true, runValidators: true }
    ).populate("author");

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    return res.json(
        new ApiResponse(
            200,
            "Post updated successfully",
        ))
})

const deletepost = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    if (post.author.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this post");
    }

    // If post has an image, delete it from Cloudinary
    if (post.postImage) {
        await deleteFromCloudinary(post.postImage);
    }

    await post.remove();

    return res.json(
        new ApiResponse(200, "Post deleted successfully")
    );
});
const getAllPosts = asyncHandler(async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json({ success: true, posts });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch Posts", error: error.message });
    }
});




export {
    createpost, editpost, deletepost, getAllPosts
}