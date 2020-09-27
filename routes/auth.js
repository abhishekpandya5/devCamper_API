const express = require('express');
const { register, login, getMe } = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middlewares/auth');

// router.route('/register').post(register);
// router.route('/login').post(login);
// router.route('/me').get(protect, getMe);

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;