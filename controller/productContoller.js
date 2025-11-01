import Product from '../models/Product.js';
import Category from '../models/Category.js';
import mongoose from 'mongoose';
import Order from '../models/Order.js'
import Cart from '../models/Cart.js'

export const createProduct = async (req, res) => {
  try {
    const { title, price, description, categoryName, stock } = req.body

    // ✅ Validate required fields
    if (!title || !price || !description || !categoryName || !stock) {
      return res.status(400).json({ error: 'All fields are required' })
    }
    console.log('Searching for category:', `"${categoryName}"`);
    

    // ✅ Find category by categoryName
  const normalizedCategory = categoryName.trim();
const categoryDoc = await Category.findOne({
  categoryName: new RegExp(`^${normalizedCategory}$`, 'i')
});

    console.log(categoryDoc);
    
    if (!categoryDoc) {
      return res.status(400).json({ 
        success : false ,
        message: `Category "${categoryName}" not found` })
    }

    // ✅ Handle image upload
    const imageUrl = req.file?.path
    if (!imageUrl) {
      return res.status(400).json({ error: 'Image upload failed or missing' })
    }
    console.log('🧾 Incoming Body:', req.body)
console.log('🖼️ Incoming File:', req.file)

    // ✅ Create product
    const newProduct = new Product({
      imageUrl,
      title,
      description,
      category: categoryDoc._id,
      price,
      stock
    })

    await newProduct.save()

    // ✅ Push product into category's product array
    categoryDoc.product.push(newProduct._id)
    await categoryDoc.save()

    res.status(201).json({ message: 'Product added successfully', product: newProduct })
  } catch (error) {
    console.error('Add product error:', error)
    res.status(500).json({ error: 'Internal server error', details: error.message })
  }
}

// ✅ Get product by ID
export const getProductById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid product ID format' })
    }

    const product = await Product.findById(req.params.id).populate('category', 'categoryName')
    if (!product) return res.status(404).json({ error: 'Product not found' })

    res.status(200).json(product)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product', details: error.message })
  }
}


// ✅ Update product
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product', details: error.message });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product', details: error.message });
  }
};

// ✅ Get products by category
export const getProductByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    const products = await Product.find({ category: categoryId }).populate('category', 'categoryName');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products by category', details: error.message });
  }
};


export const countproduct = async (req,res) => {
  try {
    const count = await Product.countDocuments()
    return res.status(200).json({
      success: true ,
      message: "All Products Fetched Successfully",
      totalProduct: count
    })
    
  } catch (error) {
    console.log('Error During Product Count', error.message)
    return res.status(500).json({
      success : false ,
      message: "Error During Count Products" ,
      error: error.message

    })
    
    
  }
}
export const countOrder = async (req,res)=>{
  try {
    const order = await Order.countDocuments()
    return res.status(200).json({
      success: true ,
      message: "All Order Fetched Successfully",
      totalOrder: count
    })
    
  } catch (error) {
    console.log('error During Count orders')
    return res.status(500).json({
      success: false ,
      message: 'Error During Count Orders',
      error: error.message
    })
    
    
  }
}
export const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'categoryName');
    res.status(200).json({
      success: true,
      message: 'All products fetched successfully',
      products
    });
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

// Add to Cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body
    const userId = req.user._id // assuming user is authenticated via middleware

    const product = await Product.findById(productId)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    const totalAmount = product.price * quantity

    // Check if item already exists in cart
    const existingCartItem = await Cart.findOne({ userId, productId })

    if (existingCartItem) {
      existingCartItem.quantity += quantity
      existingCartItem.totalAmount = existingCartItem.quantity * product.price
      await existingCartItem.save()
      return res.status(200).json({ message: 'Cart updated', cart: existingCartItem })
    }

    const newCartItem = new Cart({
      userId,
      productId,
      quantity,
      totalAmount
    })

    await newCartItem.save()
    res.status(201).json({ message: 'Added to cart', cart: newCartItem })
  } catch (error) {
    console.error('Add to cart error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Get Cart Items for User
export const getCartItems = async (req, res) => {
  try {
    const userId = req.user._id

    const cartItems = await Cart.find({ userId }).populate('productId')
    res.status(200).json({ cartItems })
  } catch (error) {
    console.error('Get cart error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Remove Item from Cart
export const removeFromCart = async (req, res) => {
  try {
    const { cartItemId } = req.params
    await Cart.findByIdAndDelete(cartItemId)
    res.status(200).json({ message: 'Item removed from cart' })
  } catch (error) {
    console.error('Remove cart error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const cartItems = await Cart.find({ userId }).populate('productId');
    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const products = cartItems.map(item => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price
    }));

    const totalAmount = cartItems.reduce((sum, item) => sum + item.totalAmount, 0);

    const newOrder = new Order({
      userId,
      products,
      totalAmount,
      status: 'Placed'
    });

    await newOrder.save();

    // Clear cart after placing order
    await Cart.deleteMany({ userId });

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


export const getAllOrder = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'Cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled' });
    }

    order.status = 'Cancelled';
    await order.save();

    res.status(200).json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch orders for the logged-in user
    const orders = await Order.find({ userId })
      .populate('products.productId', 'title price imageUrl') // optional: enrich product info
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No orders found for this user',
      });
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error('Error fetching user orders:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message,
    });
  }
};
