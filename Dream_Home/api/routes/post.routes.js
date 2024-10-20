const express = require('express');
const authenticateJWT = require('../middleware/authenticateJWT');
const { allPost, allUserPost, addPost, updatePost, getSavedPost, bookmarkPost, removeSavedPost, singlePost } = require('../controllers/post.controller');

const router = express.Router();

router.get('/', allPost);
router.get('/property/:id', singlePost);
router.get('/:id', authenticateJWT, allUserPost);
router.post('/:id/addpost', authenticateJWT, addPost);
router.post('/:id/updatepost', authenticateJWT, updatePost);
router.post('/:id/bookmark', authenticateJWT, bookmarkPost);
router.post('/:id/remove', authenticateJWT, removeSavedPost);
router.get('/:id/savedpost', authenticateJWT, getSavedPost);

module.exports = router;
