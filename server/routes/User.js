const express = require('express')
const router = express.Router()
const {getUser,registerUser, loginUser} = require('../controllers/UserController')
const {Auth, refreshTokenHandler} = require('../controllers/Auth')
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/', Auth, getUser);
router.post('/refresh', refreshTokenHandler);
module.exports = router