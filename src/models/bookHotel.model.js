// bookHotel.model.js
import mongoose, { Schema } from 'mongoose';

const hotelBookingSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  hotel_id: {
    type: String, // Assuming hotelId is a string
    required: true
  },
  hotel_name: {
    type: String,
  },
  fullName: {
    type: String,
    required: true
  },
  numberOfRooms: {
    type: Number,
    required: true
  },
  checkInDate: {
    type: Date,
    required: true
  },
  checkOutDate: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true
  },

  paymentId: {
    type: String
  },

  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  }

}, { timestamps: true });

const HotelBooking = mongoose.model('HotelBooking', hotelBookingSchema);

export default HotelBooking;
