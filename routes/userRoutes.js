import express from 'express'
import {signUp , login , getUserCount} from '../controller/userController.js'

const router = express.Router()

router.route('/').post(signUp)
router.route('/login').post(login)
router.route('/count').get(getUserCount)


export default router
