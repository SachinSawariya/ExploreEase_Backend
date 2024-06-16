import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());


//routes import

import userRouter from './routes/user.routes.js';
import trainRouter from "./routes/train.routes.js";
import paymentRouter from './routes/payment.routes.js'
import historyRouter from './routes/bookHistory.routes.js' 

//routes declaration

app.use('/api/v', userRouter);
app.use('/api/v', trainRouter);
app.use('/api/v', paymentRouter);
app.use('/api/v', historyRouter);

export {app};




