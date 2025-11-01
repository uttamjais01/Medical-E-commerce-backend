import mongoose from "mongoose"

const connectDb = async () => {
    try {
    const mongoUrl = process.env.MONGODB
    console.log("mongodb url : " , mongoUrl)
    await mongoose.connect(mongoUrl , {
        useUnifiedTopology : true , 
        useNewUrlParser : true        
    })

    console.log("monodb connected");
}
     catch (error) {
        console.error("mongodb not connected");
        
        
    }
    
    
}
export default connectDb