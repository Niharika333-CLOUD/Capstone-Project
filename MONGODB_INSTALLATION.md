# MongoDB Installation Guide for Windows

## Quick Installation Steps

### Option 1: Install MongoDB Community Edition (Recommended)

1. **Download MongoDB:**
   - Visit: https://www.mongodb.com/try/download/community
   - Select: Windows x64
   - Click: Download

2. **Install MongoDB:**
   - Run the downloaded `.msi` file
   - Choose "Complete" installation
   - **Important:** Check "Install MongoDB as a Service"
   - **Important:** Check "Install MongoDB Compass" (GUI tool)
   - Click Install

3. **Verify Installation:**
   ```powershell
   # Check if MongoDB service is running
   Get-Service -Name MongoDB
   
   # Or check version
   mongod --version
   ```

4. **Create Data Directory (if needed):**
   ```powershell
   # MongoDB needs a data directory
   New-Item -ItemType Directory -Force -Path C:\data\db
   ```

### Option 2: Use MongoDB Atlas (Cloud - No Installation)

If you don't want to install MongoDB locally, use the free cloud version:

1. **Sign up for MongoDB Atlas:**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Create a free account

2. **Create a Free Cluster:**
   - Click "Build a Database"
   - Choose "Free" tier (M0)
   - Select a cloud provider and region
   - Click "Create Cluster"

3. **Set Up Database Access:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password
   - Set permissions to "Read and write to any database"

4. **Set Up Network Access:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

6. **Update Backend Configuration:**
   Edit `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bookworm-ecommerce?retryWrites=true&w=majority
   ```

### Option 3: Use Docker (If you have Docker installed)

```powershell
# Pull MongoDB image
docker pull mongo

# Run MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo

# Verify it's running
docker ps
```

## After Installation

### Start MongoDB (Local Installation)

**If installed as a service:**
```powershell
# Start service
Start-Service -Name MongoDB

# Check status
Get-Service -Name MongoDB
```

**If not installed as a service:**
```powershell
# Start MongoDB manually
mongod --dbpath "C:\data\db"
```

### Test Connection

1. **Using MongoDB Compass (GUI):**
   - Open MongoDB Compass
   - Connection string: `mongodb://localhost:27017`
   - Click "Connect"

2. **Using Command Line:**
   ```powershell
   # Connect to MongoDB
   mongosh
   
   # Or if mongosh is not available
   mongo
   ```

## Troubleshooting

### Issue: "mongod is not recognized"

**Solution:** Add MongoDB to PATH
1. Find MongoDB installation directory (usually `C:\Program Files\MongoDB\Server\7.0\bin`)
2. Add to System PATH:
   - Search "Environment Variables" in Windows
   - Edit "Path" variable
   - Add MongoDB bin directory
   - Restart terminal

### Issue: "Data directory not found"

**Solution:** Create the data directory
```powershell
New-Item -ItemType Directory -Force -Path C:\data\db
```

### Issue: Port 27017 already in use

**Solution:** Kill the process or use a different port
```powershell
# Find process using port 27017
netstat -ano | findstr :27017

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

## Quick Start After Installation

Once MongoDB is installed and running:

1. **Start MongoDB** (if not running as service)
2. **Start Backend:**
   ```powershell
   cd backend
   npm run dev
   ```
3. **Frontend is already running** at http://localhost:4200

## Recommended: MongoDB Compass

MongoDB Compass is a GUI tool that makes it easy to:
- View your databases and collections
- Browse and edit documents
- Run queries visually
- Monitor performance

It should be installed automatically with MongoDB Community Edition.

## For This Project

The backend is configured to connect to:
```
mongodb://localhost:27017/bookworm-ecommerce
```

This will create a database named `bookworm-ecommerce` automatically when you first use the application.

---

**Need help?** Check the official MongoDB documentation: https://docs.mongodb.com/manual/installation/