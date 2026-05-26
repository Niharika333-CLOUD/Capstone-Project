# eCommerce Platform API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  }
}
```

### Login
**POST** `/auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User
**GET** `/auth/me`

**Headers:** `Authorization: Bearer <token>`

### Update Profile
**PUT** `/auth/profile`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "name": "John Updated",
  "phone": "9876543210"
}
```

### Update Password
**PUT** `/auth/password`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### Add Address
**POST** `/auth/address`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "addressType": "home",
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA",
  "isDefault": true
}
```

### Update Address
**PUT** `/auth/address/:addressId`

### Delete Address
**DELETE** `/auth/address/:addressId`

### Logout
**POST** `/auth/logout`

---

## Product Endpoints

### Get All Products
**GET** `/products`

**Query Parameters:**
- `category` - Filter by category ID
- `brand` - Filter by brand name
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `search` - Search term
- `sort` - Sort option (price_asc, price_desc, rating, newest, popular)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)

**Example:**
```
GET /products?category=123&sort=price_asc&page=1&limit=12
```

### Get Single Product
**GET** `/products/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "product_id",
    "title": "Book Title",
    "description": "Book description",
    "author": "Author Name",
    "price": 29.99,
    "stock": 50,
    "images": [...],
    "ratings": {
      "average": 4.5,
      "count": 120
    },
    "category": {...},
    "relatedProducts": [...],
    "reviews": [...]
  }
}
```

### Get Products by Category
**GET** `/products/category/:categoryId`

### Get Products by Brand
**GET** `/products/brand/:brand`

### Get Featured Products
**GET** `/products/featured`

### Get Recommendations
**GET** `/products/user/recommendations`

**Headers:** `Authorization: Bearer <token>`

Returns personalized product recommendations based on order history.

### Add Product Review
**POST** `/products/:id/reviews`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "rating": 5,
  "comment": "Great book! Highly recommended."
}
```

### Get All Brands
**GET** `/products/brands`

---

## Cart Endpoints

### Get Cart
**GET** `/cart`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "cart_id",
    "user": "user_id",
    "items": [
      {
        "product": {...},
        "quantity": 2,
        "price": 29.99
      }
    ],
    "totalItems": 2,
    "totalPrice": 59.98
  }
}
```

### Add Item to Cart
**POST** `/cart/items`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "productId": "product_id",
  "quantity": 1
}
```

### Update Cart Item Quantity
**PUT** `/cart/items/:productId`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "quantity": 3
}
```

### Remove Item from Cart
**DELETE** `/cart/items/:productId`

**Headers:** `Authorization: Bearer <token>`

### Clear Cart
**DELETE** `/cart`

**Headers:** `Authorization: Bearer <token>`

---

## Order Endpoints

### Create Order
**POST** `/orders`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "phone": "1234567890"
  },
  "paymentMethod": "card",
  "useGiftPoints": 50,
  "couponCode": "SAVE10"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "order_id",
    "orderNumber": "ORD1234567890",
    "items": [...],
    "pricing": {
      "subtotal": 100,
      "tax": 10,
      "shippingCost": 5,
      "discount": 5,
      "giftPointsUsed": 50,
      "total": 60
    },
    "orderStatus": "pending"
  }
}
```

### Get My Orders
**GET** `/orders`

**Headers:** `Authorization: Bearer <token>`

### Get Single Order
**GET** `/orders/:id`

**Headers:** `Authorization: Bearer <token>`

### Update Payment Status
**PUT** `/orders/:id/payment`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "transactionId": "txn_123456",
  "status": "completed"
}
```

### Cancel Order
**PUT** `/orders/:id/cancel`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "reason": "Changed my mind"
}
```

**Note:** Orders can only be cancelled within 48 hours and if not yet shipped.

### Request Return
**PUT** `/orders/:id/return`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "reason": "Product damaged"
}
```

### Reorder (Buy Again)
**POST** `/orders/:id/reorder`

**Headers:** `Authorization: Bearer <token>`

Adds all items from a previous order to the cart.

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Features Implemented

### 1. User Authentication & Authorization
- JWT-based authentication
- Role-based access control (customer, admin)
- Secure password hashing with bcrypt

### 2. Product Catalog
- Browse products by category and brand
- Search functionality
- Product filtering and sorting
- Product reviews and ratings
- Related, up-sale, and cross-sale products

### 3. Shopping Cart
- Add/remove items
- Update quantities
- Persistent cart storage

### 4. Order Management
- Create orders from cart
- Order history
- Order tracking
- Cancel orders (within 48 hours)
- Return requests
- Reorder functionality (Buy Again)

### 5. Payment Processing
- Multiple payment methods
- Payment status tracking
- Transaction management

### 6. Gift Points & Rewards
- Earn points on purchases (1% of order total)
- Redeem points on orders (up to 20% of subtotal)
- Points balance tracking

### 7. Recommendations
- Personalized product recommendations
- Based on order history
- Category and brand preferences

### 8. Shipping
- Delivery time estimation
- Shipping cost calculation
- Free shipping on orders over $500

---

## Testing the API

### Using cURL

**Register a user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Get products:**
```bash
curl http://localhost:5000/api/products
```

### Using Postman

1. Import the API endpoints into Postman
2. Set up environment variables for base URL and token
3. Use the Collection Runner for automated testing

---

## Rate Limiting

Currently, there are no rate limits implemented. In production, consider implementing rate limiting to prevent abuse.

## Pagination

List endpoints support pagination with the following query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)

Response includes pagination metadata:
```json
{
  "success": true,
  "count": 12,
  "total": 150,
  "page": 1,
  "pages": 13,
  "data": [...]
}