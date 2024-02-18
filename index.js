import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import mongoose from 'mongoose';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
import { notFound, errorHandler} from './middleware/errorMiddleware.js'
// Create an Express application


const app = express();
app.use(express.json());
import cookieParser from 'cookie-parser';
app.use(cookieParser());

import userRoutes from './routes/userRoutes.js';
import artworkRoutes from './routes/artworkRoutes.js';
import connectDB from './config/db.js';



const port = process.env.PORT || 3030;
connectDB();

// Enable CORS
 app.use(cors({
    origin: ['https://spheriart.vercel.app', 'http://localhost:3000'],
    credentials: true
  }));

app.use('/api/users', userRoutes);
app.use('/api/artwork', artworkRoutes);

app.use(notFound);
app.use(errorHandler);


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
