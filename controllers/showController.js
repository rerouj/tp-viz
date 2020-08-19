var Show = require('../models/show');

exports.index = function(req, res) {
    res.send('NOT IMPLEMENTED: Site Home Page');
};
exports.show_count = (req, res, next)=>{
    Show.countDocuments({}, (err, count)=>{
        if(err) return next(err);
        req.show_count = count;
        next()
    })
}

//api
exports.api_show_count = function(req, res) {
    analysis_type = req.params.type
    if (analysis_type == 'count'){
        Show.countDocuments({}, (err, count)=>{
            if(err) return next(err);
            res.sendStatus(count);
        })
    }else{
        res.send('analysis available : count')
    }
};