import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Medicine } from '../medicine/medicine.model';
import Order from './order.model';
import { orderUtils } from './order.utils';

const createOrder = async (
  user: { _id: string; name: string; email: string },
  payload: {
    products: { product: string; quantity: number }[];
    deliveryType: 'standard' | 'express';
  },
  client_ip: string,
) => {
  if (!payload?.products?.length)
    throw new AppError(httpStatus.NOT_ACCEPTABLE, 'Order is not specified');
  const products = payload.products;

  let totalPrice = 0;
  const productDetails = await Promise.all(
    products.map(async (item) => {
      const product = await Medicine.findById(item.product);
      if (product) {
        const price =
          product.discount && product.discount > 0
            ? product.price - product.discount
            : product.price;
        const subtotal = (price || 0) * item.quantity;
        totalPrice += parseFloat(subtotal.toFixed(2));
        return item;
      }
    }),
  );
  const deliveryCharge = payload.deliveryType === 'express' ? 6 : 3;
  totalPrice += deliveryCharge;
  totalPrice = parseFloat(totalPrice.toFixed(2));
  let order = await Order.create({
    user,
    products: productDetails,
    totalPrice,
    deliveryType: payload.deliveryType,
  });
  // payment integration
  const shurjopayPayload = {
    amount: totalPrice,
    order_id: order._id,
    currency: 'BDT',
    customer_name: user?.name,
    customer_email: user?.email,
    customer_address: 'Dhaka',
    customer_city: 'Dhaka',
    customer_phone: '01700000000',
    customer_post_code: '1212',
    client_ip,
  };

  const payment = await orderUtils.makePaymentAsync(shurjopayPayload);

  if (payment?.transactionStatus) {
    order = await order.updateOne({
      transaction: {
        id: payment.sp_order_id,
        transactionStatus: payment.transactionStatus,
      },
    });
  }

  return payment.checkout_url;
};

const orderRevenue = async () => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
      },
    },
  ]);

  return result[0]?.totalRevenue || 0;
};

// const getOrders = async () => {
//   const data = await Order.find();
//   return data;
// };

const getOrders = async (email?: string) => {
  let data = await Order.find().populate('user', 'email name').exec();

  if (email) {
    data = data.filter((order) => order.user?.email === email);
  }

  return data;
};

//upd
const updateOrderStatus = async (id: string, payload: { status: string }) => {
  const result = await Order.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found!');
  }

  return result;
};

const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

  if (verifiedPayment.length) {
    await Order.findOneAndUpdate(
      {
        'transaction.id': order_id,
      },
      {
        'transaction.bank_status': verifiedPayment[0].bank_status,
        'transaction.sp_code': verifiedPayment[0].sp_code,
        'transaction.sp_message': verifiedPayment[0].sp_message,
        'transaction.transactionStatus': verifiedPayment[0].transaction_status,
        'transaction.method': verifiedPayment[0].method,
        'transaction.date_time': verifiedPayment[0].date_time,
        status:
          verifiedPayment[0].bank_status == 'Success'
            ? 'Paid'
            : verifiedPayment[0].bank_status == 'Failed'
              ? 'Pending'
              : verifiedPayment[0].bank_status == 'Cancel'
                ? 'Cancelled'
                : '',
      },
    );
  }

  return verifiedPayment;
};

export const orderService = {
  createOrder,
  orderRevenue,
  verifyPayment,
  getOrders,
  updateOrderStatus,
};
