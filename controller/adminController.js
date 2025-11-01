import mongoose from "mongoose"
import Admin from "../models/Admin.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const registerAdmin = async (req,res) => {
    try {
        const {name , email , password}= req.body
        if(!name || !email || !password)
            return res.status(409).json({
                success : false ,
                message : "All field are required"
            })
        const user = await Admin.findOne({email})
        if(user)
            return res.status(400).json({
                success : false ,
                message : "email all ready registered"
            })
        const hashedPassword = await bcrypt.hash(password , 10)
        const newUser = await Admin.create({
            name ,
            email ,
            password : hashedPassword
        })
        return res.status(201).json({
            success : true ,
            message : " Admin created successfully"
        })
    } catch (error) {
        console.log('error during Admin registeration : ', error.message )
        return res.status(500).json({
            success : 'false' ,
            message : 'Error durin registration'
        })       
    }
}

export const loginAdmin = async (req,res) => {
    try {
        const {email , password} = req.body
        if(!email || !password)
            return res.status(400).json({
                success : false ,
                message : 'All field are required'
            })
            const admin = await Admin.findOne({email})
        if(!admin)
            return res.status(400).json({
                success: false ,
                message : "email not registered"
            })
        const isPasswordMatch = await bcrypt.compare(password , admin.password)
        if (!isPasswordMatch) 
            return res.status(400).json({
                success : false ,
                message: "password not match"
            })  
        const adminToken = await jwt.sign({adminId : admin._id }, process.env.SECRET_KEY ,{expiresIn: '1d'})
        return res.status(200).cookie('adminToken',adminToken ,{httpOnly : true , sameSite : 'strict' , maxAge : 24*60*60*1000 }).json({
            success: true ,
            message: `welcome back ${admin.name}` ,
            adminToken ,
            data : {
                name : admin.name ,
                email : admin.email

            }
        })
    } catch (error) {
        console.log("error during login",error.message)
        return res.status(500).json({
            success: false ,
            message: " error login"
        })
        
        
    }
}
export const logoutAdmin = async (req,res) => {
    try {
        return res.status(200).cookie('adminToken','', {maxAge: 0}).json({
            success: true ,
            message: 'Logout Successfully'
        })
        
    } catch (error) {
        console.log("logout error",'')
        return res.status(500).json({
            success: false ,
            message: 'Error During Logout '
        })
        
        
    }
}
