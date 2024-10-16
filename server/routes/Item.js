const express = require('express')
const router = express.Router()
const {createItem, getItems} = require('../controllers/ItemController')

router.post('/', createItem)
router.get('/', getItems)

module.exports = router