import { Router } from 'express';
import { getUserBookHistory } from '../controllers/bookHistory.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/history').get(verifyJWT, getUserBookHistory);

export default router;






























// import { Router } from "express"
// import { HotelBooking } from "../models/bookHotel.model.js";


// const router = Router();
// router.post("/hotelBooking/:hotelId", async (req, res) => {
//     try {
//       const { fullName, numberOfRooms, checkInDate, checkOutDate } = req.body;
//       const { hotelId } = req.params; // Extract hotelId from request parameters

//       // Create a new booking instance
//       const newBooking = new HotelBooking({
//         hotelId,
//         fullName,
//         numberOfRooms,
//         checkInDate,
//         checkOutDate,
//       });
  
//       // Save the booking to the database
//       await newBooking.save();
  
//       res.status(201).json({ message: "Booking successful!" });
//     } catch (error) {
//       console.error("Error in booking:", error);
//       res.status(500).json({ message: "Something went wrong!" });
//     }
//   });

// export default router;