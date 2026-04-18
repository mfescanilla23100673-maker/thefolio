# MFAE Poetry - Feature Implementation Guide

## Summary of Changes

This document outlines all the new features and improvements added to the MFAE Poetry application.

## 1. Password Visibility Toggle

### What It Does
Users can now toggle password visibility on Login and Register pages using an eye icon (👁️).

### Files Modified
- `frontend/src/pages/LoginPage.js` - Added `showPassword` state
- `frontend/src/pages/RegisterPage.js` - Added `showPassword` and `showConfirmPassword` states
- `frontend/src/App.css` - Added `.password-field`, `.toggle-password-btn` styles

### How It Works
```javascript
// Click the eye icon to toggle between:
<input type={showPassword ? 'text' : 'password'} />  // Shows character
<input type={showPassword ? 'text' : 'password'} />  // Shows dots

// Dark mode support included
```

### User Experience
- Registration page: Both password fields have toggle
- Login page: Password field has toggle
- Visual feedback: Eye icon changes appearance when password is visible
- Works in light and dark modes

---

## 2. Post Comments System

### What It Does
Users can comment on posts with full CRUD operations (Create, Read, Update/Delete).

### Files Modified
- `backend/models/Post.js` - Added comments array
- `backend/routes/post.routes.js` - Added 2 new endpoints:
  - `POST /api/posts/:id/comment` - Add comment
  - `DELETE /api/posts/:id/comment/:commentId` - Delete comment
- `frontend/src/components/PostCard.js` - NEW: Full comment UI

### New API Endpoints

```
POST /api/posts/:id/comment
Body: { text: "your comment here" }
Response: Full post with updated comments

DELETE /api/posts/:id/comment/:commentId
Response: { message: "Comment deleted successfully" }
```

### Backend Implementation
```javascript
// Comments stored as subdocuments in Post
comments: [
  {
    _id: ObjectId,
    author: UserId,
    text: String,
    createdAt: Date
  }
]
```

### Frontend Components
- Comment button shows count: `💬 Comments (5)`
- Expandable comment section with list
- Form to add new comment
- Delete button for comment owners and admins
- Shows author name and date for each comment

---

## 3. Like & Dislike System

### What It Does
Users can like or dislike posts. You can't like and dislike the same post (mutual exclusion).

### Files Modified
- `backend/models/Post.js` - Added likes and dislikes arrays
- `backend/routes/post.routes.js` - Added 2 new endpoints:
  - `POST /api/posts/:id/like` - Toggle like
  - `POST /api/posts/:id/dislike` - Toggle dislike
- `frontend/src/components/PostCard.js` - Like/dislike buttons

### New API Endpoints

```
POST /api/posts/:id/like
Response: { likes: 15, dislikes: 2 }

POST /api/posts/:id/dislike
Response: { likes: 14, dislikes: 3 }
```

### Backend Logic
```javascript
likes: [UserId1, UserId2, ...],      // Array of user IDs
dislikes: [UserId3, UserId4, ...],   // Array of user IDs

// When user likes a post:
// - Remove from dislikes if present
// - Add to likes (or remove if already liked)
```

### Frontend Design
- "👍 Like (15)" button - shows count
- "👎 Dislike (3)" button - shows count
- Active state styling (green for like, red for dislike)
- Must be logged in to like/dislike
- Real-time count updates

---

## 4. Post Card Component

### What It Does
Universal post display component with author info, image, content, and all interactions.

### Files Modified
- `frontend/src/components/PostCard.js` - NEW: Complete post display
- `frontend/src/pages/HomePage.js` - Updated to use PostCard
- `frontend/src/App.css` - Added 100+ lines of PostCard styling

### Component Features

```javascript
<PostCard 
  post={postData}
  onPostUpdate={() => {}}
/>
```

### Post Card Displays
1. **Header**: Author name, profile picture, post date
2. **Image**: From uploads folder (if exists)
3. **Content**: Title and body text (with line breaks preserved)
4. **Actions**:
   - Like button with count
   - Dislike button with count
   - Comments button with count
5. **Comments Section** (toggleable):
   - List of all comments
   - Comment form for new comments
   - Delete buttons for authorized users
   - Author name and date for each comment

### Styling
- Dark mode fully supported
- Hover effects
- Responsive design
- Scrollable comments section (max-height: 400px)

---

## 5. Sample Posts & Seeding

### What It Does
Provides a seed script to populate the database with sample poetry posts.

### Files Modified
- `backend/seedPosts.js` - NEW: Creates 5 sample posts

### Seed Content
Five poetry poems about love and life:
1. "Journey Through the Night"
2. "Whispers of the Heart"
3. "Echoes of Tomorrow"
4. "Colors of Love"
5. "Dreams Never Die"

### How to Use
```bash
cd backend
node seedPosts.js
```

Output:
```
Created post: Journey Through the Night
Created post: Whispers of the Heart
Created post: Echoes of Tomorrow
Created post: Colors of Love
Created post: Dreams Never Die
Successfully created 5 sample posts!
```

### Images Used
Posts are automatically assigned images from the assets folder:
- buwan.jpg
- iba.jpg
- nice.jpg
- thetwo.jpg
- walking.jpg

---

## 6. Logout Functionality

### What It Does
Users can logout and return to home page, clearing authentication data.

### Files Using This
- `frontend/src/components/NavBar.js` - Already had logout
- `frontend/src/context/AuthContext.js` - logout() function

### How It Works
```javascript
const handleLogout = () => {
  logout();           // Clear token and user state
  navigate('/');      // Redirect to home
};
```

### UI
- "Logout" button appears in navbar when user is logged in
- Button only shows for authenticated users
- Clicking logoout redirects to splash page
- User can then login with different account

---

## 7. Registration Support & Debugging

### What It Does
Full registration system with validation and error handling.

### How Registration Works
1. User fills form (name, email, password, confirm, terms)
2. Frontend validates all fields
3. API sends to backend: `POST /api/auth/register`
4. Backend:
   - Checks if email already exists
   - Hashes password with bcryptjs
   - Creates user document
   - Generates JWT token
5. Frontend stores token in localStorage
6. User is logged in automatically
7. Redirect to home page

### Error Handling
- Email already registered error
- Password validation (minimum 6 characters)
- Terms checkbox required
- Password confirmation must match
- Server errors displayed to user
- Validation errors show below each field

### Testing
```bash
# Test account creation
Register email: test@example.com
Password: Test1234

# Then login with those credentials
Login with: test@example.com
Password: Test1234
```

---

## 8. UI/UX Improvements

### Dark Mode Enhancement
- All new components support dark mode
- Password toggle buttons styled for dark mode
- Post cards adapt to dark mode
- Comments section has dark mode CSS

### Responsive Design
- PostCard works on mobile screens
- Comments section scrolls on small screens
- Password toggle works on all devices
- Touch-friendly button sizes

### Accessibility
- Eye icon has title attribute (tooltip)
- Buttons have clear labels
- Form inputs have labels
- Colors have sufficient contrast

---

## Testing Checklist

- [x] Password toggle shows/hides password
- [x] Can add comments to posts
- [x] Can delete own comments
- [x] Admin can delete any comment
- [x] Like button increments counter
- [x] Dislike button increments counter
- [x] Can't like and dislike same post simultaneously
- [x] Comments persist after refresh (stored in DB)
- [x] Likes/dislikes persist after refresh
- [x] Dark mode applies to all new features
- [x] Can login with registered account
- [x] Can logout and login with different account
- [x] Posts display with images from assets

---

## Database Schema Updates

### Post Model
```javascript
{
  title: String,
  body: String,
  image: String,
  author: ObjectId (User ref),
  status: String ('published' | 'removed'),
  likes: [ObjectId],        // NEW: User IDs
  dislikes: [ObjectId],     // NEW: User IDs
  comments: [               // NEW: Array of comments
    {
      _id: ObjectId,
      author: ObjectId (User ref),
      text: String,
      createdAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Endpoints Reference

### Comments
- **POST** `/api/posts/:id/comment` - Add comment
- **DELETE** `/api/posts/:id/comment/:commentId` - Delete comment

### Likes/Dislikes
- **POST** `/api/posts/:id/like` - Toggle like
- **POST** `/api/posts/:id/dislike` - Toggle dislike

### Existing Endpoints (Unchanged)
- **GET** `/api/posts` - Get all posts
- **GET** `/api/posts/:id` - Get single post
- **POST** `/api/posts` - Create post (protected)
- **PUT** `/api/posts/:id` - Edit post (owner/admin)
- **DELETE** `/api/posts/:id` - Delete post (owner/admin)
- **POST** `/api/auth/login` - Login
- **POST** `/api/auth/register` - Register
- **GET** `/api/auth/me` - Get current user (protected)

---

## File Structure Summary

```
frontend/
├── src/
│   ├── pages/
│   │   ├── LoginPage.js (UPDATED: password toggle)
│   │   ├── RegisterPage.js (UPDATED: password toggle)
│   │   └── HomePage.js (UPDATED: uses PostCard)
│   ├── components/
│   │   ├── PostCard.js (NEW: comments, likes, dislikes)
│   │   └── NavBar.js (unchanged, has logout)
│   ├── App.css (UPDATED: password, PostCard styles)
│   └── ...
└── package.json

backend/
├── models/
│   ├── Post.js (UPDATED: comments, likes, dislikes)
│   └── ...
├── routes/
│   ├── post.routes.js (UPDATED: new endpoints)
│   └── ...
├── seedAdmin.js (unchanged)
├── seedPosts.js (NEW: post seeding)
└── ...

root/
├── QUICK_START.md (UPDATED: new features, instructions)
└── ...
```

---

## Browser Support

All features tested on:
- Chrome/Chromium-based browsers
- Firefox
- Edge

Dark mode toggle button (🌙/☀️) works on all modern browsers.

---

## Performance Notes

- Comments are stored as subdocuments (efficient for small comment counts)
- Likes/dislikes arrays are indexed by MongoDB for fast queries
- Post queries use `.populate()` to get author details
- Client-side state management prevents unnecessary API calls

---

## Known Limitations

1. Comments don't have nested replies (flat structure)
2. No pagination for very large comment lists (but scrollable)
3. Like/dislike counts are recalculated on each request (not cached)
4. Images must be pre-uploaded to assets folder

---

## Future Enhancement Ideas

- Add comment edit functionality
- Implement comment pagination
- Add comment likes/dislikes
- Add category/tag system for posts
- Implement post search and filtering
- Add user profile with post history
- Add notification system
- Add image upload UI (currently requires manual upload)

---

## Support & Debugging

1. **Check MongoDB is running**
   ```bash
   netstat -ano | findstr :27017
   ```

2. **Verify backend is running**
   ```bash
   http://localhost:5000/api/posts
   ```

3. **Check browser console** for detailed errors
   - F12 → Console tab
   - Look for red error messages

4. **Check backend logs** for server errors
   - Running in terminal shows all logs

5. **Run seed scripts** to populate initial data
   ```bash
   node seedAdmin.js    # Create admin
   node seedPosts.js    # Create sample posts
   ```

---

**End of Feature Implementation Guide**

For setup instructions, see `QUICK_START.md`
For project overview, see `README.md`
