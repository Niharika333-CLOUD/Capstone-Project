# eCommerce Platform - Capstone Project

A full-stack eCommerce application for browsing, selecting, and purchasing books, built using modern web technologies and AI-assisted development with Agentic IDEs (IBM BOB). Features a Node.js/Express backend and Angular frontend with a modern dark theme UI.

## 🎯 Project Overview

This capstone project demonstrates the application of AI in a real development workflow. It implements a complete backend solution for an eCommerce platform with features like user authentication, product catalog, shopping cart, order management, payment processing, and personalized recommendations.

## ✨ Key Features

### Customer Features
- **User Authentication**: Secure registration and login with JWT
- **Product Browsing**: Browse books by category, brand, and search
- **Product Details**: View detailed information, reviews, and ratings
- **Shopping Cart**: Add, update, and remove items
- **Order Management**: Place orders, track status, cancel within 48 hours
- **Order History**: View past orders with "Buy Again" functionality
- **Personalized Recommendations**: AI-powered product suggestions based on order history
- **Gift Points System**: Earn and redeem points on purchases
- **Multiple Addresses**: Save and manage delivery addresses
- **Product Reviews**: Rate and review purchased products
- **Related Products**: View up-sale and cross-sale suggestions

### System Features
- **RESTful API**: Well-structured API endpoints
- **Database Models**: MongoDB with Mongoose ODM
- **Authentication & Authorization**: JWT-based with role management
- **Error Handling**: Comprehensive error handling middleware
- **Data Validation**: Input validation and sanitization
- **Payment Integration**: Ready for Stripe/PayPal integration
- **Shipping Calculation**: Dynamic shipping cost and delivery estimation

## 🏗️ Architecture

The system follows a modular architecture with six core modules:

1. **Member Module**: User management, authentication, roles
2. **Store Module**: Store and catalog management
3. **Catalog Module**: Product browsing, filtering, recommendations
4. **Order Module**: Order creation, tracking, cancellation, returns
5. **Payment Module**: Payment processing, refunds, wallet management
6. **Shipping Module**: Shipping calculation, tracking, delivery

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Payment**: Stripe (ready for integration)

### Frontend
- **Framework**: Angular 17 (Standalone Components)
- **Language**: TypeScript
- **Styling**: CSS with CSS Variables (Dark Theme)
- **HTTP Client**: Angular HttpClient with Interceptors
- **Routing**: Angular Router with Guards
- **State Management**: RxJS with Services

### Development Tools
- **Agentic IDE**: IBM BOB or AWS Kiro
- **Version Control**: Git
- **API Testing**: Postman
- **Logging**: Morgan

## 📁 Project Structure

```
ecommerce-platform/
├── backend/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── productController.js # Product operations
│   │   ├── cartController.js    # Cart management
│   │   └── orderController.js   # Order processing
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Product.js           # Product schema
│   │   ├── Category.js          # Category schema
│   │   ├── Order.js             # Order schema
│   │   └── Cart.js              # Cart schema
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── productRoutes.js     # Product endpoints
│   │   ├── cartRoutes.js        # Cart endpoints
│   │   └── orderRoutes.js       # Order endpoints
│   ├── middleware/
│   │   ├── auth.js              # Authentication middleware
│   │   └── errorHandler.js      # Error handling
│   ├── .env.example             # Environment variables template
│   ├── package.json             # Dependencies
│   └── server.js                # Application entry point
├── docs/
│   ├── API.md                   # API documentation
│   └── ARCHITECTURE.md          # System architecture (to be created)
├── PROJECT_OVERVIEW.md          # Project overview
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn
- IBM BOB access or alternative Agentic IDE (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Capstone-Project
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   npm install -g @angular/cli
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/ecommerce_db
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   ```bash
   # On Windows
   net start MongoDB
   
   # On macOS/Linux
   sudo systemctl start mongod
   ```

5. **Run the backend server**
   ```bash
   cd backend
   npm run dev
   ```

   The backend server will start at `http://localhost:5000`

6. **Run the frontend application**
   ```bash
   cd frontend
   npm start
   ```

   The frontend will start at `http://localhost:4200`

### Accessing the Application

1. **Frontend Application**: http://localhost:4200
2. **Backend API**: http://localhost:5000
3. **API Health Check**: http://localhost:5000/health
4. **API Documentation**: See [docs/API.md](docs/API.md)

### Testing the Application

1. **Open the frontend** at http://localhost:4200
2. **Register a new account** or use the login page
3. **Browse products** from the home page
4. **Add items to cart** and proceed to checkout
5. **Complete a purchase** and view order history

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Update password
- `POST /api/auth/address` - Add address
- `PUT /api/auth/address/:id` - Update address
- `DELETE /api/auth/address/:id` - Delete address

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:id` - Get products by category
- `GET /api/products/brand/:brand` - Get products by brand
- `GET /api/products/featured` - Get featured products
- `GET /api/products/user/recommendations` - Get personalized recommendations
- `POST /api/products/:id/reviews` - Add product review
- `GET /api/products/brands` - Get all brands

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:productId` - Update cart item
- `DELETE /api/cart/items/:productId` - Remove from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/payment` - Update payment status
- `PUT /api/orders/:id/cancel` - Cancel order
- `PUT /api/orders/:id/return` - Request return
- `POST /api/orders/:id/reorder` - Reorder (Buy Again)

## 🎓 Learning Objectives

This project demonstrates:

1. **AI-Assisted Development**: Using Agentic IDEs for efficient coding
2. **RESTful API Design**: Building scalable backend services
3. **Database Modeling**: Designing MongoDB schemas with relationships
4. **Authentication & Security**: Implementing JWT and secure practices
5. **Business Logic**: Order processing, inventory management, pricing
6. **Recommendation Systems**: Basic AI-powered product suggestions
7. **Payment Integration**: Preparing for payment gateway integration
8. **Error Handling**: Comprehensive error management
9. **API Documentation**: Creating clear, usable documentation

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected routes with middleware
- Input validation and sanitization
- CORS configuration
- Environment variable management
- SQL injection prevention (NoSQL)

## 🎁 Gift Points System

- Earn 1% of order total as gift points
- Redeem up to 20% of order subtotal
- Points tracked in user wallet
- Automatic point calculation and redemption

## 📦 Order Management

- **Order Creation**: From cart with address and payment
- **Order Tracking**: Real-time status updates
- **Cancellation**: Within 48 hours if not shipped
- **Returns**: Request returns for delivered orders
- **Reorder**: One-click reorder from history

## 🤝 Contributing

This is a capstone project. For questions or support, join the Slack channel:
**#applied-ai-specialist-capstone-project**

## 📝 License

This project is created for educational purposes as part of the Applied AI Specialist Capstone Project.

## 🙏 Acknowledgments

- IBM BOB and Agentic IDE tools
- Course instructors and mentors
- Peer reviewers and SMEs

## 📞 Support

For any issues or questions:
- Check the [API Documentation](docs/API.md)
- Review the [Project Overview](PROJECT_OVERVIEW.md)
- Join the Slack channel for peer support

---

**Note**: Any software installed for development can be removed post development.

## 🚧 Future Enhancements

- Frontend React application
- Admin dashboard
- Real-time notifications
- Advanced analytics
- Email notifications
- Payment gateway integration
- Image upload functionality
- Advanced search with Elasticsearch
- Caching with Redis
- Microservices architecture
