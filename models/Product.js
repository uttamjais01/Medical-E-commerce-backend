import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    imageUrl : {
        type : String ,
        required : true 
    },
    title : {
        type : String ,
        required : true 
    },
    description : {
        type : String ,
        required : true 
    },
    category : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'Category'
    },
    price : {
        type : Number ,
        required : true 
    },
    stock : {
        type : Number ,
        required : true 
    } 
},{
    timestamps: true 
})
const Product = mongoose.model('Product',productSchema)
export default Product 