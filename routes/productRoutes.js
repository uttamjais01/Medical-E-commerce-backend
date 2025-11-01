import express from 'express'
import { addToCart, cancelOrder, countOrder, countproduct, createProduct, deleteProduct, getAllOrder, getAllProduct, getCartItems, getMyOrders, getProductByCategory, getProductById, placeOrder, removeFromCart, updateProduct } from '../controller/productContoller.js'
import { isAdmin } from '../middleware/isAdmin.js'
import {isAuth} from '../middleware/isAuth.js'
import upload from '../middleware/upload.js'

const router = express.Router()

router.route('/').get(getAllProduct)
router.route('/add').post( upload.single('imageUrl') , createProduct)
router.route('/update/:id').put( upload.single('imageUrl') , updateProduct)
router.route('/delete/:id').delete(deleteProduct)
router.route('/getProduct/:id').get(getProductById)
router.route('/category/:categoryId').get(getProductByCategory)
router.route('/countProduct').get(countproduct)
router.route('/countOrder').get(countOrder)
router.route('/cart').post(isAuth , addToCart)
router.route('/cart/items').get(isAuth, getCartItems)
router.route('/cart/:id').delete(removeFromCart)
router.route('/place').post(placeOrder)
router.route('/cancel/:orderId').put(cancelOrder)
router.route('/order').get(getMyOrders)

export default router