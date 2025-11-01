import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'

export const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.adminToken
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No token provided',
      })
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    const admin = await Admin.findById(decoded.adminId).select('name email')

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      })
    }

    req.admin = admin // Attach full admin object
    next()
  } catch (error) {
    console.log('Auth error:', error.message)
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid token',
    })
  }
}