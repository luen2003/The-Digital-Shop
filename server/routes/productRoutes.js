import express from 'express'
const router = express.Router()
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  getAllProducts
} from '../controllers/productController.js'
import { protect, admin, isSeller } from '../middleware/authMiddleware.js'
import Product from '../models/productModel.js'

router.get('/allProducts', getAllProducts);
router.get('/admin/productlist', protect, admin, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Route for getting products and creating products (admin or seller)
router.route('/')
  .get(getProducts)
  .post(protect, (req, res, next) => {
    // Allow either admin or seller to create a product
    if (req.user && (req.user.isAdmin || req.user.role === 'seller')) {
      return next()
    }
    res.status(401)
    throw new Error('Not authorized as admin or seller')
  }, createProduct) // Proceed to createProduct if authorized

// Route for product reviews
router.route('/:id/reviews').post(protect, createProductReview)

// Route for top products
router.get('/top', getTopProducts)

// Route for individual product actions (view, delete, update)
router.route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, (req, res, next) => {
    // Allow either admin or seller to create a product
    if (req.user && (req.user.isAdmin || req.user.role === 'seller')) {
      return next()
    }
    res.status(401)
    throw new Error('Not authorized as admin or seller')
  }, updateProduct)

  
export default router
