import mongoose from'mongoose';
import { DatabaseName } from '../constance.js';

// Connect to MongoDB
const connectDB = async () => {
    try {
        
        const connectInstance = await mongoose.connect(`mongodb+srv://manoj:manoj1@cluster.kuyvi.mongodb.net/${DatabaseName}`); 
        console.log(`MongoDB connected successfully to ${DatabaseName}`);
        // console.log('DB Host: ' + connectInstance.connection.host);
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    }
};

export  {connectDB};
