import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const registerUser = asyncHandler(async (req, res) => {

    const { fullname, email, password, mobileno } = req.body

    if (
        [fullname, email, password, mobileno].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "Please fill all fields");
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
        throw new ApiError(409, "User with email already exist")
    }

    // console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;

    const avatar = await uploadOnCloudinary(avatarLocalPath);


    // create obj and save it on db

    const user = await User.create({
        fullname,
        email,
        password,
        mobileno,
        avatar: avatar?.url || ""
    });

    const createdUser = await User.findByIdAndUpdate(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registring the user")
    }


    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Successfully registered!")
    )

})



const generateAccessAndRefreshToken = async (userId) => {

    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false }) // to skip token validation in this case

        return { refreshToken, accessToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating and refreshing token")
    }
}




const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email) {
        throw new ApiError(400, " Email is required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User does not exits. Please sign up first!");
    }


    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Incorrect Password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);


    //send cookies

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: loggedInUser, accessToken, refreshToken
            },
                " User Logged In Successfully"
            )
        )

})


//for logout

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined
        }
    },
        {
            new: true
        })

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User Logged Out"))

})



// for refreshing token 

const refreshAccessToken = asyncHandler(async (req, res) => {

    // Get the refresh token from cookies
    const IncomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!IncomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    // Checking whether the incoming token is valid or not

    try {
        const decodedToken = jwt.verify(IncomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findOne(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid Token");
        }

        if (IncomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh Token is expire or used");
        }


        const options = {
            httpOnly: true,
            secure: true
        }
        // Creating a new access token and updating the user's tokens in DB

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id)

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(200, {
                    accessToken,
                    refreshToken: newRefreshToken
                },
                    "Access Token refreshed"
                )
            )


    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})


// for changing password

const changeCurrentPassword = asyncHandler(async (req, res) => {

    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false })

    return res.status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully!"))

})



const getUserProfile = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        return res.status(200).json(new ApiResponse(200, user));
    } catch (error) {
        console.log("Error in getting user profile:", error);
        throw new ApiError(500, 'Error fetching user profile');
    }
});


const updateUserAvatarImage = asyncHandler(async (req, res) => {

    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatara file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        }, { new: true }
    ).select('-password') // we do not want to send password back 

    return res.status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"))

})



const updateAccountDetails = asyncHandler(async (req, res) => {

    // update details as per your requirement of your projects
    const { fullname, mobileno } = req.body;

    if (!fullname) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname,
                mobileno: mobileno
            }
        }, { new: true }
    ).select("-password")


    return res.status(200)
    .json(new ApiResponse(200, user , "Profile updated Successfully"));

})



export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getUserProfile,
    updateUserAvatarImage,
    updateAccountDetails
}
