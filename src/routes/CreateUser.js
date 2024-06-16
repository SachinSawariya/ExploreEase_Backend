
// import express from 'express';
// import {body, validationResult} from "express-validator";
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// import User from '../models/user.model.js';

// const jwtSecret = `${process.env.SECRET_KEY}`;

// const router = express.Router();

// router.post('/signup', 
//     [ body('fullname'),
//       body('mobileno').isLength({min:10, max:12}),
//       body('email').isEmail(),
//       body('password', "Password should be at least 6 characters long").isLength( { min: 6 } ) ],
   
//     async (req, res) => {

//         const errors = validationResult(req);

//         if(!errors.isEmpty()){
//             return res.status(422).json({ error : errors.array() });
//         }

//         const salt = await bcrypt.genSalt(10);
//         let hashPassword = await bcrypt.hash(req.body.password, salt);

//         try {
//             let userExist = await User.findOne({ email: req.body.email});
            
//             // If a user with the provided email already exists in our database we will send an error message back to the client
//             // If the user already exists in the database then send an error message to the client side
//             if (userExist != null) {
//                 return res.status(409).send("Conflict");
                

//             } else {
//                 // Create a new User object with data sent by the client and save it into the database
//                 await User.create({
//                     fullname: req.body.fullname,
//                     mobileno: req.body.mobileno,
//                     email: req.body.email,
//                     password: hashPassword
//                 })
//                 res.json({success: true, message:"User created successfully"})
//             }
            
//         } catch (error) {
//             console.log(error);
//             res.json({success: false});
//         }
//    }
// )


// // for login

// router.post('/login', 
//    [body('email').isEmail(),
//     body('password').not().isEmpty()],

//     async(req,res) => {
//         const errors = validationResult(req);

//         if(!errors.isEmpty()){
//             return res.status(422).json({ error : errors.array() });
//         }

//         let email = req.body.email;

//         try {
//             let userData = await User.findOne({email});

//             if(!userData){
//                 return res.status(400).json({errors: "Try Login with correct credentials"});
//             }

//             const pwdCompare = await bcrypt.compare(req.body.password, userData.password);

//             if(!pwdCompare){
//                 return res.status(400).json({errors: "Incorrect password!"});
//             }

//             const data = {
//                 user : {
//                     id : userData.id,
//                     name : userData.name
//                 }
//             }

//             const authToken = jwt.sign(data, jwtSecret);
//             return res.json({success: true, authToken: authToken});
            
//         } catch (error) {
//             console.log(error);
//             res.json({success: false});
//         }
//     }
// )


// export default router;