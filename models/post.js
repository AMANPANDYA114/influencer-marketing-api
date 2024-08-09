

import mongoose from 'mongoose';


const mediaSchema = new mongoose.Schema({
    type: { type: String, enum: ['image', 'video'] },
    url: { type: String },
    views: { type: Number, default: 0 },  
    viewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]  
});


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


const Post = mongoose.model('Post', postSchema);

export default Post;






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

