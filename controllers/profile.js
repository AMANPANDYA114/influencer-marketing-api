import jwt from 'jsonwebtoken';
import User from '../models/user.js';

import UserProfile from '../models/profile .js';
import cloudinary from '../utils/cloudinary.js';
import upload from '../middlewares/multer.js';

// // Upload user's profile picture
export const uploadProfilePic = (req, res) => {
  console.log('Request headers:', req.headers); // Log request headers for debugging
  console.log('Request cookies:', req.cookies); 
  upload.single('image')(req, res, async function (err) {
    if (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: 'Error uploading file' });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      const imageUrl = result.secure_url;

      // Update user's profile with the image URL
      const decodedToken = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      const userId = decodedToken.userId;

      const updatedProfile = await UserProfile.findOneAndUpdate(
        { userId: userId },
        { profilePicUrl: imageUrl },
        { new: true, upsert: true }
      );

      if (!updatedProfile) {
        console.log("Profile image URL not saved to database");
        return res.status(404).json({ success: false, message: 'Profile not found' });
      }
      
      console.log("Profile image URL saved to database");

      res.status(200).json({ success: true, message: 'Profile picture uploaded successfully', user: updatedProfile });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Error uploading profile picture' });
    }
  });
};




// // Update user's profile
export const updateUserProfile = async (req, res) => {
  try {
    const { fullName, username, profilePicUrl } = req.body;
    const token = req.cookies.token; // Get the token from cookies

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
  
    // Update the UserProfile model
    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { fullName, username, profilePicUrl },
      { new: true, upsert: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    // Update the User model
    
    const updatedUser = await User.findByIdAndUpdate(userId, { fullName, username, profilePicUrl }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'Profile updated successfully', user: updatedProfile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error updating profile' });
  }
};


// Get user's profile including profile picture URL
export const getUserProfile = async (req, res) => {
  try {
    const token = req.cookies.token; // Get the token from cookies

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Fetch user profile from the UserProfile model
    const userProfile = await UserProfile.findOne({ userId });

    if (!userProfile) {
      return res.status(404).json({ success: false, message: 'User profile not found' });
    }

    // Return user details including the profile picture URL
    const { fullName, username, profilePicUrl } = userProfile;
    res.status(200).json({ success: true, user: { fullName, username, profilePicUrl } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error fetching profile' });
  }
};



