import asyncHandler from 'express-async-handler'
import Artwork from '../models/artworkModel.js';
import User from '../models/userModel.js';
import e from 'express';
import path from 'path';
import dotenv from 'dotenv';

import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
dotenv.config();


// @desc    Upload a new artwork
// @route   POST /api/artworks/upload
// @access  Public


// Configure AWS with your access and secret key.
const { ACCESS_KEY, SECRET_KEY, BUCKET_NAME, REGION } = process.env;
AWS.config.update({
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
  region: REGION
});

const s3 = new AWS.S3();

const uploadArtwork = asyncHandler(async (req, res) => {
  console.log('uploadArtwork')
  console.log(req.body)
  console.log(req.files)  

  const { artworkName, artworkDetails, artworkType, softwareUsed, artist} = req.body;
  const {thumbnail, artworkImages} = req.files;

  if (!artworkName || !thumbnail || !artworkDetails || !artworkImages || !artworkType || !softwareUsed) {
    res.status(400).json({ message: "Please fill all fields" });
    return;
  }

  try {
    // Upload thumbnail and artworkImages to S3 and get the URLs
    const thumbnailExtension = path.extname(req.files.thumbnail[0].originalname);
    const thumbnailKey = `${uuidv4()}${thumbnailExtension}`;
    const thumbnailParams = {
      Bucket: BUCKET_NAME,
      Key: thumbnailKey,
      Body: thumbnail[0].buffer,
      ACL: 'public-read',
      ContentType: 'image/jpeg'

    };

    const thumbnailUpload = await s3.upload(thumbnailParams).promise();
    const thumbnailUrl = thumbnailUpload.Location;

    const artworkImagesUrls = [];
    for (let i = 0; i < artworkImages.length; i++) {
      const artworkExtension = path.extname(req.files.artworkImages[i].originalname);
      const artworkImageKey = `${uuidv4()}${artworkExtension}`;     
      const artworkImageParams = {
        Bucket: BUCKET_NAME,
        Key: artworkImageKey,
        Body: artworkImages[i].buffer,
        ACL: 'public-read',
        ContentType: 'image/jpeg'
      };
    
      const artworkImageUpload = await s3.upload(artworkImageParams).promise();
      artworkImagesUrls.push(artworkImageUpload.Location);
    }
    

    const artwork = await Artwork.create({
      title: artworkName,
      description: artworkDetails,
      thumbnailImage: thumbnailUrl,
      artworkImages: artworkImagesUrls,
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