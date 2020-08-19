var Space = require('../models/space');
var ObjectId = require('mongoose').Types.ObjectId;

exports.space_count = (req, res, next)=>{
    /**
     * get length of the Space collection
     * :returns: int()
     */
    Space.countDocuments()
        .then((count)=>{
            req.space_count = count;
            next()
        })
}

exports.country_average = (req, res, next)=>{
    /**
     * get the average count of country per show
     * returns: int()
     */

    Space.find()
        .populate('space.location', 'archive_name geo_data')
        .then(docs => {
            var country_obj_array = [];
            var sygma = 0
            var country_name_array = [];
            docs.forEach((doc)=>{
                obj_array = [];
                doc.space.forEach((loc)=>{
                    var country_obj = loc.location.geo_data[0].address_components.find((item)=>{
                        return item.types[0] == 'country'
                    })
                    if(country_obj != undefined) obj_array.push(country_obj.long_name)
                    obj_array = Array.from(new Set(obj_array))
                })
                country_obj_array.push(obj_array.length)
                sygma += obj_array.length
            })
            var average = sygma/docs.length;
            req.country_average = average;
            next()
        }) 
}

exports.average_country_distance = (req, res, next)=>{
    /**
     * get the average distance between coutry in a show
     * returns: int
     */
    Space.find()
        .then((docs)=>{
            var sygma = count = 0;
            var dist_array = [];
            docs.forEach((item)=>{
                dist = item.distance.km_btw_country;
                if(dist >= 2){
                    count += 1;
                    sygma += item.distance.km_btw_country;
                    dist_array.push(item.distance.km_btw_country);
                }
            });
            var mediane_country_distance = dist_array.sort()[dist_array.length/2];
            req.average_country_distance = sygma/count;
            req.mediane_country_distance = mediane_country_distance;
            next();
        })
}

exports.average_locality_distance = (req, res, next)=>{
    /**
     * get the average distance between citys
     * returns: int()
     */
    Space.find()
        .then((docs)=>{
            var sygma = count = 0;
            var dist_array = [];
            docs.forEach((item)=>{
                dist = item.distance.city_km_dist;
                if(dist >= 2){
                    count += 1;
                    sygma += item.distance.city_km_dist;
                    dist_array.push(item.distance.city_km_dist);
                }
            });
            var mediane_locality_distance = dist_array.sort()[dist_array.length/2];
            req.average_locality_distance = sygma/count;
            req.mediane_locality_distance = mediane_locality_distance;
            next();
        })
}

exports.get_space_by_name = (req, res, next)=>{

    /**
     * get all show occurence where the requested name is identified
     * results are classified in the following fields: 
     * national = count of show's subject where topic is entirely about the seleted country
     * international = count of shows where the topic is about the selected country and at leat one other country
     * foreign = count of show where the topic is not about the selected country
     * params: country (country name)
     * returns: obj()
     */

    selected_country = req.params.country;

    Space.find({}, {_id: 1})
    .populate('space.location')
    .then((docs)=>{
        var swiss_count = foreign_count = international_count = 0;
        var queried_space_array = [],
            international_space_array = [],
            foreign_space_array = [];
        docs.forEach((doc)=>{
            var country_array = [];
            var international_res = false;
            var foreign_res = false;
            var swiss_res = false;
            doc.space.forEach((loc)=>{

                var country_obj = loc.location.geo_data[0].address_components.find((item)=>{
                    return item.types[0] == 'country'
                })
                country_array.push(country_obj)
            })
            country_array = country_array.filter((x) => {
                if(x != undefined){
                    return x
                }
            })

            if(selected_country){
                swiss_res = country_array.every((item) => {
                    country_str = selected_country[0].toUpperCase()+selected_country.slice(1,)
                    return item.long_name === country_str;
                })
                foreign_res = country_array.every((item) => {
                    return item.long_name !== country_str;
                })
                if(country_array.length >= 2){

                    international_res_a = country_array.some(item => {
                        return item.long_name == country_str;
                    })
                    international_res_b = country_array.some(item => {
                        return item.long_name !== country_str;
                    })
                    if(international_res_a && international_res_b) var international_res = true
                }
    
            }else{
                swiss_res = country_array.every((item) => {
                    return item.long_name === "Switzerland";
                })
                foreign_res = country_array.every((item) => {
                    return item.long_name !== "Switzerland";
                })
                if(country_array.length >= 2){
                    var international_res_a = country_array.some(item => {
                        return item.long_name == "Switzerland";
                    })
                    var international_res_b = country_array.some(item => {
                        return item.long_name !== "Switzerland";
                    })
                    if(international_res_a && international_res_b) var international_res = true;
                }
            }
            if(swiss_res) ++swiss_count, queried_space_array.push(doc._id)//append to respective array
            if(foreign_res) ++foreign_count, foreign_space_array.push(doc._id)
            if(international_res) ++international_count, international_space_array.push(doc._id)
        })
        req.get_space_by_name = {
            "national": queried_space_array,
            "international": international_space_array,
            "foreign": foreign_space_array,
            "national_count": queried_space_array.length,
            "international_count": international_space_array.length,
            "foreign_count": foreign_space_array.length,
            "selected_country": selected_country ? selected_country :'Switzerland',
        }
        next()
    })
}
exports.top10 = (req, res, next)=>{
    /**
     * top10 get the classification of the greatest 
     * number of show where a country is 
     * mentionned as part of the subject's space
     * the chart returns all the classification, not only the top 10
     * returns: obj()
     */

    // 1. on détermine la liste des pays en partant de la collection espace
    Space.find({}, {space: 1})
    .populate('space.location', 'geo_data.address_components.long_name geo_data.address_components.types')
    .then((docs)=>{

        var country_obj_array = [];
        var country_name_array = [];

        docs.forEach((doc)=>{
            obj_array = [];
            // pour chaque lieu dans le champs "space"
            doc.space.forEach((loc)=>{

                // a. on récupère les lieux qui sont des pays
                var country_obj = loc.location.geo_data[0].address_components.find((item)=>{
                    return item.types[0] == 'country'
                })
                // b. on ajoute le résultat à la liste "country_name_array"
                country_name_array.push(country_obj)
                // c. si la valeur n'est pas undefined on l'ajoute à la liste "obj_array"
                if(country_obj != undefined) obj_array.push(country_obj)
            })
            country_obj_array.push(obj_array)
        })

        country_name_array = country_name_array.filter((x) => {
            if(x != undefined){
                return x
            }
        }).map(x=> x.long_name)

        country_name_array = Array.from(new Set(country_name_array))

        final_arr = []
        // 2. pour chaque pays dans la liste country_name_array
        country_name_array.forEach(country => {
            national_count = 0;
            international_count = 0;

            //on crée un obj temporaire
            tmp_obj = {
                "country_name":'',
                "national": 0,
                "international": 0,
            }
            country_obj_array.forEach(groupe => {

                national_res = groupe.every(item => {
                    return item.long_name === country;
                })

                if(groupe.length >= 2){

                    international_res_a = groupe.some(item => {
                        return item.long_name == country;
                    })
                    international_res_b = groupe.some(item => {
                        return item.long_name !== country;
                    })
                    if(international_res_a && international_res_b) var international_res = true
                }
            
                if(national_res) ++national_count
                if(international_res) ++international_count
    
            })
            tmp_obj.country_name = country
            tmp_obj.national = national_count
            tmp_obj.international = international_count
            final_arr.push(tmp_obj)    
        })

        req.top10 = final_arr.sort((a, b) =>{
            return b.national - a.national
        });
        next()
    })
}