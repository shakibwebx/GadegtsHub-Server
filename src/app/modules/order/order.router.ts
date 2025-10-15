import { Router } from 'express';
import { orderController } from './order.controller';
import auth from '../../middlewares/auth';

const orderRouter = Router();
enum UserRole {
  user = 'user',
  admin = 'admin',
}

// Payment callback routes (no auth required - called by SSLCommerz)
orderRouter.post('/payment/ipn', orderController.paymentIPN);
orderRouter.post('/payment/success', orderController.paymentSuccess);
orderRouter.post('/payment/fail', orderController.paymentFail);
orderRouter.post('/payment/cancel', orderController.paymentCancel);

// Also support GET for success/fail/cancel (SSLCommerz may use GET)
orderRouter.get('/payment/success', orderController.paymentSuccess);
orderRouter.get('/payment/fail', orderController.paymentFail);
orderRouter.get('/payment/cancel', orderController.paymentCancel);

// Public verify endpoint (no auth required - for frontend)
orderRouter.get('/verify-public', orderController.verifyPaymentPublic);

// Protected verify endpoint (with auth)
orderRouter.get('/verify', auth(UserRole.user), orderController.verifyPayment);

orderRouter
  .route('/')
  .post(auth(UserRole.user), orderController.createOrder)
  .get(auth(UserRole.user, UserRole.admin), orderController.getOrders);

orderRouter
  .route('/:id')
  .put(auth(UserRole.admin), orderController.updateOrderStatus);

export default orderRouter;
