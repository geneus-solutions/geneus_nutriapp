const express = require('express')
const router = express.Router()
const {updateToPremium} = require('../controllers/PlanController')
const {Auth} = require('../controllers/Auth')
router.put('/',Auth, updateToPremium)

module.exports = router