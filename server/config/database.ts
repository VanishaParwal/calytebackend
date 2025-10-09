import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.log('⚠️  No MONGODB_URI environment variable set. Running without MongoDB.');
      console.log('   Add MONGODB_URI to connect to a MongoDB database.');
      return false;
    }
    
    await mongoose.connect(mongoURI);
    
    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.log('⚠️  Running without MongoDB. Some features may not persist data.');
    return false;
  }
};

export default connectDB;
