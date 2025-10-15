import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { orderService } from './order.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../errors/AppError';

const createOrder = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not found');
  }
  const userInfo = {
    _id: user.id,
    name: user.name,
    email: user.email,
  };
  const order = await orderService.createOrder(userInfo, req.body, req.ip!);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Order placed successfully',
    data: order,
  });
});

const orderRevenue = async (req: Request, res: Response) => {
  try {
    const result = await orderService.orderRevenue();
    res.send({
      message: 'Revenue calculated successfully',
      success: true,
      data: { totalRevenue: result },
    });
  } catch (error) {
    res.json(error);
  }
};

const getOrders = catchAsync(async (req, res) => {
  const email = req.query.email as string | undefined;
  const order = await orderService.getOrders(email);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Order retrieved successfully',
    data: order,
  });
});

//updating
const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const { status } = req.body;

  const result = await orderService.updateOrderStatus(id, { status });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order status updated successfully!',
    data: result,
  });
});

const verifyPayment = catchAsync(async (req, res) => {
  const order = await orderService.verifyPayment(req.query.order_id as string);

  sendResponse(res, {
    statusCode: 201,
    message: 'Order verified successfully',
    data: order,
  });
});

// Public verify endpoint (no auth required)
const verifyPaymentPublic = catchAsync(async (req, res) => {
  const orderId = req.query.order_id as string;
  console.log('Verifying payment for order:', orderId);

  if (!orderId) {
    return sendResponse(res, {
      statusCode: 400,
      message: 'Order ID is required',
      data: [],
    });
  }

  const order = await orderService.verifyPayment(orderId);

  sendResponse(res, {
    statusCode: 200,
    message: 'Order verified successfully',
    data: order,
  });
});

// IPN Handler for SSLCommerz
const paymentIPN = catchAsync(async (req, res) => {
  console.log('IPN Received:', req.body);
  const { tran_id, status, val_id } = req.body;

  if (tran_id) {
    await orderService.verifyPayment(tran_id);
  }

  res.status(200).send('IPN Received');
});

// Success redirect handler
const paymentSuccess = catchAsync(async (req, res) => {
  // SSLCommerz can send data via GET or POST
  const tran_id = req.query.tran_id || req.body.tran_id || req.query.val_id || req.body.val_id;
  const status = req.query.status || req.body.status;

  console.log('Payment Success - Query:', req.query);
  console.log('Payment Success - Body:', req.body);
  console.log('Payment Success - Extracted:', { tran_id, status });

  if (!tran_id) {
    return res.redirect('http://localhost:3000/cart/payment?error=no_transaction_id');
  }

  // Update order status
  try {
    await orderService.verifyPayment(tran_id);
  } catch (error) {
    console.error('Error verifying payment:', error);
  }

  // Redirect to frontend with parameters
  const redirectUrl = `http://localhost:3000/cart/payment?tran_id=${tran_id}&status=success`;
  res.redirect(redirectUrl);
});

// Fail redirect handler
const paymentFail = catchAsync(async (req, res) => {
  const tran_id = req.query.tran_id || req.body.tran_id || req.query.val_id || req.body.val_id;
  const status = req.query.status || req.body.status;

  console.log('Payment Failed - Query:', req.query);
  console.log('Payment Failed - Body:', req.body);
  console.log('Payment Failed - Extracted:', { tran_id, status });

  if (!tran_id) {
    return res.redirect('http://localhost:3000/cart/payment?error=no_transaction_id&status=failed');
  }

  const redirectUrl = `http://localhost:3000/cart/payment?tran_id=${tran_id}&status=failed`;
  res.redirect(redirectUrl);
});

// Cancel redirect handler
const paymentCancel = catchAsync(async (req, res) => {
  const tran_id = req.query.tran_id || req.body.tran_id || req.query.val_id || req.body.val_id;
  const status = req.query.status || req.body.status;

  console.log('Payment Cancelled - Query:', req.query);
  console.log('Payment Cancelled - Body:', req.body);
  console.log('Payment Cancelled - Extracted:', { tran_id, status });

  if (!tran_id) {
    return res.redirect('http://localhost:3000/cart/payment?error=no_transaction_id&status=cancelled');
  }

  const redirectUrl = `http://localhost:3000/cart/payment?tran_id=${tran_id}&status=cancelled`;
  res.redirect(redirectUrl);
});

export const orderController = {
  createOrder,
  orderRevenue,
  verifyPayment,
  verifyPaymentPublic,
  getOrders,
  updateOrderStatus,
  paymentIPN,
  paymentSuccess,
  paymentFail,
  paymentCancel,
};
