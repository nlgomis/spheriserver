import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';


// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register user & get token
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  console.log('registerUser')
    console.log(req.body)
    const { username, email, password } = req.body;
   // Check if the required fields are present in the request body.
   if (!username || !email || !password) {
    res.status(400).json({ message: "Please provide username, email, and password." });
    return;
}
    const userExists = await User.findOne({ email });
  
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }
  
    const user = await User.create({
      username,
      email,
      password,
    });
  
    if (user) {
      generateToken(res, user._id);
  
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  });

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
const updateUserProfile = asyncHandler(async (req, res) => {
    res.status(200).json({message: 'Update User'})
})

// @desc    Get artist profile
// @route   GET /api/users/getUserById/:id
// @access  Public
const getUserById = asyncHandler(async (req, res) => {
  const artist = await User.findById(req.params.id).select('-password');

  if (artist) {
    res.json(artist);
  } else {
    res.status(404);
    throw new Error('Artist not found');
  }
});

export {
    authUser, registerUser, logoutUser, getUserProfile, updateUserProfile, getUserById
}