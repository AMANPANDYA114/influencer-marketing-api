import express from 'express';
import { getPost ,uploadMediaPost, deletePost, getFeedPosts, getUserPosts,likePost ,addComment,getComments ,deleteComment ,getUserDetails} from '../controllers/post.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
router.get('/post/:id', authMiddleware, getPost); 


router.put('/create-post',authMiddleware,uploadMediaPost)
// router.put('/create-post',authMiddleware,uploadMediaPost);
router.delete('/post/:id', authMiddleware, deletePost);
router.get('/feed', authMiddleware, getFeedPosts); 
router.get('/posts/:username', authMiddleware, getUserPosts); 
router.post('/like/:id',authMiddleware, likePost);
router.post('/post/:id/comment',authMiddleware, addComment);
router.get('/post/:id/comments',authMiddleware, getComments);
router.delete('/post/:postId/comments/:commentId', authMiddleware, deleteComment);
router.get('/getuserdetails/:id', getUserDetails);

export default router;