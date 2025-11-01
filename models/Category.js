import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
    categoryName : {
        type : String ,
        enum : ['Skin Therapy','Vitamin B12','Women Care','Health Care','Beauty Care','Skin Care','Baby Care','Hair Care','Oral Care','Medicine'],
        
        default : "Medicine" ,
        trim: true
    },
    product : [{
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'Product',
        required : true
    }]
    
},{
    timestamps: true 
})
const Category = mongoose.model('Category',categorySchema)
export default Category