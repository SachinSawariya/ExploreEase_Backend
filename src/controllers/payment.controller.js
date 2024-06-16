// payment.controller.js
import { paymentInstance } from "../index.js";
import { ApiError } from "../utils/ApiError.js";
import HotelBooking from '../models/bookHotel.model.js';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});

const createOrder = async (req, res) => {
    try {
        const { hotel_id, hotel_name, fullName, numberOfRooms, checkInDate, checkOutDate, price } = req.body;

        const userEmail = req.user.email;
        //    console.log(req.user.email)
        // Save booking to database
        const booking = new HotelBooking({
            email: userEmail,
            hotel_id,
            hotel_name,
            fullName,
            numberOfRooms,
            checkInDate,
            checkOutDate,
            price,
        });
        await booking.save();

        // Create Razorpay order
        const options = {
            amount: price * 100, // amount in paise
            currency: 'INR',
            receipt: 'receipt_order_74394'
        };
        const razorpayOrder = await paymentInstance.orders.create(options);

        // Update booking with payment information
        booking.paymentId = razorpayOrder.id;
        await booking.save();

        res.json({ success: true, razorpayOrder });
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Razorpay server error");
    }
};

const paymentVerification = async (req, res) => {
    const { payment_id, order_id } = req.body;

    try {
        // Simulate signature verification (replace this with your actual verification logic)
        const isValidSignature = true; // Simulated signature verification result

        if (!isValidSignature) {
            return res.status(400).json({ success: false, error: 'Invalid signature' });
        }

        // Simulate fetching payment details from Razorpay (replace this with actual API call)
        const payment = { status: 'captured' }; // Simulated payment details

        if (payment.status === 'captured') {
            // Simulate finding booking in database based on payment order_id (replace this with actual database query)
            const booking = await HotelBooking.findOne({ paymentId: order_id });

            if (!booking) {
                return res.status(404).json({ success: false, error: 'Booking not found' });
            }

            // Simulate updating booking payment status to 'paid' (replace this with actual database update)
            booking.paymentStatus = 'paid'; // Simulated payment status update
            await booking.save();

            return res.status(200).json({ success: true, message: 'Payment successful' });
        }

        else {
            return res.status(400).json({ success: false, error: 'Payment not captured' });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: 'Server Error' });
    }
};

export {
    createOrder,
    paymentVerification
};
