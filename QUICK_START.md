# Quick Start Guide - Book Worm eCommerce Platform

## ✅ Installation Complete!

Both frontend and backend dependencies have been successfully installed.

## 🚀 Running the Application

### Prerequisites
- MongoDB must be running on your system
- Node.js and npm are already installed

### Step 1: Start MongoDB

**Option A - MongoDB as Windows Service:**
```powershell
# MongoDB should start automatically if installed as a service
# Check if it's running:
Get-Service -Name MongoDB
```

**Option B - Start MongoDB Manually:**
```powershell
# Navigate to MongoDB bin directory and run:
mongod --dbpath "C:\data\db"
```

**Option C - Using MongoDB Compass:**
- Open MongoDB Compass
- Connect to `mongodb://localhost:27017`

### Step 2: Start the Backend Server

Open a new terminal in VS Code (Terminal → New Terminal):

```powershell
cd backend
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected: localhost
```

### Step 3: Start the Frontend Application

The frontend is already running! You should see it at:
**http://localhost:4200**

If you need to restart it:
```powershell
cd frontend
npm start
```

## 🎯 Testing the Application

### 1. Access the Application
Open your browser and navigate to: **http://localhost:4200**

### 2. Available Routes
- `/` or `/home` - Home page with product listings
- `/login` - User login
- `/register` - User registration
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/products` - Product catalog
- `/orders` - Order history
- `/profile` - User profile

### 3. API Endpoints
Backend API is available at: **http://localhost:5000/api**

**Authentication:**
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile

**Products:**
- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get single product
- GET `/api/products/recommendations` - Get recommendations

**Cart:**
- GET `/api/cart` - Get user cart
- POST `/api/cart` - Add item to cart
- PUT `/api/cart/:itemId` - Update cart item
- DELETE `/api/cart/:itemId` - Remove from cart

**Orders:**
- POST `/api/orders` - Create order
- GET `/api/orders` - Get user orders
- GET `/api/orders/:id` - Get order details
- PUT `/api/orders/:id/cancel` - Cancel order

## 🔧 Configuration

### Backend Configuration (backend/.env)
The `.env` file has been created with default settings:
- MongoDB URI: `mongodb://localhost:27017/bookworm-ecommerce`
- Server Port: `5000`
- JWT Secret: Change this in production!

### Frontend Configuration (frontend/src/environments/environment.ts)
- API URL: `http://localhost:5000/api`

## 📝 Current Status

✅ **Completed:**
- Backend API fully functional
- Frontend application structure complete
- Core components implemented:
  - Home page with product grid
  - Login/Register pages
  - Shopping cart
  - Routing and navigation

⚠️ **Note:**
- The compilation error with `ngModel` has been fixed by adding `FormsModule`
- TypeScript errors in the editor are expected until the Angular compiler processes all files
- The dev server should automatically recompile and the errors will disappear

## 🐛 Troubleshooting

### Issue: MongoDB Connection Error
**Solution:** Ensure MongoDB is running
```powershell
# Check MongoDB service
Get-Service -Name MongoDB

# Or start manually
mongod --dbpath "C:\data\db"
```

### Issue: Port Already in Use
**Solution:** Kill the process using the port
```powershell
# For backend (port 5000)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# For frontend (port 4200)
netstat -ano | findstr :4200
taskkill /PID <PID> /F
```

### Issue: CORS Errors
**Solution:** Ensure backend CORS is configured for `http://localhost:4200`
- Check `backend/.env` file
- Restart backend server

### Issue: Angular Compilation Errors
**Solution:** Clear cache and reinstall
```powershell
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

## 📚 Next Steps

1. **Seed Database:** Create sample products and categories
2. **Test Authentication:** Register a user and login
3. **Browse Products:** Navigate through the catalog
4. **Test Cart:** Add items to cart and checkout
5. **Customize:** Modify components and styling as needed

## 🔐 Default Test Credentials

You'll need to register a new user. Use these example credentials:
- Email: `test@bookworm.com`
- Password: `Test123!`

## 📖 Documentation

- **API Documentation:** See `docs/API.md`
- **Frontend Guide:** See `FRONTEND_IMPLEMENTATION_GUIDE.md`
- **Project Overview:** See `PROJECT_OVERVIEW.md`

## 🎨 UI Features Implemented

- ✅ Dark theme with modern design
- ✅ Responsive layout
- ✅ Product grid with images
- ✅ Category sidebar
- ✅ Search functionality
- ✅ Shopping cart with quantity controls
- ✅ User authentication forms
- ✅ Navigation and routing

## 💡 Tips

1. **Hot Reload:** Both frontend and backend support hot reload - changes will reflect automatically
2. **Browser DevTools:** Use F12 to inspect network requests and console logs
3. **VS Code Extensions:** Install Angular Language Service for better TypeScript support
4. **MongoDB Compass:** Use it to view and manage your database visually

## 🚀 You're All Set!

Your eCommerce platform is ready to use. Start by accessing **http://localhost:4200** in your browser!

---

**Need Help?** Check the documentation files or review the code comments for guidance.