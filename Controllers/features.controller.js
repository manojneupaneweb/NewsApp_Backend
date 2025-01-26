import { Post } from "../Models/post.model.js"
import { asyncHandler } from "../Utils/asyncHandler.util.js"
import { ApiError } from "../Utils/apiError.util.js"
import { ApiResponse } from "../Utils/apiResponse.util.js"
import { uploadOnCloudinary } from "../Utils/cloudiny.util.js"


const likePost = asyncHandler(async (req, res, next) => {
    const postId = req.params.postId;
    const userId = req.user._id;

    if (!postId) {
        throw new ApiError(400, "Invalid post ID");
    }

    const post = await Post.findById(postId).populate("likes");
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const likeIndex = post.likes.findIndex((like) => like.user.toString() === userId.toString());

    if (likeIndex === -1) {
        post.likes.push({ user: userId });
        await post.save();
        return ApiResponse.sendResponse(res, 200, "Post liked successfully");
    } else {
        post.likes.splice(likeIndex, 1);
        await post.save();
        return ApiResponse.sendResponse(res, 200, "Post unliked successfully");
    }
})