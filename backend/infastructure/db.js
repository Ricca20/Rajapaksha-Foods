import mongoose from "mongoose";


const connectDB = async () => {
    try{
        const connectionString = process.env.MONGO_URI;
        
        if (!connectionString) {
            console.log("MongoDB connection string is not defined in environment variables.");
            return;
        }

        await mongoose.connect(connectionString)
        console.log("MongoDB connected");

    }catch(err){
        console.error("MongoDB connection error:", err);
    }
}

export default connectDB;
