import express from 'express';
import { getPost, createPost, deletePost, getFeedPosts, getUserPosts,likePost ,addComment,getComments ,deleteComment ,getUserDetails} from '../controllers/post.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
router.get('/post/:id', authMiddleware, getPost); 
// router.post('/create/post', authMiddleware, createPost); 


router.post('/create/post', authMiddleware, async (req, res) => {
   
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Return response
    return res.status(200).json({ message: 'Post created successfully' });
});

router.delete('/post/:id', authMiddleware, deletePost);
router.get('/feed', authMiddleware, getFeedPosts); 
router.get('/posts/:username', authMiddleware, getUserPosts); 
router.post('/like/:id',authMiddleware, likePost);
router.post('/post/:id/comment',authMiddleware, addComment);
router.get('/post/:id/comments',authMiddleware, getComments);
router.delete('/post/:postId/comments/:commentId', authMiddleware, deleteComment);
router.get('/getuserdetails/:id', getUserDetails);

export default router;