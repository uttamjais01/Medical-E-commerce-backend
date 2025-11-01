// routes/adminRoutes.js
import express from 'express';
import { registerAdmin, loginAdmin , logoutAdmin } from '../controller/adminController.js';
import { isAdmin } from '../middleware/isAdmin.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.route('/').post(registerAdmin);
router.route('/login').post(loginAdmin);
router.route('/logout').get(logoutAdmin)
export default router;