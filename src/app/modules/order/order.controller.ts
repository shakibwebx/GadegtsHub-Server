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

export const orderController = {
  createOrder,
  orderRevenue,
  verifyPayment,
  getOrders,
  updateOrderStatus,
};
