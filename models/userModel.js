import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
    {
      username: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      address: {
        type: String,
      },
      title: {
        type: String,
      },
      skills: {
        type: [String], // An array of skills (strings)
      },
      softwares: {
        type: [String], // An array of software names
      },
      following: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // An array of user IDs the user is following
      },
      followers: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // An array of user IDs who are following the user
      },
      likes: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artwork' }], // An array of artwork IDs that the user likes
      },
      artworks: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artwork' }], // An array of user's own artwork IDs
      },
    },
    {
      timestamps: true,
    }
  );
  

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;