
  
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import authMiddleware from '../middlewares/authMiddleware.js';


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const userRegister = async (req, res) => {
  try {
    const { fullName, username, age, email, account, password, confirmPassword } = req.body;

 
    if (!fullName || !username || !age || !email || !account || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance and save to the database
    const newUser = new User({
      fullName,
      username,
      age,
      email,
      account,
      password: hashedPassword,
      confirmPassword: hashedPassword
    });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '4h' // Token expires in 1 hour
    });
console.log(token)
    // Set token as a cookie in the response
    res.cookie('token', token, { httpOnly: true, maxAge:  4 * 60 * 60 * 1000 }).status(201).json({
      success: true,
      message: 'User registered successfully',
      user: newUser
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error registering user' });
  }
};

export const userLogin = async (req, res) => {
  try {
 
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Incorrect email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect email or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '4h'
    });

    res.cookie('token', token, { httpOnly: true, maxAge:  4 * 60 * 60 * 1000 }).json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      "token":token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error logging in' });
  }
};


export const userLogout = async (req, res) => {
  try {
    const token = req.cookies.token; // Get the token from cookies

 
    if (!token) {
      return res.status(400).json({ success: false, message: 'No token found' });
    }

   
    res.clearCookie('token').status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error logging out' });
  }
};




export const userAuth = [authMiddleware];
