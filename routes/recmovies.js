const path = require('path');
const express = require('express');

const adminCon = require('../controllers/recmovies');

const router = express.Router();


router.get('/',adminCon.get_test);



module.exports = router;
