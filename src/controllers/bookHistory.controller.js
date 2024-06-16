import HotelBooking from "../models/bookHotel.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getUserBookHistory = asyncHandler( async (req, res ) => {

    try {

        const userId = req.user.email;
        // console.log(req.user)
        // console.log(userId)
        const bookingHistory = await HotelBooking.find({email: userId}).sort({createdAt: -1});

        return res.status(201)
        .json( new ApiResponse(201, bookingHistory))
        
    } catch (error) {
        console.log("Error in getting User Book History : ", error);
        throw new ApiError(500, 'Error fetching to user booking history');
        
    }
})

export {
    getUserBookHistory
}