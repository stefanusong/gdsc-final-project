const router = require('express').Router();
const isAuthenticated = require('../middleware/auth.middleware');
const { addPost, updatePost, deletePost, getAllPosts, getPostById } = require('../controllers/post.controller');

router.post('/add-post', isAuthenticated, addPost);
router.put('/update-post/:postId', isAuthenticated, updatePost);
router.delete('/delete-post/:postId', isAuthenticated, deletePost);
router.get('/', getAllPosts);
router.get('/:postId', getPostById);

module.exports = router;