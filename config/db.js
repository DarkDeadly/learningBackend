import mongoose from "mongoose"


const connectMongoDB = () => {
    try {
        mongoose.connect(process.env.MONGOURL)
        console.log("MongoDB connection successful!"); 
    } catch (error) {
       console.log("error occured connection to database" , err)
       process.exit(1);
    }
}

export default connectMongoDB