const router = require('express').Router();
const UserController = require('../controllers/UserController');

// middlewares
const verityToken = require('../helpers/verify-token');
const { imageUpload } = require('../helpers/image-upload');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/checkUser', UserController.checkUser);
router.get('/:id', UserController.getUserById);
router.patch('/edit/:id', verityToken, imageUpload.single('image'), UserController.editUser);

module.exports = router