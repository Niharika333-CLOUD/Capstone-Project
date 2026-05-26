# eCommerce Platform - Capstone Project

## Objective
This capstone project demonstrates the application of AI in a real development workflow using Agentic IDEs (such as IBM BOB) to implement a backend solution for an eCommerce application - similar to modern AI-powered engineering teams.

## Use Case
An E-Commerce platform to view, browse, and purchase books - an online store where customers can browse, select, and buy products.

## Key Features

### Customer Journeys

#### 1. E-store Home (Steps 1-3)
- **Login Page**: User authentication
- **User Authentication**: Secure login system
- **Order History with Buy Again**: Browse previous orders and reorder
- **Recommendations**: Items recommended based on order history
- **Product Catalogue**: Access product catalogue for each category

#### 2. Catalogue (Steps 5-8)
- **Category Selection**: Select the category of products
- **Browse Brands**: Filter and browse by brand
- **Product Selection**: Select products with tentative delivery dates
- **Related Products**: View related product suggestions
- **Add to Basket**: Shopping cart functionality

#### 3. Payment & Purchase Confirmation (Steps 9-12)
- **Delivery Address**: Select delivery address
- **Payment Options**: Initiate payment with multiple options
- **Gift Points**: Redeem gift points/rewards
- **Payment Confirmation**: Confirm successful payment
- **Order Confirmation**: Final purchase confirmation
- **Order Cancellation**: Cancel order within 48 hours

## System Architecture

### Core Modules

#### 1. Member Module
- Guest/Registered Users
- Login & Logout
- Role & Entitlement management

#### 2. Store Module
- Create Stores
- Create Catalogs
- Create Store Policies

#### 3. Catalog Module
- Browse Catalog by Entitlement
- Browse Products by Category & Brand
- Recommended Products based on Order History
- Show Up Sale & Cross Sale Products

#### 4. Order Module
- Create, Modify Order
- Order Checkout
- Confirm Order, Cancel Order, Return Order
- Order History
- Redeem Gift points, Coupons

#### 5. Payment Module
- Payment processing using Gateway
- Refund processing
- Payment Confirmation
- Gift & Wallet management

#### 6. Shipping Module
- Shipping Rate Calculation
- Approximate Delivery Time
- Return Shipment

## Technology Stack

### Backend
- Node.js with Express.js
- MongoDB for database
- JWT for authentication
- Bcrypt for password hashing
- Stripe/PayPal for payment processing

### Frontend
- React.js
- Redux for state management
- Axios for API calls
- Bootstrap/Material-UI for styling

### Development Tools
- IBM BOB or AWS Kiro (Agentic IDE)
- Git for version control
- Postman for API testing
- Jest for unit testing

## Project Structure
```
ecommerce-platform/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
├── docs/
│   ├── API.md
│   └── ARCHITECTURE.md
└── README.md
```

## Development Phases

1. **Phase 1**: Project setup and database design
2. **Phase 2**: Authentication and user management
3. **Phase 3**: Product catalog and browsing
4. **Phase 4**: Shopping cart and order management
5. **Phase 5**: Payment integration
6. **Phase 6**: Shipping and delivery
7. **Phase 7**: Recommendations and rewards
8. **Phase 8**: Testing and deployment

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- IBM BOB access or alternative Agentic IDE

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Set up environment variables
cp .env.example .env

# Start development servers
npm run dev
```

## Support
Join the Slack channel: #applied-ai-specialist-capstone-project for peer or SME help

## Note
Any software installed for development can be removed post the development