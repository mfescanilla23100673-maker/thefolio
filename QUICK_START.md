# MFAE Poetry - Quick Start Guide

## Step 1: Start MongoDB (Required for Full Functionality)

### Option A: Local MongoDB Installation

1. Download MongoDB Community Edition: https://www.mongodb.com/try/download/community
2. Run the installer and follow the installation steps
3. MongoDB will start automatically as a service on port 27017

### Option B: MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new project and cluster
4. Get your connection string
5. Update `backend/.env` with your connection string

**Check if MongoDB is running:**

```bash
netstat -ano | findstr :27017
```

You should see output showing MongoDB listening on port 27017.

## Step 2: Start the Frontend

Open PowerShell/Command Prompt and run:

```bash
cd c:\Users\Kikay\thefolio-project\frontend
npm start
```

**What happens:**

- Browser automatically opens to http://localhost:3000
- You'll see the MFAE Poetry splash page
- App redirects to home page
- You're ready to test!

## Step 3: Start the Backend (In a NEW Terminal)

Open a NEW PowerShell/Command Prompt and run:

```bash
cd c:\Users\Kikay\thefolio-project\backend
npm start
```

Backend will start on http://localhost:5000

## Step 4: Create Admin Account (In a NEW Terminal)

Once MongoDB is running:

```bash
cd c:\Users\Kikay\thefolio-project\backend
node seedAdmin.js
```

You'll see:

```
Admin account created successfully!
Email: admin@thefolio.com
Password: Admin@1234
```

## Step 4.5: Seed Sample Posts (In a NEW Terminal)

To create sample posts with poetry content and images:

```bash
cd c:\Users\Kikay\thefolio-project\backend
node seedPosts.js
```

You'll see:

```
Created post: Journey Through the Night
Created post: Whispers of the Heart
Created post: Echoes of Tomorrow
Created post: Colors of Love
Created post: Dreams Never Die
Successfully created 5 sample posts!
```

This will populate the home page with posts that have comments and like/dislike functionality.

## Step 5: Test the Application

### Test Password Visibility Toggle:

1. Go to Login or Register page
2. Look for the eye icon 👁️ next to password fields
3. Click to toggle password visibility (shows password as text)
4. Click again to hide (password dots)

### Test Login:

1. Click "Login" in the navigation
2. Enter: admin@thefolio.com
3. Password: Admin@1234
4. Click "Login Now"
5. You'll be redirected to admin dashboard

### Test Registration:

1. Click "Register" in the navigation
2. Fill in:
   - Full Name: Your Name
   - Email: your@email.com
   - Password: YourPassword123
   - Confirm Password: YourPassword123
   - Check "I agree to terms"
3. Click "Register Now"
4. New account created! You'll be logged in automatically

### Test Logout & Login with Different Account:

1. When logged in, click "Logout" button in navbar
2. You'll be logged out and redirected to home
3. Login with a different account or register a new one

### Test Comments & Likes on Posts:

1. Ensure `node seedPosts.js` was run (posts have sample content)
2. View the home page - you'll see posts with images and poetry
3. **Click "💬 Comments"** to expand comment section
4. **Type a comment** and click "Post" to add it
5. **Click "👍 Like" or "👎 Dislike"** to rate posts
6. **Logout and login** with a different account to test liking as different users
7. Comments show author name and date
8. You can delete your own comments or any comment if you're admin

### Test Theme Toggle:

- Click the 🌙 or ☀️ button in top right to switch between dark/light mode
- Works on all pages
- Comments and posts adapt to dark mode

## Troubleshooting

### "Something is already running on port 3000"

```bash
netstat -ano | findstr :3000
# Get the PID from output, then:
taskkill /PID [PID] /F
```

### "MongoDB connection error"

- Make sure MongoDB service is running
- Check `backend/.env` has correct MONGO_URI
- Restart backend server

### Login not working

- Verify admin account was created: check MongoDB with seed script
- Check backend is running on port 5000
- Check frontend can reach backend at http://localhost:5000
- Try the password toggle to verify you're typing the password correctly

### Password toggle not showing

- Make sure you're on the Login or Register page
- Look for the 👁️ icon to the right of password fields
- If not visible, check that App.css was properly updated
- Try refreshing the browser

### Registration not working

- Check email isn't already registered
- Verify password meets requirements (minimum 6 characters)
- Check form validation messages
- Ensure backend is running on port 5000
- Check browser console for detailed error messages

### Comments/Likes not working

- Make sure you're logged in
- Try clicking "Comments" button to expand the comments section
- Ensure backend is running (port 5000)
- Check browser console for API errors
- Try refreshing the page

### No posts showing on home page

- Run `node seedPosts.js` to create sample posts
- Make sure admin account exists (run `node seedAdmin.js`)
- Restart backend server: `npm start` in backend folder
- Refresh browser page
- Check that images exist in backend/uploads folder

## Features

✅ Auto-open browser on `npm start`
✅ Professional login page matching registration design
✅ Dark/Light theme toggle
✅ Form validation with error messages
✅ **Password visibility toggle** (eye icon to show/hide password)
✅ **Post comments system** (users can comment on posts)
✅ **Like/Dislike buttons** (rate posts with 👍 and 👎)
✅ **Latest posts display** with images from assets folder
✅ **Random poetry content** seeded for testing
✅ Password hashing for security
✅ JWT token authentication
✅ Role-based access (admin/member)
✅ **Logout functionality** in navigation bar
✅ Responsive design
✅ Error handling

## Files Modified

- `frontend/vite.config.js` - Auto-open configuration
- `frontend/src/pages/LoginPage.js` - New login design + password toggle
- `frontend/src/pages/RegisterPage.js` - Password visibility toggle on both fields
- `frontend/src/components/PostCard.js` - NEW: Post display with comments, likes, dislikes
- `frontend/src/pages/HomePage.js` - Updated to use PostCard component
- `frontend/src/App.css` - Login styling, dark mode, PostCard styles, password toggle styles
- `frontend/public/index.html` - Browser title changed to "MFAE POETRY"
- `backend/models/Post.js` - Added comments array and likes/dislikes arrays
- `backend/routes/post.routes.js` - Added comment and like/dislike endpoints
- `backend/seedAdmin.js` - Admin account creation (unchanged)
- `backend/seedPosts.js` - NEW: Post seeding with poetry content
- `backend/server.js` - CORS and routes (unchanged)
- `backend/.env` - MongoDB and JWT configuration

## Support

All original code preserved. No functionality removed.
Only enhancements and bug fixes applied.

Frontend: http://localhost:3000
Backend: http://localhost:5000
MongoDB: localhost:27017

Ready to develop! 🎉
