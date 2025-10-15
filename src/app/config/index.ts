import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  mongouri: process.env.MONGO_URI,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_secret: process.env.JWT_SECRET,
  sp: {
    sp_endpoint: process.env.SP_ENDPOINT,
    sp_username: process.env.SP_USERNAME,
    sp_password: process.env.SP_PASSWORD,
    sp_prefix: process.env.SP_PREFIX,
    sp_return_url: process.env.SP_RETURN_URL,
  },
  ssl: {
    store_id: process.env.SSL_STORE_ID,
    store_password: process.env.SSL_STORE_PASSWORD,
    is_live: process.env.SSL_IS_LIVE === 'true',
    success_url: process.env.SSL_SUCCESS_URL,
    fail_url: process.env.SSL_FAIL_URL,
    cancel_url: process.env.SSL_CANCEL_URL,
    ipn_url: process.env.SSL_IPN_URL,
  },
};

