import mongoose from "mongoose";
import "dotenv/config";

export const DB_CONNECT = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('💽 Database connected');
    } catch (error) {
        console.error('Database connection error:', error);
    }
};

export const DB_DISCONNECT = async () => {
    try {
        await mongoose.disconnect();
        console.log('💽 Database disconnected');
    } catch (error) {
        console.error('Database disconnection error:', error);
    }
};


