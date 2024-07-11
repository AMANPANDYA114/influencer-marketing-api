import express from 'express';
import { getPost, createPost, deletePost, getFeedPosts, getUserPosts,likePost ,addComment,getComments ,deleteComment} from '../controllers/post.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
router.get('/post/:id', authMiddleware, getPost); 
router.post('/create/post', authMiddleware, createPost); 
router.delete('/post/:id', authMiddleware, deletePost);
router.get('/feed', authMiddleware, getFeedPosts); 
router.get('/posts/:username', authMiddleware, getUserPosts); 
router.post('/like/:id',authMiddleware, likePost);
router.post('/post/:id/comment',authMiddleware, addComment);
router.get('/post/:id/comments',authMiddleware, getComments);
router.delete('/post/:postId/comments/:commentId', authMiddleware, deleteComment);

export default router;