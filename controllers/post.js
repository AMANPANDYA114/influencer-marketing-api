
import User from '../models/user.js';
import Post from '../models/post.js';
import UserProfile from '../models/profile .js';
import cloudinary from '../utils/cloudinary.js';
import upload from '../middlewares/multer.js';

export const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('postedBy', 'fullName username');

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const userProfile = await UserProfile.findOne({ userId: post.postedBy._id });
        const postWithProfilePic = {
            ...post._doc,
            profilePicUrl: userProfile ? userProfile.profilePicUrl : null,
        };

        res.status(200).json(postWithProfilePic);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createPost = async (req, res) => {
    try {
        upload.array('postimage', 10)(req, res, async function (err) {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Error uploading files' });
            }
            const { text } = req.body;
            const userId = req.user._id;
            if (!text) {
                return res.status(400).json({ error: 'Text field is required' });
            }
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const maxLength = 500;
            if (text.length > maxLength) {
                return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });
            }

            let imageUrls = [];
            if (req.files && req.files.length > 0) {
                imageUrls = await Promise.all(
                    req.files.map(async (file) => {
                        const uploadedResponse = await cloudinary.uploader.upload(file.path);
                        return uploadedResponse.secure_url;
                    })
                );
            }

            const newPost = new Post({
                postedBy: userId,
                text,
                img: imageUrls,
                userFullName: user.fullName,
            });
            await newPost.save();

            const userProfile = await UserProfile.findOne({ userId });

            res.status(201).json({
                _id: newPost._id,
                text: newPost.text,
                img: newPost.img,
                createdAt: newPost.createdAt,
                userFullName: user.fullName,
                profilePicUrl: userProfile ? userProfile.profilePicUrl : null,
            });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
};
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.postedBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "Unauthorized to delete this post" });
        }
        if (post.img && typeof post.img === 'string') {
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }
    

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};




// export const deletePost = async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.id);

//         if (!post) {
//             return res.status(404).json({ error: "Post not found" });
//         }

//         if (post.postedBy.toString() !== req.user._id.toString()) {
//             return res.status(401).json({ error: "Unauthorized to delete this post" });
//         }

//         if (post.img) {
//             const imgId = post.img.split("/").pop().split(".")[0];
//             await cloudinary.uploader.destroy(imgId);
//         }

//         await Post.findByIdAndDelete(req.params.id);
//         res.status(200).json({ message: "Post deleted Successfully" });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };
export const likePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const likeIndex = post.likes.indexOf(userId);
        if (likeIndex === -1) {
            // If the user has not liked the post, add the like
            post.likes.push(userId);
            await post.save();
            return res.status(200).json({ message: "Post liked successfully" });
        } else {
            // If the user has already liked the post, remove the like
            post.likes.splice(likeIndex, 1);
            await post.save();
            return res.status(200).json({ message: "Post unliked successfully" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getFeedPosts = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User Not Found" });
        }

        // Include the logged-in user's ID in the list of IDs to fetch posts for
        const following = [...user.following, userId];

        if (following.length === 0) {
            return res.status(200).json({ message: "No users followed", posts: [] });
        }

        const feedPosts = await Post.find({ postedBy: { $in: following } })
            .sort({ createdAt: -1 })
            .populate('postedBy', 'fullName username');

        const postsWithProfilePics = await Promise.all(feedPosts.map(async (post) => {
            const userProfile = await UserProfile.findOne({ userId: post.postedBy._id });
            return {
                ...post._doc,
                profilePicUrl: userProfile ? userProfile.profilePicUrl : null,
                likeCount: post.likes.length 
            };
        }));

        res.status(200).json(postsWithProfilePics);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getUserPosts = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const posts = await Post.find({ postedBy: user._id }).sort({
            createdAt: -1, 
        });

        const userProfile = await UserProfile.findOne({ userId: user._id });

        const postsWithProfilePics = posts.map(post => ({
            ...post._doc,
            profilePicUrl: userProfile ? userProfile.profilePicUrl : null,
        }));

        res.status(200).json(postsWithProfilePics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Comment text is required' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userProfile = await UserProfile.findOne({ userId });

        const newComment = {
            userId: userId,
            text: text,
            userProfilePic: userProfile ? userProfile.profilePicUrl : null,
            username: user.username,
        };

        post.comments.push(newComment);
        await post.save();

        res.status(201).json({ message: 'Comment added successfully', comment: newComment });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// export const getComments = async (req, res) => {
//     try {
//         const postId = req.params.id;

//         const post = await Post.findById(postId).populate('comments.userId', 'username');
//         if (!post) {
//             return res.status(404).json({ error: 'Post not found' });
//         }

//         res.status(200).json(post.comments);
//     }  catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };




export const getComments = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await Post.findById(postId).populate({
            path: 'comments.userId',
            select: 'username fullName' // Specify fields to select
        });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const commentsCount = post.comments.length;

        res.status(200).json({ comments: post.comments, commentsCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
