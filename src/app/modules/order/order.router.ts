import { Router } from 'express';
import { orderController } from './order.controller';
import auth from '../../middlewares/auth';

const orderRouter = Router();
enum UserRole {
  user = 'user',
  admin = 'admin',
}

orderRouter.get('/verify', auth(UserRole.user), orderController.verifyPayment);

orderRouter
  .route('/')
  .post(auth(UserRole.user), orderController.createOrder)
  .get(auth(UserRole.user, UserRole.admin), orderController.getOrders);

orderRouter
  .route('/:id')
  .put(auth(UserRole.admin), orderController.updateOrderStatus);

// orderRouter.get('/', orderController.getOrders);
// orderRouter.put('/:id', orderController.updateOrderStatus);

export default orderRouter;
