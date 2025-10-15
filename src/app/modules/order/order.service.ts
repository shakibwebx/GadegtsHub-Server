import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Product } from '../products/product.model';
import Order from './order.model';
import { orderUtils } from './order.utils';

const createOrder = async (
  user: { _id: string; name: string; email: string },
  payload: {
    products: { product: string; quantity: number }[];
    deliveryType: 'standard' | 'express';
    shippingInfo?: {
      fullName: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      zipCode: string;
      country: string;
    };
  },
  client_ip: string,
) => {
  if (!payload?.products?.length)
    throw new AppError(httpStatus.NOT_ACCEPTABLE, 'Order is not specified');
  const products = payload.products;

  let totalPrice = 0;
  const productDetails = await Promise.all(
    products.map(async (item) => {
      const product = await Product.findById(item.product);
      if (product) {
        // Calculate discounted price (discount is percentage)
        const price =
          product.discount && product.discount > 0
            ? product.price - (product.price * product.discount / 100)
            : product.price;
        const subtotal = (price || 0) * item.quantity;
        totalPrice += parseFloat(subtotal.toFixed(2));
        return item;
      }
    }),
  );
  const deliveryCharge = payload.deliveryType === 'express' ? 6 : 3;
  const tax = totalPrice * 0.05; // 5% tax
  totalPrice = totalPrice + deliveryCharge + tax;
  totalPrice = parseFloat(totalPrice.toFixed(2));
  let order = await Order.create({
    user,
    products: productDetails,
    totalPrice,
    deliveryType: payload.deliveryType,
  });
  // payment integration with SSLCommerz
  const sslPayload = {
    amount: totalPrice,
    order_id: (order._id as any).toString(),
    currency: 'BDT',
    customer_name: payload.shippingInfo?.fullName || user?.name,
    customer_email: payload.shippingInfo?.email || user?.email,
    customer_address: payload.shippingInfo?.address || 'Dhaka',
    customer_city: payload.shippingInfo?.city || 'Dhaka',
    customer_phone: payload.shippingInfo?.phone || '01700000000',
    customer_post_code: payload.shippingInfo?.zipCode || '1212',
    client_ip,
  };

  const payment = await orderUtils.makePaymentAsync(sslPayload);

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
  let order = null;

  // First, try to find the order by transaction.id (tran_id)
  try {
    order = await Order.findOne({ 'transaction.id': order_id }).populate('user', 'name email');
  } catch (err) {
    console.log('Error finding by transaction.id:', err);
  }

  // If not found and order_id looks like a valid MongoDB ObjectId, try to find by _id
  if (!order && order_id.match(/^[0-9a-fA-F]{24}$/)) {
    try {
      order = await Order.findById(order_id).populate('user', 'name email');
    } catch (err) {
      console.log('Error finding by _id:', err);
    }
  }

  if (!order) {
    console.log('Order not found for ID:', order_id);
    return [];
  }

  // Try to verify with SSLCommerz
  try {
    const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

    if (verifiedPayment.length && verifiedPayment[0]) {
      // Check if this is an invalid or test transaction
      const isInvalidTransaction = verifiedPayment[0].status === 'INVALID_TRANSACTION';

      if (!isInvalidTransaction) {
        // Update order with verified payment info
        await Order.findOneAndUpdate(
          { 'transaction.id': order_id },
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

        return verifiedPayment;
      }
      // If invalid transaction, fall through to return order data
    }
  } catch (error) {
    console.error('SSLCommerz verification failed:', error);
  }

  // If SSLCommerz verification fails or in test mode, return order data
  return [
    {
      status: order.status,
      tran_id: order.transaction?.id || order_id,
      val_id: order_id,
      amount: order.totalPrice?.toString() || '0',
      card_type: '',
      store_amount: order.totalPrice?.toString() || '0',
      card_no: '',
      bank_tran_id: order.transaction?.id || '',
      card_issuer: '',
      card_brand: '',
      card_issuer_country: '',
      card_issuer_country_code: '',
      currency_type: 'BDT',
      currency_amount: order.totalPrice?.toString() || '0',
      currency_rate: '1',
      verify_sign: '',
      verify_key: '',
      risk_title: 'Test',
      risk_level: '0',
      bank_status: order.transaction?.bank_status || 'Success',
      sp_code: order.transaction?.sp_code || '',
      sp_message: order.transaction?.sp_message || '',
      transaction_status: order.transaction?.transactionStatus || 'Pending',
      method: order.transaction?.method || 'Test Payment',
      date_time: order.createdAt ? new Date(order.createdAt).toLocaleString() : new Date().toLocaleString(),
      // Additional fields for frontend display
      order_id: (order._id as any).toString(),
      name: order.user?.name || 'Customer',
      currency: 'BDT',
      card_holder_name: order.user?.name || '',
      card_number: '',
      phone_no: '',
    } as any,
  ];
};

export const orderService = {
  createOrder,
  orderRevenue,
  verifyPayment,
  getOrders,
  updateOrderStatus,
};
