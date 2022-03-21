const { buildResp } = require('../helpers/response.helper');
const Post = require('../models/post.model');
const Category = require('../models/category.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');

const addPost = async (req, res) => {
    const { postTitle, postImage, postDescription, categoryId, userId } = req.body;

    // check postImage extension
    if (postImage.split('.').pop() !== 'jpg' && postImage.split('.').pop() !== 'png' && postImage.split('.').pop() !== 'jpeg') {
        let response = buildResp(400, "Invalid image extension", [], []);
        return res.status(400).send(response);
    }

    // cast id to object id
    const categoryIdObj = mongoose.Types.ObjectId(categoryId);
    const userIdObj = mongoose.Types.ObjectId(userId);


    // create new post and save it
    const newPost = new Post({
        postTitle,
        postImage,
        postDescription,
        category: categoryIdObj,
        user: userIdObj
    });

    newPost.save()
        .then(post => {

            let createdAt = post.createdAt;
            let postId = post._id;

            // get post user
            User.findById(userIdObj)
                .then(user => {
                    // get post category
                    Category.findById(categoryIdObj)
                        .then(category => {
                            // construct post response
                            post.user = user;
                            post.category = category;
                            post = constructPostResponse(post);
                            post.createdAt = createdAt;
                            post.postId = postId;

                            let response = buildResp(201, "Post added successfully !", post, []);
                            res.status(201).send(response);
                        })
                        .catch(err => {
                            let response = buildResp(400, "Failed to get post category", [], err.message);
                            res.status(400).send(response);
                        });
                })
                .catch(err => {
                    let response = buildResp(400, "Failed to get post user", [], err.message);
                    res.status(400).send(response);
                });
        })
        .catch(err => {
            let response = buildResp(400, "Failed to create post", [], err.message);
            res.status(400).send(response);
        });
}

const getAllPosts = (req, res) => {
    Post.find()
        .then(posts => {
            if (posts.length === 0) {
                let response = buildResp(200, "The post is still empty", [], []);
                res.status(200).send(response);
            } else {
                posts = posts.map(post => {
                    return {
                        postTitle: post.postTitle,
                        postDescription: post.postDescription,
                        postImage: post.postImage,
                        href: `http://localhost:3000/api/v1/posts/${post._id}`
                    }
                });
                let response = buildResp(200, "Successfuly get all posts", posts, []);
                res.status(200).send(response);
            }
        })
        .catch(err => {
            let response = buildResp(400, "Failed to get posts", [], err.message);
            res.status(400).send(response);
        });
}

const getPostById = (req, res) => {
    const { postId } = req.params;

    Post.findById(postId)
        .populate('category')
        .populate('user')
        .then(post => {
            if (!post) {
                let response = buildResp(404, "Post not found", [], []);
                res.status(404).send(response);
            } else {
                post = constructPostResponse(post);
                let response = buildResp(200, "Successfuly get post", post, []);
                res.status(200).send(response);
            }
        })
        .catch(err => {
            console.log(err)
            let response = buildResp(400, "Failed to get post", [], err.message);
            res.status(400).send(response);
        });
}

const deletePost = (req, res) => {
    const { postId } = req.params;

    Post.findByIdAndDelete(postId)
        .populate('category')
        .populate('user')
        .then(post => {
            if (!post) {
                let response = buildResp(404, "Post not found", [], []);
                res.status(404).send(response);
            } else {
                post = constructPostResponse(post);
                let response = buildResp(200, "Successfuly delete post", post, []);
                res.status(200).send(response);
            }
        })
        .catch(err => {
            let response = buildResp(400, "Failed to delete post", [], err.message);
            res.status(400).send(response);
        });
}

const updatePost = (req, res) => {
    const { postId } = req.params;
    const { postTitle, postImage, postDescription, categoryId } = req.body;

    // Update post
    Post.findByIdAndUpdate(postId, {
        postTitle,
        postImage,
        postDescription,
        category: categoryId,
    })
        .populate('category')
        .populate('user')
        .then(post => {
            if (!post) {
                let response = buildResp(404, "Post not found", [], []);
                res.status(404).send(response);
            } else {
                post = constructPostResponse(post);
                let response = buildResp(200, "Successfuly update post", post, []);
                res.status(200).send(response);
            }
        })
        .catch(err => {
            let response = buildResp(400, "Failed to update post", [], err.message);
            res.status(400).send(response);
        });

}

const constructPostResponse = (post) => {
    // map post category
    category = {
        categoryName: post.category.categoryName,
    };

    // map post user
    user = {
        userName: post.user.userName,
        userEmail: post.user.userEmail,
        href: `http://localhost:3000/api/v1/users/${post.user._id}`
    };

    return {
        postTitle: post.postTitle,
        postDescription: post.postDescription,
        postImage: post.postImage,
        user: user,
        category: category,
    };
}

module.exports = {
    addPost,
    updatePost,
    deletePost,
    getAllPosts,
    getPostById
}