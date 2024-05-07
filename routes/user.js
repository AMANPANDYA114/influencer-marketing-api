
import express from 'express';


import { userRegister } from '../controllers/user.js';
import { userLogin } from '../controllers/user.js';
import { userLogout } from '../controllers/user.js';
import { resetpassword } from '../controllers/passswordreset.js';
import { otpGenerate } from '../controllers/otp.js';
import { varifyotp } from '../controllers/otp.js';
import { uploadProfilePic,getUserProfile,updateUserProfile,uploadBackgroundImage } from '../controllers/profile.js';
import { getCategories } from '../controllers/categories.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const router = express.Router();


router.post('/register', userRegister );
router.post('/login',userLogin);
router.get('/logout',userLogout);
router.post('/reset-password', resetpassword)
router.post('/generate-otp',otpGenerate);
router.post('/verify-otp', varifyotp);
router.get('/v1/categories', getCategories);
router.put("/profile/update",authMiddleware,updateUserProfile)
router.get("/profile",authMiddleware,getUserProfile)
router.post("/profile/upload",authMiddleware,uploadProfilePic)
router.post("/profile/cover",authMiddleware,uploadBackgroundImage)
export default router;
