const path = require('path');
const express = require('express');

const adminCon = require('../controllers/login');

const router = express.Router();


router.get('/',adminCon.get_test);



module.exports = router;