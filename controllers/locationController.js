var Location = require('../models/location');
var Show = require('../models/show');

exports.insight = function(req, res){
    analysis_type = req.params.type;
    if (analysis_type == 'count'){
        Location.countDocuments({}, (err, count)=>{
            if(err) return next(err);
            res.send({'location_count': count})
        })
    }else if(analysis_type == 'country'){
        // other count style...
        Location.find({'geo_data.types' : "country"})
            .exec((err, docs)=>{
                count_country = docs.length
                res.send({'country_count': count_country})
            })
    }else if(analysis_type == 'city'){
        Location.countDocuments({"geo_data.types": "locality"}, (err, count)=>{
            if(err) return next(err);
            res.send({'city_count': count});
        })
    }
}
// Display locations.
exports.location_list = function(req, res) {
    var name = req.params.name;
    if(name){
        Location.findOne({archive_name: name.toUpperCase()})
            .exec((err, docs)=>{
                res.send(docs.length != 0 ? docs : 'location unavailable')    
            });
        //const items = await db.collection('locations').find({'archive_name':name.toUpperCase()}).toArray();
    }else{
        Location.findOne({archive_name: 'LAUSANNE'})
            .populate('show_id.mongo_id')
            .exec((err, docs)=>{
            res.send(docs.show_id[0].mongo_id.title)
        });
    }
};

exports.location_count = (req, res, next)=>{
    Location.countDocuments({}, (err, count)=>{
        if(err) return next(err);
        req.location_count = count
        next()
    })
}

exports.locality_count = (req, res, next)=>{
    Location.countDocuments({"geo_data.types": "locality"}, (err, count)=>{
        if(err) return next(err);
        req.locality_count = count
        next()
    })
}
exports.country_count = (req, res, next)=>{
    Location.countDocuments({"geo_data.types": "country"}, (err, count)=>{
        if(err) return next(err);
        req.country_count = count;
        next()
    })
}

exports.location_total_per_year = (req, res, next)=>{
    Show.find({},{"publicationDate": 1})
    //.populate("show_id.mongo_id", "title publicationDate")
    .then((docs)=>{
        year_laps = [...Array(2021).keys()].slice(1969,)
        year_obj = {}
        total = 0
        trend_array = []
        year_laps.forEach(year => {
            year_obj[year] = 0
            docs.forEach(doc => {
                let y = new Date(doc.publicationDate).getFullYear()
                if (y === year){
                    year_obj[year] += 1
                }
            })
        })
        req.count = year_obj;
        next()
    })
}
exports.location_trend = (req, res, next)=>{
    location = req.params.place.toUpperCase()
    Location.findOne({'archive_name': location})
    .then((doc)=>{
        //get country name
        //todo handle errors
        return doc.geo_data[0].address_components.find((obj)=>{
            return obj.types[0] == 'country'
        })
    }).then((obj)=>{
        // compte le nombre de documentaire où un nom de lieux est mentionnée, même si ce nom de lieux est mentionnée avec d'autre nom de lieux appartenant au même niveau administratif
        // le problème : des documentaires sont mentionnés plusieurs fois à cause des références croisées
        var test = [];
        country_name = obj.long_name
        Location.find({"geo_data.0.address_components.long_name":country_name})
        .populate("show_id.mongo_id", "title publicationDate")
        .then((docs)=>{
            var d = docs;
            year_laps = [...Array(2021).keys()].slice(1969,)
            total = 0
            trend_array = []
            year_laps.forEach(year => {
                count = 0
                tmp_res = []
                docs.forEach(doc => {
                    filtered_docs = doc.show_id.filter(item => {
                        return new Date(item.mongo_id.publicationDate).getFullYear() === year ? true : false
                    })
                    if (filtered_docs.length >= 1){
                        count += filtered_docs.length
                        tmp_res.push(filtered_docs)
                    }
                });
                // exclude crossed values
                tmp_res = tmp_res.reduce((x, y)=> x.concat(y), [])
                tmp_res = tmp_res.map(x => x.mongo_id._id)
                tmp_res = Array.from(new Set(tmp_res))
                //console.log(tmp_res);

                // prepare trend temporary object
                tmp_obj = {};
                tmp_obj['original_request'] = req.params.place;
                tmp_obj['request'] = country_name;
                tmp_obj[year] = tmp_res.length;
                tmp_obj['date'] = year;
                tmp_obj['count'] = tmp_res.length;
                tmp_obj['show'] = tmp_res;
                trend_array.push(tmp_obj);
                total = total + tmp_res.length
            })

            //init shared var
            req.trend = {
                request: req.params.place,
                label: country_name, 
                total: total, 
                data: trend_array
            };
            next()
        }) 
    })
}

exports.geo_json = (req, res, next)=>{
    var place = req.params.place;
    var geo_json_array = [];
    if (place){

    }else{
        Location.find()
        .populate('show_id.mongo_id', 'title publicationDate mediaURL imageURL')
        .then(docs=>{
            //console.log(docs)
            docs.forEach(doc=>{
                var show_info = doc.show_id.map(x => {
                    //console.log(x)
                    return {
                        title: x.mongo_id.title,
                        publicationDate: x.mongo_id.publicationDate,
                        mediaURL: x.mongo_id.mediaURL,
                        imageURL: x.mongo_id.imageURL,
                    }
                })
                //console.log(show_info)
                tmp = {
                    "type": "Feature",
                    "geometry": {
                      "type": "Point",
                      "coordinates": [doc.geo_data[0].geometry[0].location.lng, doc.geo_data[0].geometry[0].location.lat]
                    },
                    "properties": {
                      "name": doc.archive_name,
                      "alias": doc.alias,
                      "show_infos": show_info,
                      "wiki": doc.wiki_data.summary,
                      "type": doc.geo_data[0].types[0]
                    }
                }
                geo_json_array.push(tmp);
            })
            req.geo_json = geo_json_array;
            next();
        })
    }
}

//exports.test1 = (req, res, next)=>{
//    Location.countDocuments()
//        .then((err, data)=>{
//            return data
//        })
//        .then((data)=>{
//            Location.countDocuments({"geo_data.types": "locality"})
//            .then((data2)=>{
//                res.render('viz', {
//                    title: data,
//                    title2: data2
//                  });
//            })
//        }).catch(next)
//}

//exports.test1 = (req, res, next)=>{
//    Location.countDocuments({}, (err, count)=>{
//        if(err) return next(err);
//        req.data = count
//        next()
//    })
//}
//exports.test2 = (req, res, next)=>{
//    Location.countDocuments({"geo_data.types": "locality"}, (err, count)=>{
//        if(err) return next(err);
//        res.render('viz', {
//          title: req.data,
//          title2: count
//        });
//    })
//}

//exports.test1 = Location.countDocuments({}, (err, count)=>{
//        if(err) return next(err);
//        return({'location_count': count})
//    })
//exports.test2 = Location.countDocuments({"geo_data.types": "locality"}, (err, count)=>{
//    if(err) return next(err);
//    return({'city_count': count});
//})
//.exec((err, docs)=>{
//    if(err) return next(err);
//    count_country = docs.length
//    return({'country_count': count_country})
//    })