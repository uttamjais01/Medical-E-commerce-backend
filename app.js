import express from "express"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import cors from 'cors'
import connectDb from "./utils/db.js"
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import productRoute from './routes/productRoutes.js'

const app = express()
dotenv.config()
const port = process.env.port || 3000
connectDb()

app.use(express.json())
app.use(express.urlencoded({ extended : true}))
app.use(cookieParser())

const corsOption = {
    origin : "http://localhost:5173",
    credentials : true
}
app.use(cors(corsOption))

app.use('/user',userRoutes)
app.use('/admin',adminRoutes)
app.use('/product',productRoute)


app.listen(port , (error)=>{
    if(error)
        console.log(error)
    console.log(`server is listening on http://localhost:${port}`)    
})