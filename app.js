import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./utils/db.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoute from "./routes/productRoutes.js";

dotenv.config();
const app = express();
const port = process.env.port || 3000;
connectDb();

// ✅ CORS setup
const allowedOrigins = [
  "http://localhost:5173",
  "https://medical-e-commerce-frontend-t4xx.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

// ✅ Handle preflight requests explicitly
app.options("*", cors(corsOptions));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Routes
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/product", productRoute);

// ✅ Server
app.listen(port, (error) => {
  if (error) console.log(error);
  console.log(`Server is listening on http://localhost:${port}`);
});