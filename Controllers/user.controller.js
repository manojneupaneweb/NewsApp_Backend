import { User } from "../Models/user.model.js"
import { asyncHandler } from "../Utils/asyncHandler.util.js"
import { ApiError } from "../Utils/apiError.util.js"
import { ApiResponse } from "../Utils/apiResponse.util.js"
import { uploadOnCloudinary } from "../Utils/cloudiny.util.js"
import { sendremail } from "../Middlewares/emailVerification.js"
import { Option } from "../Utils/option.util.js"
import jwt from "jsonwebtoken"

const generateAccessRefreshToken = async (userId) => {

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();
    return { accessToken, refreshToken };

};

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body
    if ([name, email, password, phone].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        throw new ApiError(400, "Email already exists")
    }

    const localFilePath = req.files?.profilePicture[0]?.path;
    if (!localFilePath) {
        throw new ApiError(400, "Profile picture is required")
    }

    const profilePictureUrl = await uploadOnCloudinary(localFilePath);

    if (!profilePictureUrl) {
        return res.status(500).json({ message: "Failed to upload profile picture" });
    }
    const user = await User.create({
        name,
        email,
        password,
        phone,
        profilePicture: profilePictureUrl,
    });

    console.log("user created", user.name, user.email);

    res.status(201).json(
        new ApiResponse(201, "User created successfully", { userId: user._id })
    );

})

const otpverification = asyncHandler(async (req, res) => {
    sendremail()
        .then(() => {
            res
                .status(201)
                .json(201, "OTP send")
        })
        .catch((err) => {
            throw new ApiError(500, "Failed to send OTP")

        })
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessRefreshToken(user._id);


    if (!accessToken || !refreshToken) {
        throw new ApiError(500, "Failed to generate tokens");
    }

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // Set cookie options
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Ensure cookies are sent over HTTPS in production
        sameSite: "lax", // Adjust to your needs
        maxAge: 24 * 60 * 60 * 1000, // 1 day expiration for the cookies
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)  // Set cookies first
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});

const logutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .clearCookie("accessToken", Option)
        .clearCookie("refreshToken", Option)
        .json(new ApiResponse(200, "User logged out successfully"))
})

const getUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json(new ApiResponse(200, "User profile retrieved", user));
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password")

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const { accessToken, newRefreshToken } = await generateAccessRefreshToken(user._id);
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        };
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(200, { user }, "Access token refreshed"));
    } catch (error) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
})

const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find().select("-password -refreshToken");
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch users", error: error.message });
    }
});

export {
    registerUser,
    loginUser,
    otpverification,
    logutUser,
    getUserProfile,
    refreshAccessToken,
    getAllUsers
}