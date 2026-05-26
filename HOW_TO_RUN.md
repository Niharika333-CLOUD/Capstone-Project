# 🚀 How to Run the Book Worm eCommerce Application

## Current Situation

You're seeing "Registration failed" because **MongoDB is not installed** on your system. The backend needs MongoDB to store user data, products, and orders.

## ✅ Solution: 3 Easy Steps

### Step 1: Install MongoDB (Choose ONE option)

#### Option A: Quick Install - MongoDB Community Edition (15 minutes)

1. **Download MongoDB:**
   - Go to: https://www.mongodb.com/try/download/community
   - Select: **Windows x64**
   - Click: **Download**

2. **Install:**
   - Run the downloaded `.msi` file
   - Choose **"Complete"** installation
   - ✅ **CHECK** "Install MongoDB as a Service"
   - ✅ **CHECK** "Install MongoDB Compass" (GUI tool)
   - Click **Install**
   - Wait for installation to complete

3. **Verify Installation:**
   Open PowerShell and run:
   ```powershell
   Get-Service -Name MongoDB
   ```
   You should see MongoDB service running.

#### Option B: Cloud Database - MongoDB Atlas (10 minutes, No Installation)

1. **Sign up:**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Create a free account

2. **Create Free Cluster:**
   - Click "Build a Database"
   - Choose **"Free"** tier (M0)
   - Click "Create Cluster"

3. **Set Up Access:**
   - Go to "Database Access" → Add user (save username/password)
   - Go to "Network Access" → Add IP → "Allow Access from Anywhere"

4. **Get Connection String:**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password

5. **Update Backend:**
   Edit `backend/.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bookworm-ecommerce?retryWrites=true&w=majority
   ```

### Step 2: Start the Backend Server

Open a **NEW terminal** in VS Code (Terminal → New Terminal):

```powershell
cd backend
npm run dev
```

**Expected Output:**
```
✅ MongoDB Connected: localhost
📊 Database: bookworm-ecommerce
🚀 Server running on port 5000
```

**If you see an error**, MongoDB is not running. See troubleshooting below.

### Step 3: Verify Frontend is Running

The frontend should already be running at: **http://localhost:4200**

If not, open another terminal:
```powershell
cd frontend
npm start
```

## 🎯 Test the Application

1. **Open Browser:** http://localhost:4200
2. **Click "Register"** or navigate to registration
3. **Fill in details:**
   - Name: Test User
   - Email: test@bookworm.com
   - Password: Test123!
   - Confirm Password: Test123!
4. **Click "Create Account"**

✅ **Success!** You should be redirected to the home page.

## 📊 View Your Data (Optional)

If you installed MongoDB Compass:
1. Open **MongoDB Compass**
2. Connect to: `mongodb://localhost:27017`
3. You'll see the `bookworm-ecommerce` database
4. Browse collections: users, products, orders, etc.

## 🔧 Troubleshooting

### Problem: "Registration failed. Please try again."

**Cause:** Backend is not running or cannot connect to MongoDB

**Solution:**
1. Check if backend terminal shows MongoDB connection error
2. If yes, MongoDB is not installed or not running
3. Follow Step 1 above to install MongoDB

### Problem: Backend shows "MongoDB Connection Error"

**Cause:** MongoDB is not running

**Solution for Local MongoDB:**
```powershell
# Check if MongoDB service is running
Get-Service -Name MongoDB

# If not running, start it
Start-Service -Name MongoDB
```

**Solution for MongoDB Atlas:**
- Verify your connection string in `backend/.env`
- Check username/password are correct
- Ensure IP address is whitelisted in Atlas

### Problem: "Port 5000 already in use"

**Solution:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace <PID> with actual number)
taskkill /PID <PID> /F

# Then restart backend
cd backend
npm run dev
```

### Problem: Frontend not loading

**Solution:**
```powershell
# Stop the current process (Ctrl+C)
# Clear cache and restart
cd frontend
Remove-Item -Recurse -Force .angular
npm start
```

## 📝 Summary of Running Services

When everything is working, you should have:

1. **MongoDB** - Running on port 27017
   - Check: `Get-Service -Name MongoDB` (for local)
   - Or: MongoDB Atlas dashboard (for cloud)

2. **Backend API** - Running on port 5000
   - Terminal shows: "✅ MongoDB Connected"
   - Test: http://localhost:5000/api (should show "Cannot GET /api")

3. **Frontend** - Running on port 4200
   - Browser: http://localhost:4200
   - Should show the Book Worm home page

## 🎨 What You Can Do

Once everything is running:

- ✅ **Register** a new user account
- ✅ **Login** with your credentials
- ✅ **Browse** products (you'll need to add some via API or MongoDB Compass)
- ✅ **Add to cart** and manage cart items
- ✅ **Checkout** and place orders
- ✅ **View orders** in your profile

## 📚 Additional Resources

- **MongoDB Installation Guide:** See `MONGODB_INSTALLATION.md`
- **API Documentation:** See `docs/API.md`
- **Quick Start Guide:** See `QUICK_START.md`
- **Project Overview:** See `PROJECT_OVERVIEW.md`

## 💡 Pro Tips

1. **Keep terminals open:** Don't close the backend terminal while using the app
2. **Use MongoDB Compass:** It's easier to view and manage data visually
3. **Check browser console:** Press F12 to see any frontend errors
4. **Check backend terminal:** Watch for API request logs and errors

## 🆘 Still Having Issues?

1. **Check all three services are running:**
   - MongoDB (port 27017)
   - Backend (port 5000)
   - Frontend (port 4200)

2. **Verify .env file exists:**
   - Location: `backend/.env`
   - Should contain: `MONGODB_URI=mongodb://localhost:27017/bookworm-ecommerce`

3. **Check browser console:**
   - Press F12 in browser
   - Look for red error messages
   - Common: "Failed to fetch" means backend is not running

4. **Restart everything:**
   ```powershell
   # Stop all terminals (Ctrl+C)
   # Restart MongoDB service
   Restart-Service -Name MongoDB
   # Start backend
   cd backend; npm run dev
   # Start frontend (if needed)
   cd frontend; npm start
   ```

---

**You're almost there!** Just install MongoDB and you'll be up and running! 🚀
