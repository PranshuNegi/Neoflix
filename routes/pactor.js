const path = require('path');
const express = require('express');

const adminCon = require('../controllers/pactor');

const router = express.Router();


router.get('/',adminCon.get_test);
router.post('/',adminCon.post_test);


module.exports = router;