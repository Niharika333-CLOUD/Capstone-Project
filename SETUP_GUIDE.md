# Setup Guide - eCommerce Platform

This guide will help you set up and run the eCommerce platform on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.x or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/)
- **Postman** (optional, for API testing) - [Download](https://www.postman.com/downloads/)

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Capstone-Project
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

This will install all required packages including:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- and more...

### 3. Set Up MongoDB

#### Option A: Local MongoDB Installation

**Windows:**
```bash
# Start MongoDB service
net start MongoDB

# Or use MongoDB Compass GUI
```

**macOS:**
```bash
# Start MongoDB
brew services start mongodb-community

# Or manually
mongod --config /usr/local/etc/mongod.conf
```

**Linux:**
```bash
# Start MongoDB
sudo systemctl start mongod

# Enable on boot
sudo systemctl enable mongod
```

#### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Use it in your `.env` file

### 4. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ecommerce_db
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Payment Gateway (Stripe) - Optional for now
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Email Configuration - Optional
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

**Important Security Notes:**
- Never commit the `.env` file to version control
- Use strong, unique values for `JWT_SECRET`
- Change default values in production

### 5. Start the Development Server

```bash
# From the backend directory
npm run dev
```

You should see:
```
MongoDB Connected: localhost
Server running in development mode on port 5000
```

### 6. Verify the Installation

Open your browser or use curl:

```bash
# Health check
curl http://localhost:5000/health

# API root
curl http://localhost:5000/
```

Expected response:
```json
{
  "success": true,
  "message": "Welcome to eCommerce API",
  "version": "1.0.0"
}
```

## Testing the API

### Using cURL

**1. Register a new user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890"
  }'
```

**2. Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Save the token from the response!

**3. Get user profile:**
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. **Import Collection:**
   - Create a new collection named "eCommerce API"
   - Add requests for each endpoint

2. **Set Environment Variables:**
   - Create an environment
   - Add variables:
     - `base_url`: `http://localhost:5000`
     - `token`: (will be set after login)

3. **Test Authentication:**
   - Register a user
   - Login and save the token
   - Use the token for protected routes

## Seeding Sample Data (Optional)

To populate the database with sample data, you can create a seed script:

```bash
# Create a seed file
touch backend/utils/seeder.js
```

Then run:
```bash
node backend/utils/seeder.js
```

## Common Issues and Solutions

### Issue 1: MongoDB Connection Error

**Error:** `MongoNetworkError: failed to connect to server`

**Solution:**
- Ensure MongoDB is running
- Check the connection string in `.env`
- Verify MongoDB port (default: 27017)

### Issue 2: Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find and kill the process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:5000 | xargs kill -9

# Or change the PORT in .env
```

### Issue 3: JWT Token Invalid

**Error:** `401 Unauthorized - Invalid token`

**Solution:**
- Ensure you're including the token in the Authorization header
- Format: `Bearer YOUR_TOKEN_HERE`
- Check if the token has expired (default: 7 days)
- Verify JWT_SECRET matches between token generation and verification

### Issue 4: Module Not Found

**Error:** `Cannot find module 'express'`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

## Development Workflow

### 1. Making Changes

```bash
# Create a new branch
git checkout -b feature/your-feature-name

# Make your changes
# Test your changes

# Commit
git add .
git commit -m "Description of changes"

# Push
git push origin feature/your-feature-name
```

### 2. Running in Production Mode

```bash
# Set NODE_ENV to production in .env
NODE_ENV=production

# Start the server
npm start
```

### 3. Monitoring Logs

The application uses Morgan for HTTP request logging in development mode.

## API Documentation

Full API documentation is available at:
- [docs/API.md](docs/API.md)

## Project Structure

```
backend/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── models/          # Database models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── utils/           # Utility functions
├── .env.example     # Environment template
├── package.json     # Dependencies
└── server.js        # Entry point
```

## Next Steps

1. **Explore the API**: Use Postman to test all endpoints
2. **Read the Documentation**: Check [docs/API.md](docs/API.md)
3. **Understand the Architecture**: Review [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)
4. **Add Features**: Extend the functionality
5. **Build Frontend**: Create a React frontend (optional)

## Support

For issues or questions:
- Check the [README.md](README.md)
- Review the [API Documentation](docs/API.md)
- Join the Slack channel: #applied-ai-specialist-capstone-project

## Useful Commands

```bash
# Install dependencies
npm install

# Run development server with auto-reload
npm run dev

# Run production server
npm start

# Run tests (when implemented)
npm test

# Check for outdated packages
npm outdated

# Update packages
npm update
```

## Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| PORT | Server port | 5000 | No |
| NODE_ENV | Environment | development | No |
| MONGODB_URI | MongoDB connection string | - | Yes |
| JWT_SECRET | JWT signing secret | - | Yes |
| JWT_EXPIRE | Token expiration | 7d | No |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:3000 | No |
| STRIPE_SECRET_KEY | Stripe secret key | - | No |
| EMAIL_HOST | SMTP host | - | No |
| EMAIL_PORT | SMTP port | 587 | No |
| EMAIL_USER | Email username | - | No |
| EMAIL_PASSWORD | Email password | - | No |

## Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Use strong passwords
- [ ] Enable HTTPS in production
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Validate all inputs
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Enable MongoDB authentication
- [ ] Set up proper error logging

## Performance Tips

1. **Database Indexing**: Ensure proper indexes on frequently queried fields
2. **Caching**: Consider Redis for session management
3. **Compression**: Enable gzip compression
4. **Load Balancing**: Use PM2 or similar in production
5. **Monitoring**: Set up application monitoring

---

Happy Coding! 🚀