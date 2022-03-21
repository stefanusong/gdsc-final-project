const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    postTitle: {
        type: String,
        required: true,
        minLength: [5, 'post title must be at least 5 characters'],
        maxLength: [20, 'post title must be at most 20 characters'],
    },
    postImage: {
        type: String,
        required: false
    },
    postDescription: {
        type: String,
        required: true,
        minLength: [5, 'post description must be at least 5 characters'],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
}, {
    timestamps: true
}
);

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;