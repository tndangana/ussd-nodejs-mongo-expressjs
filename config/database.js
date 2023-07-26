import { mongodb_uri } from './configuration.js';
import mongoose from 'mongoose';

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(mongodb_uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
};

export default connectToMongoDB;