import asyncHandler from 'express-async-handler'
import Artwork from '../models/artworkModel.js';
import User from '../models/userModel.js';
import e from 'express';

// @desc    Upload a new artwork
// @route   POST /api/artworks/upload
// @access  Public
const uploadArtwork = asyncHandler(async (req, res) => {
  console.log('uploadArtwork')
    console.log(req.body)
    console.log(req.files)  
   
    const { artworkName, artworkDetails, artworkType, softwareUsed, artist} = req.body;
   const {thumbnail, artworkImages} = req.files;
    // Check if the required fields are present in the request body.
   if (!artworkName || !thumbnail || !artworkDetails || !artworkImages || !artworkType || !softwareUsed) {
    res.status(400).json({ message: "Please fill all fields" });
    return;
}
try {
  // Convert thumbnail and artworkImages to Buffer
  const thumbnailBuffer = thumbnail[0].buffer;
  console.log(thumbnailBuffer)
  const artworkImagesBuffer = artworkImages.map(image => image.buffer);
  console.log('a',artworkImagesBuffer)
  const artwork = await Artwork.create({
    title: artworkName,
    description: artworkDetails,
    thumbnailImage: thumbnailBuffer,
   artworkImages: artworkImagesBuffer,
    typeOfArtwork: artworkType,
    softwareUsed: softwareUsed,
    likes: 0,
    artist: artist,
  });

  if (artwork) {
    console.log('artwork')
    console.log(artist);

    await User.findByIdAndUpdate(artist, { $push: { artworks: artwork._id } });

    res.status(201).json({
      _id: artwork._id,
      title: artwork.title,
    });


  } else {
    res.status(400);
    throw new Error('Invalid artwork data');
  }
} catch (error) {
  console.error(error);
  res.status(500).json({ message: "Server Error" });
}
  });

// @desc    Get all the arworks but not their artworkImages
// @route   GET /api/artworks/getArtworkList
// @access  Public
const getArtworkList = asyncHandler(async (req, res) => {
try {
  const artworks = await Artwork.find({}).select('-artworkImages');
  res.json(artworks);
} catch (error) {
  console.error(error);
  res.status(500).json({ message: "Server Error" });
}
});

// @desc    Get all the info about a single artwork by id
// @route   GET /api/artworks/getArtworkById/:id
// @access  Public
const getArtworkById = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id; 
    console.log('id', id);
    const artwork = await Artwork.findById(id);
    console.log(artwork);
    if (artwork) {
      res.json(artwork);
    } else {
      res.status(404).json({ message: "Artwork not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export { uploadArtwork, getArtworkList, getArtworkById };