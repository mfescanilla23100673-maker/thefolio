// backend/routes/post.routes.js
const express = require('express');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth.middleware');
const { memberOrAdmin } = require('../middleware/role.middleware');
const upload = require('../middleware/upload');
const router = express.Router();
// GET /api/posts — Public: all published posts (newest first)
router.get('/', async (req, res) => {
try {
const filter = { status: 'published' };
if (req.query.author) filter.author = req.query.author;
const limit = parseInt(req.query.limit) || 0; // 0 means no limit
const posts = await Post.find(filter)
.populate('author', 'name profilePic role')
.sort({ createdAt: -1 })
.limit(limit);
res.json(posts);
} catch (err) { res.status(500).json({ message: err.message }); }
});
// GET /api/posts/:id — Public: single post by ID
router.get('/:id', async (req, res) => {
try {
const post = await Post.findById(req.params.id).populate('author', 'name profilePic role');
if (!post || post.status === 'removed')
return res.status(404).json({ message: 'Post not found' });

res.json(post);
} catch (err) { res.status(500).json({ message: err.message }); }
});
// POST /api/posts — Member or Admin: create new post
// upload.single('image') handles optional image file
router.post('/', protect, memberOrAdmin, upload.single('image'), async (req,
res) => {
try {
const { title, body } = req.body;
const image = req.file ? req.file.filename : '';
const post = await Post.create({ title, body, image, author:
req.user._id });
await post.populate('author', 'name profilePic');
res.status(201).json(post);
} catch (err) { res.status(500).json({ message: err.message }); }
});
// PUT /api/posts/:id — Edit: only post owner OR admin
router.put('/:id', protect, memberOrAdmin, upload.single('image'), async (req,
res) => {
try {
const post = await Post.findById(req.params.id);
if (!post) return res.status(404).json({ message: 'Post not found' });
const isOwner = post.author.toString() === req.user._id.toString();
const isAdmin = req.user.role === 'admin';
if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized' });
if (req.body.title) post.title = req.body.title;
if (req.body.body) post.body = req.body.body;
if (req.file) post.image = req.file.filename;
await post.save();
res.json(post);
} catch (err) { res.status(500).json({ message: err.message }); }
});
// DELETE /api/posts/:id — Delete: only post owner OR admin
router.delete('/:id', protect, memberOrAdmin, async (req, res) => {
try {
const post = await Post.findById(req.params.id);
if (!post) return res.status(404).json({ message: 'Post not found' });
const isOwner = post.author.toString() === req.user._id.toString();
const isAdmin = req.user.role === 'admin';
if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized' });
await post.deleteOne();
res.json({ message: 'Post deleted successfully' });
} catch (err) { res.status(500).json({ message: err.message }); }
});

// ── POST /api/posts/:id/comment — Add comment to post
router.post('/:id/comment', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment cannot be empty' });
    }
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.comments.push({
      author: req.user._id,
      text: text.trim(),
      createdAt: new Date(),
    });
    await post.save();
    await post.populate('comments.author', 'name profilePic');
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE /api/posts/:id/comment/:commentId — Delete comment
router.delete('/:id/comment/:commentId', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    const isCommentOwner = comment.author.toString() === req.user._id.toString();
    const isPostOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isCommentOwner && !isPostOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    post.comments.id(req.params.commentId).deleteOne();
    await post.save();
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/posts/:id/like — Like/unlike post
router.post('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    const userLiked = post.likes.includes(req.user._id);
    const userDisliked = post.dislikes.includes(req.user._id);
    
    if (userLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
      if (userDisliked) {
        post.dislikes = post.dislikes.filter(id => id.toString() !== req.user._id.toString());
      }
    }
    
    await post.save();
    res.json({ likes: post.likes.length, dislikes: post.dislikes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/posts/:id/dislike — Dislike/un-dislike post
router.post('/:id/dislike', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    const userDisliked = post.dislikes.includes(req.user._id);
    const userLiked = post.likes.includes(req.user._id);
    
    if (userDisliked) {
      post.dislikes = post.dislikes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      post.dislikes.push(req.user._id);
      if (userLiked) {
        post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
      }
    }
    
    await post.save();
    res.json({ likes: post.likes.length, dislikes: post.dislikes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;