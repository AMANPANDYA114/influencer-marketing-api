


// import mongoose from 'mongoose';

// const postSchema = new mongoose.Schema({
//     postedBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     text: {
//         type: String,
//         required: true
//     },
//     media: [{
//         type: { type: String, enum: ['image', 'video'] },
//         url: { type: String }
//     }],
//     userFullName: {
//         type: String,
//         required: true
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     comments: [{
//         userId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User',
//             required: true
//         },
//         text: {
//             type: String,
//             required: true
//         },
//         userProfilePic: {
//             type: String
//         },
//         username: {
//             type: String,
//             required: true
//         },
//         createdAt: {
//             type: Date,
//             default: Date.now
//         }
//     }],
//     likes: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     }]
// });

// const Post = mongoose.model('Post', postSchema);

// export default Post;

import mongoose from 'mongoose';

// Define the media schema with a field to track users who have viewed the media
const mediaSchema = new mongoose.Schema({
    type: { type: String, enum: ['image', 'video'] },
    url: { type: String },
    views: { type: Number, default: 0 },  // Field to count views
    viewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]  // Track users who have viewed the media
});

// Define the post schema using the media schema
const postSchema = new mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    media: [mediaSchema],  // Embed the media schema here
    userFullName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    comments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String,
            required: true
        },
        userProfilePic: {
            type: String
        },
        username: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

// Create the Post model
const Post = mongoose.model('Post', postSchema);

export default Post;
