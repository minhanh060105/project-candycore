import express from 'express';
import * as auth from '../controllers/authController.js';
import * as product from '../controllers/productController.js';
import * as order from '../controllers/orderController.js';
import { protectedRoute, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Auth
router.post('/api/auth/signup', auth.signUp);
router.post('/api/auth/signin', auth.signIn);
router.post('/api/auth/signout', auth.signOut);
router.post('/api/auth/refresh', auth.refreshToken);
router.get('/api/auth/me', protectedRoute, auth.getMe);

// Products (public)
router.get('/api/products', product.getAll);
router.get('/api/products/:id', product.getById);

// Products (admin only)
router.post('/api/products', protectedRoute, adminOnly, product.create);
router.put('/api/products/:id', protectedRoute, adminOnly, product.update);
router.delete('/api/products/:id', protectedRoute, adminOnly, product.remove);

// Orders
router.post('/api/orders', protectedRoute, order.createOrder);
router.get('/api/orders/my', protectedRoute, order.getMyOrders);
router.get('/api/orders', protectedRoute, adminOnly, order.getAllOrders);
router.put('/api/orders/:id/status', protectedRoute, adminOnly, order.updateOrderStatus);

export default router;
