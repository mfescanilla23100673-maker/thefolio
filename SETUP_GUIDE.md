# TheForlio MERN Project - Setup Guide

## ✅ Frontend - READY TO RUN

The frontend has been fixed and is now fully operational without deprecation warnings.

### Start Frontend:
```bash
cd c:\Users\Kikay\thefolio-project\frontend
npm start
```

**Result:** App will launch on http://localhost:3000

### What was fixed:
- ✅ Migrated from deprecated `react-scripts` to modern `Vite` build system
- ✅ Configured JSX parsing in `vite.config.js` for `.js` files
- ✅ Fixed syntax error in `src/utils/themeUtils.js` (removed duplicate closing brace)
- ✅ Installed all dependencies cleanly
- ✅ No deprecation warnings - runs smoothly

### All Original Code Preserved:
- All React components unchanged
- All routes and pages intact
- Authentication context working
- Styling and assets preserved

---

## Backend - OPTIONAL (Requires MongoDB)

### Prerequisites:
- MongoDB running on `mongodb://127.0.0.1:27017`

### Start Backend:
```bash
cd c:\Users\Kikay\thefolio-project\backend
npm dev
```

**Result:** Server runs on http://localhost:5000

### Backend Features:
- Express.js REST API
- JWT authentication
- MongoDB integration
- CORS enabled for frontend

---

## Full Stack Testing

Once both are running:

1. **Frontend:** http://localhost:3000
2. **Backend API:** http://localhost:5000/api/

The frontend will communicate with the backend API for authentication, posts, comments, and admin features.

---

## Troubleshooting

### Frontend won't start:
- Ensure you're in the `frontend` directory
- Run `npm install` if dependencies are missing
- Check that port 3000 is not in use

### Backend won't connect:
- Verify MongoDB is running
- Check `.env` file has correct `MONGO_URI`
- Ensure port 5000 is available

---

**Last Updated:** April 8, 2026
