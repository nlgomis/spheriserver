import mongoose from 'mongoose';

const artworkSchema = mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      thumbnailImage: {
        type: String,
        required: false,
      },
      artworkImages: {
        type: [String], // An array of paths to the artwork images
        required: false,
      },
      typeOfArtwork: {
        type: String,
        required: true,
      },
      softwareUsed: {
        type: [String], // An array of software names used in creating the artwork
      },
      likes: {
        type: Number,
        required: true,
        default: 0,
      },
      artist: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
    },
    {
      timestamps: true,
    }
  );

  const Artwork = mongoose.model('Artwork', artworkSchema);

export default Artwork;