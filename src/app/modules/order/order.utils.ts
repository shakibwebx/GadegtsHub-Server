import SSLCommerzPayment from 'sslcommerz-lts';
import config from '../../config';

const sslcommerz = new SSLCommerzPayment(
  config.ssl.store_id!,
  config.ssl.store_password!,
  config.ssl.is_live!,
);

interface PaymentPayload {
  amount: number;
  order_id: string;
  currency: string;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  customer_city: string;
  customer_phone: string;
  customer_post_code: string;
  client_ip: string;
}

interface SSLCommerzResponse {
  status: string;
  GatewayPageURL?: string;
  failedreason?: string;
}

interface VerificationResponse {
  status: string;
  tran_id: string;
  val_id: string;
  amount: string;
  card_type: string;
  store_amount: string;
  card_no: string;
  bank_tran_id: string;
  card_issuer: string;
  card_brand: string;
  card_issuer_country: string;
  card_issuer_country_code: string;
  currency_type: string;
  currency_amount: string;
  currency_rate: string;
  verify_sign: string;
  verify_key: string;
  risk_title: string;
  risk_level: string;
  bank_status?: string;
  sp_code?: string;
  sp_message?: string;
  transaction_status?: string;
  method?: string;
  date_time?: string;
  error?: string;
}

const makePaymentAsync = async (
  paymentPayload: PaymentPayload,
): Promise<{ checkout_url: string; transactionStatus: string; sp_order_id: string }> => {
  const data = {
    total_amount: paymentPayload.amount,
    currency: paymentPayload.currency || 'BDT',
    tran_id: paymentPayload.order_id.toString(),
    success_url: config.ssl.success_url || 'http://localhost:3000/cart/payment',
    fail_url: config.ssl.fail_url || 'http://localhost:3000/cart/payment',
    cancel_url: config.ssl.cancel_url || 'http://localhost:3000/cart/payment',
    ipn_url: config.ssl.ipn_url,
    shipping_method: 'Courier',
    product_name: 'Gadgets Hub Products',
    product_category: 'Electronics',
    product_profile: 'general',
    cus_name: paymentPayload.customer_name,
    cus_email: paymentPayload.customer_email,
    cus_add1: paymentPayload.customer_address,
    cus_add2: paymentPayload.customer_address,
    cus_city: paymentPayload.customer_city,
    cus_state: paymentPayload.customer_city,
    cus_postcode: paymentPayload.customer_post_code,
    cus_country: 'Bangladesh',
    cus_phone: paymentPayload.customer_phone,
    cus_fax: paymentPayload.customer_phone,
    ship_name: paymentPayload.customer_name,
    ship_add1: paymentPayload.customer_address,
    ship_add2: paymentPayload.customer_address,
    ship_city: paymentPayload.customer_city,
    ship_state: paymentPayload.customer_city,
    ship_postcode: paymentPayload.customer_post_code,
    ship_country: 'Bangladesh',
  };

  const response: SSLCommerzResponse = await sslcommerz.init(data);

  if (response.status !== 'SUCCESS') {
    throw new Error(response.failedreason || 'Payment initiation failed');
  }

  return {
    checkout_url: response.GatewayPageURL || '',
    transactionStatus: 'Pending',
    sp_order_id: paymentPayload.order_id.toString(),
  };
};

const verifyPaymentAsync = async (
  tran_id: string,
): Promise<VerificationResponse[]> => {
  const response = await sslcommerz.validate({
    val_id: tran_id,
  });

  return [response as VerificationResponse];
};

export const orderUtils = {
  makePaymentAsync,
  verifyPaymentAsync,
};
