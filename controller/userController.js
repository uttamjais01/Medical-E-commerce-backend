import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from '../models/User.js'

 export const signUp = async (req,res) => {
    try {  
    const { name , email , password } = req.body 
    if(!email || !name || !password) 
        return res.status(400).json({
                message : 'All Field are Required',
                success : false

          })
    const user = await User.findOne({email})
    if(user)
        return res.status(409).json({
    success : false ,
    message : 'User all ready registered'
    })
    const hashedPassword = await bcrypt.hash(password ,10)
    const newUser = await User.create({
        name ,
        email ,
        password : hashedPassword
    })
    return res.status(201).json({
        success: true ,
        message: "user registered successfully"
    })
    } catch (error) {
        console.log('error during signUp : ',error.message)
        return res.status(500).json({
            success: false ,
            message: "error during registration"
        })
        
        
    }
}

export const login = async (req,res) => {
    try {
        const { email , password } = req.body
        if(!email || !password)
            return res.status(400).json({
        success : false ,
        message : "all fields are required "
        })
        const user = await User.findOne({email})
        if(!user)
            return res.status(409).json({
        success : false ,
        message : "User not registered"
    })
    const isPasswordMatch = await bcrypt.compare(password , user.password)
    if(!isPasswordMatch)
        return res.status(400).json({
    success : false ,
    message : 'Password not match'
    })
    const token =  jwt.sign({userId : user._id}, process.env.SECRET_KEY , {expiresIn : '1d'})
    return res.status(200).cookie('token',token , {httpOnly :true, secure: false,sameSite: 'lax', maxAge : 24*60*60*1000}).json({
        success: true ,
        message : `Welcome Back ${user.name}`,
        token ,
        data : {
            name : user.name ,
            email : user.email ,   
        }
    })

        
    } catch (error) {
        console.log("error during login",error.message)
        return res.status(500).json({
            success: false ,
            message: " error during login"
        })
        
        
    }
}
export const getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments()
    return res.status(200).json({
      success: true,
      totalUsers: count ,
       message: 'User count fetched successfully'

    })
  } catch (error) {
    console.log('Error fetching user count:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user count' ,
      error: error.message
    })
  }
}



