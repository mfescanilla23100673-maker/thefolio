# MongoDB Setup & Login/Registration Fix Guide

## Issue Summary

Your login and registration are not working because **MongoDB is not running**. When you try to register or login, the backend cannot reach the database to save or query user information.

---

## ❌ What's Happening Now

```
Your Request → Frontend → Backend API → MongoDB ❌ (NOT RUNNING)
                                          ↑
                                    Connection Fails
```

Result: "Registration failed" and "Login failed" errors

---

## ✅ How to Fix It

### Option 1: Local MongoDB (Recommended if installed)

**Step 1: Check if MongoDB is installed**

```bash
# In PowerShell, run:
mongod --version
```

If you see a version number, it's installed. If not, download from https://www.mongodb.com/try/download/community

**Step 2: Start MongoDB Service (Windows)**

```bash
# Option A: Using PowerShell (Admin)
# MongoDB usually runs as a service automatically

# Check if it's running:
netstat -ano | findstr :27017

# You should see LISTENING on port 27017
```

**Option B: Start MongoDB Manually**

```bash
# If installed in default location:
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"

# Keep this terminal open - MongoDB runs in the foreground
```

**Step 3: Verify connection**

```bash
# In another PowerShell, check if MongoDB is running:
netstat -ano | findstr :27017

# Should show: TCP 127.0.0.1:27017 LISTENING
```

**Step 4: Now try login/registration again**

---

### Option 2: MongoDB Atlas (Cloud - Easier Setup)

**Step 1: Create Cluster**

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (Free tier available)
3. Create a new project and cluster
4. Wait for cluster to deploy (5-15 minutes)

**Step 2: Get Connection String**

1. Click "Connect"
2. Choose "Drivers"
3. Select "Node.js"
4. Copy the connection string
5. It looks like: `mongodb+srv://username:password@cluster.mongodb.net/databaseName`

**Step 3: Update Backend Configuration**
Open `backend/.env` and replace:

```
MONGO_URI=mongodb://127.0.0.1:27017/thefolio
```

With your Atlas connection string:

```
MONGO_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/thefolio?retryWrites=true&w=majority
```

**Step 4: Restart Backend**

```bash
cd c:\Users\Kikay\thefolio-project\backend
npm start
```

---

## 🚀 Complete Setup Process

### Terminal 1: Start MongoDB

```bash
# If using local MongoDB:
mongod
# Keep this running

# Or if it's a service, it's already running:
netstat -ano | findstr :27017  # Verify it's running
```

### Terminal 2: Start Backend

```bash
cd c:\Users\Kikay\thefolio-project\backend
npm start
```

Watch for: `Server is running on http://localhost:5000`

### Terminal 3: Create Admin Account

```bash
cd c:\Users\Kikay\thefolio-project\backend
node seedAdmin.js
```

Expected output:

```
Admin account created successfully!
Email: admin@thefolio.com
Password: Admin@1234
```

### Terminal 4: Seed Sample Posts

```bash
cd c:\Users\Kikay\thefolio-project\backend
node seedPosts.js
```

Expected output:

```
Created post: Journey Through the Night
Created post: Whispers of the Heart
Created post: Echoes of Tomorrow
Created post: Colors of Love
Created post: Dreams Never Die
Successfully created 5 sample posts!
```

### Terminal 5: Start Frontend

```bash
cd c:\Users\Kikay\thefolio-project\frontend
npm start
```

Browser opens to http://localhost:3000

---

## 🧪 Test Login & Registration

### Test 1: Login with Admin Account

1. Click "Login" in navbar
2. Email: `admin@thefolio.com`
3. Password: `Admin@1234`
4. Click "Login Now"
5. ✅ You should be logged in (Logout button appears in navbar)

### Test 2: Register New Account

1. Click "Register" in navbar
2. Fill in:
   - Full Name: John Doe
   - Email: john@example.com
   - Password: Password123
   - Confirm: Password123
   - ☑️ Check terms
3. Click "Register Now"
4. ✅ New account created, you're logged in
5. Click "Logout" to test logout
6. Now login with: john@example.com / Password123

### Test 3: Switch Accounts

1. Login with admin account
2. Click "Logout"
3. Register another new account: jane@example.com
4. ✅ You're logged in as jane
5. Click "Logout"
6. Login as admin again
7. ✅ Account switching works!

---

## 📋 Latest Posts with Images

Your seed script now:

1. Creates 5 sample posts with poetry
2. Uses images from `frontend/src/assets/`:
   - `buwan.jpg` - Used in AboutPage
   - `iba.jpg` - Used in AboutPage
   - `nice.jpg` - NEW: Used for sample posts
   - `thetwo.jpg` - Used for sample posts
   - `walking.jpg` - Used for sample posts

Each post gets one image automatically assigned.

---

## 🔑 "See All Posts" Button

New feature on Home page:

1. Home page shows only the **latest 3 posts**
2. "See All Posts" button appears below (if more than 3)
3. Click to go to new **All Posts page**
4. All Posts page has design consistent with About page
5. Shows complete list of all posts with comments/likes
6. "Back to Home" button to return

---

## ✔️ Debugging Checklist

- [ ] MongoDB is running (`netstat -ano | findstr :27017` shows LISTENING)
- [ ] Backend is running on port 5000 (`npm start` in backend folder)
- [ ] Frontend is running on port 3000 (browser opens automatically)
- [ ] If seedAdmin.js fails: 1) Check MongoDB is running, 2) Check backend is running
- [ ] If registration fails: Check browser console (F12) for error messages
- [ ] If login fails: Try admin account first (admin@thefolio.com / Admin@1234)
- [ ] Password toggle (👁️) appears on Login/Register pages
- [ ] Can comment on posts (must be logged in)
- [ ] Can like/dislike posts
- [ ] "See All Posts" button appears on Home page

---

## 🆘 Common Errors & Solutions

### "Registration failed. Please try again."

**Cause**: Backend can't reach MongoDB

**Fix**:

1. Check MongoDB is running: `netstat -ano | findstr :27017`
2. Check backend is running: See Terminal 2 output
3. Check backend .env file has correct `MONGO_URI`
4. Restart both MongoDB and backend
5. Try again

---

### "Invalid email or password"

**Cause**: Account doesn't exist or wrong password

**Fix**:

1. Verify email is spelled correctly
2. Password is case-sensitive
3. Try admin account first: admin@thefolio.com / Admin@1234
4. If admin fails, MongoDB/backend not running

---

### "Error: connect ECONNREFUSED 127.0.0.1:27017"

**Cause**: Backend can't connect to MongoDB

**Fix**:

1. Start MongoDB: `mongod.exe` (look for it in C:\Program Files\MongoDB\)
2. Check it's running: `netstat -ano | findstr :27017`
3. Restart backend: `npm start`
4. Try login again

---

### "Connection timeout"

**Cause**: Using local MongoDB but didn't start it

**Fix**:

1. If using local: Start MongoDB service or `mongod.exe`
2. If using Atlas: Check internet connection
3. If using Atlas: Verify MONGO_URI in `.env` is correct
4. Add your IP to Atlas whitelist: https://www.mongodb.com/docs/atlas/security/ip-access-list/

---

### seedAdmin.js or seedPosts.js hangs or fails

**Cause**: MongoDB not running or bad connection

**Fix**:

1. Verify MongoDB: `netstat -ano | findstr :27017`
2. Verify backend: `netstat -ano | findstr :5000`
3. Kill the script: Ctrl+C
4. Start MongoDB first
5. Try again

---

## 📌 Key Files to Check

- `backend/.env` - Contains MONGO_URI connection string
- `backend/config/db.js` - Database connection logic
- `backend/server.js` - Server setup (line 14: connectDB())
- `backend/models/User.js` - User schema with password hashing
- `backend/routes/auth.routes.js` - Login/register endpoints
- `backend/seedAdmin.js` - Admin account creation
- `backend/seedPosts.js` - Sample posts creation

---

## 📞 Need More Help?

1. **Check browser console**: F12 → Console tab → Look for red errors
2. **Check backend terminal**: Look for error messages when you try to login
3. **Check MongoDB status**: `netstat -ano | findstr :27017`
4. **Try a different email**: Each email must be unique
5. **Restart everything**: Kill all terminals, restart from scratch

---

## 💡 MongoDB Connection String Explained

**Local MongoDB:**

```
mongodb://127.0.0.1:27017/thefolio
         ↑ Localhost        ↑ Port    ↑ Database name
```

**MongoDB Atlas:**

```
mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/thefolio?retryWrites=true
         ↑ Atlas protocol   ↑ Username  ↑ Cluster    ↑ Database    ↑ Options
```

---

## ✨ After You Get It Working

1. ✅ Test all 3 feature tests from above
2. ✅ Create 2-3 accounts
3. ✅ Add comments to posts
4. ✅ Like/dislike posts
5. ✅ Test dark mode
6. ✅ Check "See All Posts" button and page
7. ✅ Test logout and account switching

---

**Once MongoDB is running and both backend/frontend are started, everything should work perfectly!**

Go back to START_HERE.md to continue with the rest of the setup.
