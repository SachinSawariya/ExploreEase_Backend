import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser, getUserProfile, updateUserAvatarImage, updateAccountDetails } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();


router.route('/signup').post( 
    upload.fields([
        {
            name: 'avatar', 
            maxCount: 1,
        },
    ]),
    registerUser 
)



router.route('/login').post(loginUser)

//secured routes

router.route('/logout').post(verifyJWT, logoutUser)  // verifyJWT- it is a middleware which works before the logout called
router.route('/user/profile').get(verifyJWT, getUserProfile);


router.route('/refresh-token').post(refreshAccessToken)

// Route to update user avatar image
router.post('/user/update-avatar', 
    verifyJWT, // Ensure authentication
    upload.single('avatar'), // Upload new avatar
    updateUserAvatarImage
);


router.route('/user/profile-update').post(verifyJWT, updateAccountDetails )

export default router;