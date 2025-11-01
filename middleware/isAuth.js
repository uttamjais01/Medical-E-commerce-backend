import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const isAuth = async (req, res, next) => {
  const token = req.cookies.token // ✅ read from cookies

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' })
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    const user = await User.findById(decoded.userId).select('-password') // ✅ use userId from token

    if (!user) {
      return res.status(401).json({ error: 'Invalid token. User not found.' })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.', details: error.message })
  }
}