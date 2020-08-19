var graph_controller = require('../controllers/graphController');
var express = require('express');
var router = express.Router();

router.get('/', graph_controller.graph, (req, res)=>{
    res.send(req.graph);
});

module.exports = router