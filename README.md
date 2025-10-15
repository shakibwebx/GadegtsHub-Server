# ⚙️ Gadgets Hub – Server (Backend)

**Live API Endpoint:** [https://gadget-server-omega.vercel.app/](https://gadget-server-omega.vercel.app/)

This is the **backend server** for the Gadgets Hub E-Commerce Store. Built with **Node.js**, **Express.js**, and **MongoDB**, it provides all RESTful APIs for managing users, products, orders, payments, and role-based access control.

---

## 🛠 Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **Authentication:** JWT + NextAuth integration
- **Payment Gateway:** SSLCommerz
- **File Upload:** Multer
- **Deployment:** Vercel (Serverless functions)

---

## 📦 Key Features

### Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Social login support (Google, GitHub)
- ✅ Role-based access control (Admin, User)
- ✅ Secure password hashing with bcrypt

### Product Management
- ✅ CRUD operations for products
- ✅ Advanced filtering (price, category, type, stock, symptoms)
- ✅ Search functionality
- ✅ Pagination and sorting
- ✅ Discount management
- ✅ Image upload support

### Order & Payment
- ✅ Order creation and management
- ✅ SSLCommerz payment integration
- ✅ Payment verification and webhooks
- ✅ Order status tracking
- ✅ Delivery type selection (Standard/Express)
- ✅ Prescription upload for required products

### Stock Management
- ✅ Real-time stock tracking
- ✅ Low stock alerts
- ✅ Inventory statistics

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud)
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/shakibwebx/GadgetsHub-Server.git
cd GadgetsHub-Server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory. Use `.env.example` as a template:

```bash
cp .env.example .env
```

Configure the following environment variables:

```env
# MongoDB
MONGO_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Bcrypt
BCRYPT_SALT_ROUNDS=10

# SSLCommerz Payment Gateway
SSL_STORE_ID=your_sslcommerz_store_id
SSL_STORE_PASSWORD=your_sslcommerz_store_password
SSL_IS_LIVE=false
SSL_SUCCESS_URL=http://localhost:3000/cart/payment
SSL_FAIL_URL=http://localhost:3000/cart/payment
SSL_CANCEL_URL=http://localhost:3000/cart/payment
SSL_IPN_URL=http://localhost:5000/api/payment/ipn

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 4. Run the development server

```bash
npm run dev
```

Server will start at `http://localhost:5000`

### 5. Build for production

```bash
npm run build
npm start
```

---

## 📂 Project Structure

```
server/
├── src/
│   ├── app/
│   │   ├── modules/
│   │   │   ├── auth/          # Authentication routes & controllers
│   │   │   ├── user/          # User management
│   │   │   ├── product/       # Product CRUD operations
│   │   │   ├── order/         # Order management
│   │   │   └── payment/       # Payment integration
│   │   ├── middleware/        # Auth, error handlers
│   │   └── config/           # Database & app config
│   ├── server.ts             # Express app setup
│   └── index.ts              # Entry point
├── .env.example              # Environment variables template
├── package.json
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/social-login` - Social login (Google/GitHub)

### Products
- `GET /api/products` - Get all products (with filters, search, pagination)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Orders
- `GET /api/orders` - Get all orders (Admin) or user orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PATCH /api/orders/:id` - Update order status (Admin only)

### Payment
- `POST /api/payment/init` - Initialize payment
- `POST /api/payment/verify/:tran_id` - Verify payment
- `POST /api/payment/ipn` - Payment webhook (SSLCommerz IPN)

### Stock
- `GET /api/stocks` - Get stock statistics

---

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Role-Based Access
- **Admin:** Full access to all endpoints
- **User:** Limited to own orders and products viewing

---

## 🧪 Testing

```bash
# Run tests (if configured)
npm test
```

---

## 🚢 Deployment

This project is configured for Vercel deployment:

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard

---

## 📝 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `BCRYPT_SALT_ROUNDS` | Bcrypt salt rounds (default: 10) | No |
| `SSL_STORE_ID` | SSLCommerz store ID | Yes |
| `SSL_STORE_PASSWORD` | SSLCommerz store password | Yes |
| `SSL_IS_LIVE` | SSLCommerz live mode (true/false) | Yes |
| `SSL_SUCCESS_URL` | Payment success redirect URL | Yes |
| `SSL_FAIL_URL` | Payment failure redirect URL | Yes |
| `SSL_CANCEL_URL` | Payment cancel redirect URL | Yes |
| `SSL_IPN_URL` | SSLCommerz IPN webhook URL | Yes |
| `PORT` | Server port (default: 5000) | No |
| `NODE_ENV` | Environment (development/production) | No |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Shakib**
- GitHub: [@shakibwebx](https://github.com/shakibwebx)

---

## 🔗 Related

- [Client Repository](https://github.com/shakibwebx/GadgetsHub-Client)
- [Live Demo](https://gadgets-hub.vercel.app)
