const express = require('express')
const router = express.Router()
const {updateDetail} = require('../controllers/DetailController')
const Auth = require('../controllers/Auth')
router.post('/update', updateDetail)

module.exports = router