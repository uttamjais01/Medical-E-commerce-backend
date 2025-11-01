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
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://medical-e-commerce-frontend-t4xx.vercel.app"
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
};

app.use(cors(corsOption));
app.options('*', cors(corsOption));

app.use('/user',userRoutes)
app.use('/admin',adminRoutes)
app.use('/product',productRoute)


app.listen(port , (error)=>{
    if(error)
        console.log(error)
    console.log(`server is listening on http://localhost:${port}`)    
})