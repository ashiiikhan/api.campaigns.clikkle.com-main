import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_CONNECTION_STRING;

if (!MONGODB_URI) {
    console.error("MONGODB_CONNECTION_STRING is not defined in environment variables");
    process.exit(1);
}

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            retryWrites: true,
            w: 'majority'
        });
        console.log("MongoDB Atlas Connected Successfully");
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

// Connect to MongoDB
connectDB();

// Set Mongoose Options
mongoose.set("runValidators", true);

mongoose.Model.existsAll = async function (ids) {
    const counts = await this.count({ _id: { $in: ids } });
    return counts === ids.length;
};
