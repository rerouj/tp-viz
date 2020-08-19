var Space = require('../models/space');
var Location = require('../models/location');

exports.graph = function(req, res, next){
    Location.find({}, {_id:0, archive_name:1, index:1, "geo_data":1})
        .then((docs)=>{
            var nodes = [];
            docs.forEach((e, i) => {
                tmp_obj = {
                    id: e.index,
                    name: e.archive_name,
                    type: e.geo_data[0].types[0],
                    weight: 0
                };
                nodes.push(tmp_obj);
            });
            nodes = nodes.filter(e=>{
                return e.type == "country"
            })
            return nodes;
        })
        .then((nodes)=>{

            var weight_list = {}
            nodes.forEach(e => {
                weight_list[e.id] = 0
            });
            Space.find()
            .populate('country_space.location', 'archive_name index')
            .then(docs=>{
                var links = [];
                docs.forEach(doc=>{
                    var location_list = doc.country_space.map((e)=>{
                        return e.location.index;
                    })
                    // console.log(location_list);
                    if(location_list.length > 1){
                        var stack_a = [location_list[0], location_list[1]];
                        weight_list[stack_a[0]] += 1
                        weight_list[stack_a[1]] += 1
                        links.push({
                            source: stack_a[0], 
                            target: stack_a[1]
                        });
                        location_list = location_list.slice(2,);

                        while (location_list.length > 0){
                            stack_a = [stack_a.pop(), location_list.shift()]
                            tmp_obj = {
                                source: stack_a[0],
                                target: stack_a[1]
                            }
                            links.push(tmp_obj);
                            weight_list[tmp_obj.source] += 1
                            weight_list[tmp_obj.target] += 1
                        }
                    }
                });
                weight_keys = Object.keys(weight_list)
                weight_keys.forEach((e)=>{
                    nodes.find((l)=>{
                        if (l.id == e){
                            l.weight = weight_list[e];
                        };
                    })
                })

                var links_keys = {};
                links.forEach((link)=>{
                    links_keys[link.source+'-'+link.target] = 0
                })
                links.forEach((link)=>{
                    links_keys[link.source+'-'+link.target]++
                })
                links.forEach((link)=>{
                    link['weight'] = links_keys[link.source+'-'+link.target];
                })

                nodes = nodes.filter(e=>{
                    return e.weight > 0;
                })
                var graph_object = {
                    nodes: nodes,
                    links: links
                }    
                req.graph = graph_object;
                next();
            })
        })
    }

