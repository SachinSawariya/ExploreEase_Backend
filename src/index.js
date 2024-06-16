import dotenv from 'dotenv';
import connectDB from './db/index.js';
import {app} from './app.js';
import Razorpay from 'razorpay'

dotenv.config({
    path: './env'
})


export const paymentInstance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY ,
    key_secret: process.env.RAZORPAY_API_SECRET ,
})



connectDB()
.then(async () => {
    app.listen(process.env.PORT || 5000, ()=>{
        console.log(`Server is running on port ${process.env.PORT}`)
    })  
})
.catch((err)=> {
    console.log("MongoDB connection Error ", err);
})


