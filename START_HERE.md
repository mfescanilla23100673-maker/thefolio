# START HERE - MFAE Poetry Application Setup

## What You've Got Now

Your MFAE Poetry application has been upgraded with exciting new features:

✅ **Password Visibility Toggle** - Eye icon (👁️) on login/register pages to show/hide passwords
✅ **Comments System** - Users can comment on posts
✅ **Like/Dislike Buttons** - Rate posts with 👍 and 👎
✅ **Sample Posts** - Poetry content with beautiful images from your assets folder
✅ **Logout Function** - Users can logout and switch accounts
✅ **Dark Mode Support** - All new features work in light and dark modes

## 🚀 Quick Start (5 Minutes)

### ⚠️ IMPORTANT: MongoDB Must Be Running First

Before anything else, you MUST have MongoDB running. If you don't know how to start MongoDB, **read MONGODB_SETUP.md first** - it will walk you through it step by step.

**Check if MongoDB is running:**
```bash
netstat -ano | findstr :27017
```

You should see `LISTENING` on port 27017. If not, see MONGODB_SETUP.md.

### Step 1: Open MongoDB (Required)

Choose ONE option:

**Option A - Local MongoDB (Easiest if installed)**
```bash
# If you have MongoDB installed locally, it should auto-start
# Check if it's running:
netstat -ano | findstr :27017

# You should see output showing port 27017 is LISTENING
```

**Option B - MongoDB Atlas (Cloud - No installation)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account → Create project → Create cluster
3. Get connection string and update `backend/.env`:
   ```
   MONGO_URI=mongodb+srv://youruser:yourpass@cluster.mongodb.net/thefolio
   ```

### Step 2: Start Frontend (Open Terminal 1)

```bash
cd c:\Users\Kikay\thefolio-project\frontend
npm start
```

✅ Browser will **auto-open** to http://localhost:3000
✅ You'll see the splash screen, then home page

### Step 3: Start Backend (Open Terminal 2)

```bash
cd c:\Users\Kikay\thefolio-project\backend
npm start
```

✅ Server runs on http://localhost:5000
✅ You'll see: "Server is running on http://localhost:5000"

### Step 4: Create Admin Account (Open Terminal 3)

```bash
cd c:\Users\Kikay\thefolio-project\backend
node seedAdmin.js
```

✅ You'll see:
```
Admin account created successfully!
Email: admin@thefolio.com
Password: Admin@1234
```

### Step 5: Create Sample Posts (Same Terminal)

```bash
node seedPosts.js
```

✅ You'll see posts being created with poetry content

### Done! ✅

Now go to http://localhost:3000 and:
1. **Login** with admin@thefolio.com / Admin@1234
2. **Explore** the home page with posts
3. **Try the features**: Comments, Likes, Password toggle, Dark mode

---

## 🧪 Feature Testing Guide

### Test 1: Password Visibility Toggle

1. Go to http://localhost:3000/login
2. Click the 👁️ eye icon next to the password field
3. Password should appear as readable text
4. Click again to hide (show dots)
5. Works the same on register page (both password fields have toggles)

### Test 2: Login & Logout

1. Go to Login
2. Enter: admin@thefolio.com
3. Password: Admin@1234
4. Click "Login Now"
5. You're logged in! Notice the navbar now shows:
   - "Write Post" link
   - "Profile" link
   - "Logout" button
6. Click "Logout" button to logout
7. You're back to home page, navbar shows "Login" and "Register" again

### Test 3: Register New Account

1. Click "Register" in navbar
2. Fill in:
   - Full Name: Your Name (e.g., "John Doe")
   - Email: your@email.com (must be unique)
   - Password: YourPassword123
   - Confirm Password: YourPassword123
   - ☑️ Check "I agree to terms"
3. Click "Register Now"
4. You're now logged in with your new account!
5. Try logging out and logging back in with different credentials

### Test 4: Comment on Posts

1. Make sure you're logged in (login with any account)
2. Go to home page
3. On any post, click **"💬 Comments (0)"** button
4. Comment section expands showing:
   - Empty list (no comments yet)
   - Comment form: "Write a comment..." input field
5. Type a comment: "This is a beautiful poem!"
6. Click "Post" button
7. Your comment appears with your name and today's date
8. Login with DIFFERENT account
9. Add another comment - you'll see multiple comments from different users
10. Admin account can delete any comment
11. Other users can only delete their own comments

### Test 5: Like & Dislike Posts

1. On any post, you'll see:
   - **👍 Like (0)** button
   - **👎 Dislike (0)** button
2. Click "Like" - button turns green, count increases
3. Click "Like" again - button returns to gray, count decreases
4. Click "Dislike" - automatically unlikes, now dislike is active (red)
5. Try on multiple accounts to see different users' likes
6. **Important**: You can only like OR dislike, not both at the same time

### Test 6: Dark Mode

1. Look for 🌙 button in top area (or ☀️ if already dark)
2. Click to toggle between light and dark modes
3. Everything changes: backgrounds, text colors, borders
4. All new features (comments, likes, posts) adapt to dark mode
5. Works on all pages

### Test 7: Switch Accounts

1. Click "Logout" button
2. Register a NEW account with different email
3. Now you're logged in with second account
4. Click "Logout" again
5. Login with FIRST account (admin@thefolio.com)
6. Notice you're back as admin
7. This shows accounts work and can be switched

---

## 📁 Important Files (What Changed)

### Frontend Changes
- **LoginPage.js** - Password toggle added
- **RegisterPage.js** - Password toggle on both fields
- **PostCard.js** - NEW component with comments and likes
- **HomePage.js** - Now uses new PostCard component
- **App.css** - Added 200+ lines of new styling
- **NavBar.js** - Already had logout (no changes needed)

### Backend Changes
- **Post.js** - Added comments and likes arrays
- **post.routes.js** - Added 4 new endpoints for comments and likes
- **seedPosts.js** - NEW script to create sample posts
- **seedAdmin.js** - Already existed, plants admin account

---

## 🐛 Troubleshooting

### Issue: "Something is already running on port 3000"

```bash
# Kill process using port 3000
netstat -ano | findstr :3000
taskkill /PID [the-number-from-above] /F

# Then restart frontend
npm start
```

### Issue: "Cannot connect to MongoDB"

- Make sure MongoDB is running: `netstat -ano | findstr :27017`
- If using Atlas, check connection string in `backend/.env`
- If using local, download MongoDB Community Edition and install

### Issue: "Posts not showing on home page"

- Run `node seedPosts.js` to create posts
- Make sure backend is running on port 5000
- Refresh page: F5
- Check browser console (F12) for errors

### Issue: "Comments aren't showing"

- Make sure you ran `node seedPosts.js`
- Login (comments require authentication)
- Try clicking "Comments" button again
- Refresh page
- Check console for API errors

### Issue: "Can't register new account"

- Email must be unique (not already registered)
- Password must be at least 6 characters
- Must check the terms checkbox
- Backend must be running (port 5000)
- Try a new email address
- Check browser console for error message

### Issue: "Password toggle not showing"

- Make sure you're on Login or Register page
- Look for 👁️ icon to RIGHT of password field
- Try refreshing: F5
- Check that frontend is running: `npm start`

---

## 📚 Documentation

For detailed information, see:
- **QUICK_START.md** - Complete setup instructions
- **FEATURE_GUIDE.md** - Technical details of all features
- **README.md** - Project overview

---

## 🎯 What's Next?

### Immediate Next Steps
1. ✅ Run all the Quick Start steps above
2. ✅ Test all 7 feature tests
3. ✅ Create multiple accounts and test switching
4. ✅ Add comments to posts as different users
5. ✅ Like posts and see counts update

### Future Enhancements (Optional)
- Add comment editing
- Add user profiles with post history
- Add post search and filtering
- Add image upload UI
- Add notification system
- Add comment likes/dislikes
- Add nested comment replies

---

## 💡 Tips

1. **Use different terminals**: Keep frontend, backend, and MongoDB in separate terminal windows
2. **Keep terminals open**: Don't close them while testing
3. **Bookmark URLs**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api/posts
   - Admin email: admin@thefolio.com (pass: Admin@1234)

4. **Test with multiple accounts**: Create 2-3 test accounts to fully test comments and likes
5. **Check browser console**: Press F12 → Console tab to see detailed error messages
6. **Check backend logs**: Terminal running backend shows all server activity

---

## 🎓 How It Works Under the Hood

### When You Comment:
1. Frontend sends: `POST /api/posts/:id/comment` with your text
2. Backend adds to database: `post.comments.push({author: you, text: "..."})`
3. Database returns updated post
4. Your comment appears instantly

### When You Like:
1. Frontend sends: `POST /api/posts/:id/like`
2. Backend checks if you already liked
3. Toggles your ID in `post.likes` array
4. Returns new counts
5. Counter updates immediately

### When You Login:
1. Frontend sends credentials to `POST /api/auth/login`
2. Backend validates password
3. Creates JWT token
4. Token stored in browser localStorage
5. Every API request includes token
6. Server knows who you are

---

## ✨ You're All Set!

Everything is ready to go. Just follow the Quick Start section and you'll be testing in 5 minutes!

**Questions?** Check the troubleshooting section or the detailed documentation files.

**Ready to Start?** 👉 Go to "Quick Start" section above!

---

**Happy coding! 🚀**
