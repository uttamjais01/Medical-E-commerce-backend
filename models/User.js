import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : true ,
        trim : true
    },
    email : {
        type : String,
        required : true ,
        trim : true ,
        lowercase : true ,
        unique : true
    },
    address : {
        street : {
            type: String ,
            trim : true
        },
        city : {
            type : String ,
            trim : true
        },
        state : {
            type : String ,
            trim : true ,
        },
        zipCode : {
            type : String ,
            trim : true 
        },
        country : {
            type : String ,
            trim : true
        }


    },
    phoneNo : {
        type : String ,
        trim : true ,
       validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v); // Basic 10-digit check
            },
            message: props => `${props.value} is not a valid phone number!`
        }

    },
    password : {
        type: String ,
        minlength : 6 ,
        required : true
    }
}, {
    timestamps : true 
})
const User = mongoose.model('User',userSchema)
export default User 