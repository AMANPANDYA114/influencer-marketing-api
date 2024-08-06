
import upload from '../middlewares/multer.js';
import Post from '../models/post.js';
import UserProfile from '../models/profile .js';
import User from '../models/user.js';
import cloudinary from '../utils/cloudinary.js';

// upload post vidoe or with images 


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

export const createVideoPost = async (req, res) => {
    try {
        // Handle file upload using multer with video-only configuration
        upload.array('postmedia', 10)(req, res, async function (err) {
            if (err) {
                console.log('Error uploading files:', err);
                return res.status(500).json({ error: 'Error uploading files' });
            }

            const { text } = req.body;
            const userId = req.user._id;

            // Validate text input
            if (!text) {
                return res.status(400).json({ error: 'Text field is required' });
            }

            // Find user by ID
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Validate text length (Optional, if you still want this check)
            const maxLength = 500;
            if (text.length > maxLength) {
                return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });
            }

            // Array to store uploaded video URLs
            let mediaFiles = [];

            // Process each uploaded file
            if (req.files) {
                try {
                    for (const file of req.files) {
                        // Check if the file is a video
                        if (file.mimetype.startsWith('video')) {
                            // Upload video file to Cloudinary
                            const uploadedResponse = await cloudinary.uploader.upload(file.path, { resource_type: 'video' });
                            console.log('Video uploaded successfully:', uploadedResponse.secure_url);

                            // Store the uploaded video URL in mediaFiles array
                            mediaFiles.push({ type: 'video', url: uploadedResponse.secure_url });
                        } else {
                            // If the file type is not a video, return an error
                            return res.status(400).json({ error: 'Only video files are allowed' });
                        }
                    }
                } catch (uploadError) {
                    // Handle upload errors
                    console.log('Error during file upload:', uploadError);
                    return res.status(500).json({ error: 'Error during file upload' });
                }
            }

            // Create a new Post document
            const newPost = new Post({
                postedBy: userId,
                text,
                media: mediaFiles, // Store uploaded media URLs
                userFullName: user.fullName,
            });

            try {
                // Save the new post to the database
                await newPost.save();
                console.log('Post saved successfully to database:', newPost._id);

                // Optionally fetch user profile information
                const userProfile = await UserProfile.findOne({ userId });

                // Return a success response with the details of the saved post
                res.status(201).json({
                    _id: newPost._id,
                    text: newPost.text,
                    media: newPost.media,
                    createdAt: newPost.createdAt,
                    userFullName: user.fullName,
                    profilePicUrl: userProfile ? userProfile.profilePicUrl : null,
                });
            } catch (saveError) {
                // Handle errors saving the post
                console.log('Error saving post to database:', saveError);
                res.status(500).json({ error: 'Error saving post to database' });
            }
        });
    } catch (err) {
        // Handle unexpected errors
        res.status(500).json({ error: err.message });
        console.log('Unexpected error:', err);
    }
};

export const createPost = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
        
        upload.single('postmedia')(req, res, async function (err) {
            if (err) {
                console.log('Error uploading file:', err);
                return res.status(500).json({ error: 'Error uploading file' });
            }

            console.log('After multer middleware - Request file:', req.file);

            const { text } = req.body;
            const userId = req.user._id;

            console.log('Text from body:', text);
            console.log('User ID from token:', userId);

            if (!text) {
                console.log('Text field is missing');
                return res.status(400).json({ error: 'Text field is required' });
            }

            const user = await User.findById(userId);
            if (!user) {
                console.log('User not found:', userId);
                return res.status(404).json({ error: 'User not found' });
            }

            const maxLength = 500;
            if (text.length > maxLength) {
                console.log('Text length exceeds maximum allowed length');
                return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });
            }

            let mediaFile = null;
            if (req.file) {
                try {
                    console.log('File details for Cloudinary upload:', req.file);
                    if (req.file.mimetype.startsWith('image')) {
                        const uploadedResponse = await cloudinary.uploader.upload(req.file.path);
                        console.log('Cloudinary upload response:', uploadedResponse);
                        mediaFile = { type: 'image', url: uploadedResponse.secure_url };
                    } else {
                        console.log('File type is not allowed:', req.file.mimetype);
                        return res.status(400).json({ error: 'Only image files are allowed' });
                    }
                } catch (uploadError) {
                    console.log('Error during Cloudinary file upload:', uploadError);
                    return res.status(500).json({ error: 'Error during file upload' });
                }
            }

            const newPost = new Post({
                postedBy: userId,
                text,
                media: mediaFile ? [mediaFile] : [],
                userFullName: user.fullName,
            });

            try {
                console.log('Saving new post:', newPost);
                await newPost.save();
                console.log('Post saved successfully:', newPost._id);

                const userProfile = await UserProfile.findOne({ userId });
                console.log('User profile:', userProfile);

                res.status(201).json({
                    _id: newPost._id,
                    text: newPost.text,
                    media: newPost.media,
                    createdAt: newPost.createdAt,
                    userFullName: user.fullName,
                    profilePicUrl: userProfile ? userProfile.profilePicUrl : null,
                });
            } catch (saveError) {
                console.log('Error saving post:', saveError);
                res.status(500).json({ error: 'Error saving post' });
            }
        });
    } catch (err) {
        console.log('Unexpected error:', err);
        res.status(500).json({ error: err.message });
    }
};




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




// Get feed posts for the logged-in user
export const getFeedPosts = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

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

}
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

        // Add the new comment to the beginning of the comments array
        post.comments.unshift(newComment);
        await post.save();

        res.status(201).json({ message: 'Comment added successfully', comment: newComment });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

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

        // Sort comments by createdAt timestamp in descending order
        post.comments.sort((a, b) => b.createdAt - a.createdAt);

        const commentsCount = post.comments.length;

        res.status(200).json({ comments: post.comments, commentsCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;

       
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

       
        const comment = post.comments.find(comment => comment._id.toString() === commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

       
        if (comment.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized: You are not allowed to delete this comment' });
        }

        post.comments = post.comments.filter(comment => comment._id.toString() !== commentId);
        await post.save();

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
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

        // Check if post has media (images or videos)
        if (post.media && post.media.length > 0) {
            await Promise.all(post.media.map(async (mediaItem) => {
                if (mediaItem.type === 'video') {
                    // Handle video deletion from Cloudinary
                    const videoId = mediaItem.url.split("/").pop().split(".")[0];
                    await cloudinary.uploader.destroy(videoId);
                } else if (mediaItem.type === 'image') {
                    // Handle image deletion from Cloudinary if needed
                    const imageId = mediaItem.url.split("/").pop().split(".")[0];
                    await cloudinary.uploader.destroy(imageId);
                }
            }));
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getUserDetails = async (req, res) => {
    try {
        const userId = req.params.id;

        
        const user = await User.findById(userId).select('-password -confirmPassword');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

      
        const userProfile = await UserProfile.findOne({ userId });

    
        const followersDetails = await Promise.all(user.followers.map(async (followerId) => {
            const follower = await User.findById(followerId).select('fullName username');
            const followerProfile = await UserProfile.findOne({ userId: followerId }).select('profilePicUrl');
            return {
                _id: followerId,
                username: follower.username,
                fullName: follower.fullName,
                profilePicUrl: followerProfile ? followerProfile.profilePicUrl : null,
              
            };
        }));

        
        const followingDetails = await Promise.all(user.following.map(async (followingId) => {
            const following = await User.findById(followingId).select('fullName  username');
            const followingProfile = await UserProfile.findOne({ userId: followingId }).select('profilePicUrl');
            return {
                _id: followingId,
                fullName: following.fullName,
                username: following.username,
                profilePicUrl: followingProfile ? followingProfile.profilePicUrl : null,
            };
        }));

 
        const postCount = await Post.countDocuments({ postedBy: userId });

  
        const userDetails = {
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            age: user.age,
            account: user.account,
            createdAt: user.createdAt,
            followers: followersDetails,
            following: followingDetails,
            followersCount: user.followers.length,
            followingCount: user.following.length,
            postCount: postCount,
            role: user.role,
            profilePicUrl: userProfile ? userProfile.profilePicUrl : null,
            userBio: userProfile ? userProfile.userBio : null,
            backgroundImage: userProfile ? userProfile.backgroundImage : null,
        };

        res.status(200).json(userDetails);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const getUserPostsById = async (req, res) => {
    try {
        const userId = req.params.id; 

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const posts = await Post.find({ postedBy: userId }).sort({ createdAt: -1 });

        const userProfile = await UserProfile.findOne({ userId });

        const postsWithProfilePics = posts.map(post => {
            const { media, ...rest } = post._doc;
            const imageMedia = media.filter(mediaItem => mediaItem.type === 'image');
            return {
                ...rest,
                media: imageMedia,
                profilePicUrl: userProfile ? userProfile.profilePicUrl : null,
                likeCount: post.likes.length,
                
                  commentsCount :post.comments.length
            };
        }).filter(post => post.media.length > 0); 

        res.status(200).json(postsWithProfilePics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};






export const getuservideos = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const posts = await Post.find({ postedBy: userId }).sort({ createdAt: -1 });

        const userProfile = await UserProfile.findOne({ userId });

        const postsWithProfilePics = posts.map(post => {
            const { media, ...rest } = post._doc;
            // Filter out video media
            const imageMedia = media.filter(mediaItem => mediaItem.type === 'video');
            return {
                ...rest,
                media: imageMedia,
                profilePicUrl: userProfile ? userProfile.profilePicUrl : null,
                likeCount: post.likes.length,
            };
        }).filter(post => post.media.length > 0); 

        res.status(200).json(postsWithProfilePics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};