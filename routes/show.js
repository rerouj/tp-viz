var show_controller = require('../controllers/showController');
const assert = require('assert');
var express = require('express');
var router = express.Router();

router.get('/insight/:type?', show_controller.api_show_count);

router.get('/', function(req, res, next) {
    res.send('show api endpoint');
  });

module.exports = router