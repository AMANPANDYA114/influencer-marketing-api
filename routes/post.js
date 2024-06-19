import express from 'express';
import { getPost, createPost, deletePost, getFeedPosts, getUserPosts } from '../controllers/post.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
router.get('/post/:id', authMiddleware, getPost); 
router.post('/create/post', authMiddleware, createPost); 
router.delete('/post/:id', authMiddleware, deletePost);
router.get('/feed', authMiddleware, getFeedPosts); 
router.get('/posts/:username', authMiddleware, getUserPosts); 

export default router;