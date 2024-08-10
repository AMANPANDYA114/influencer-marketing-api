import mongoose from 'mongoose';

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
    media: [{
        type: { type: String, enum: ['image', 'video'] },
        url: { type: String }
    }],
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
    }],
    viewCount: {
        type: Number,
        default: 0
    },
    viewers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

export default mongoose.model('Post', postSchema);


