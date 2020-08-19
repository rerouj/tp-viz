/*
var frame = d3.select('.frame_content').node();
var container_width = frame.getBoundingClientRect().width;
var container_height = 600;
var data_store = [];

var margin = {
    top: 20,
    bottom: 20,
    left: 30,
    right: 20
}

var svg = d3.select('.graph').append('svg')
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr('viewBox', [0, 0, container_width, container_height])
                .attr("id", "graph");
var graph_groupe = svg.append('g')
                    .attr("class", "nodes");

var xScale = d3.scaleLinear().domain([0, 150]).range([0, container_width/2]);
var treshold = 100;
var seil = 20;
var weight_scale = d3.scaleLinear()
                .domain([0, 130])
                .range([7, 30])

var xScale = d3.scaleLinear().domain([0, 150]).range([0, container_width/2]);
var color_scale = d3.scaleLinear().domain([0, 150]).range(['#B3CCFF', "#ff3300"])

d3.json('http://localhost:3000/graph')
    .then(function(data){
        // Initialize the links
        var link = svg
            .selectAll("line")
            .data(data.links)
            .enter()
            .append("line")
            .style("stroke", "#aaa")

        // Initialize the nodes
        var nodes = svg.selectAll('g').data(data.nodes).enter().append('g')

        //var node = svg
        //    .selectAll("circle")
        //    .data(data.nodes)
        //    .enter()
        var node = nodes
            .append("circle")
            .attr('r', function(d){
                return weight_scale(d.weight)
            })
            .style("fill", function(d){
                return color_scale(d.weight);
            })
            .call(d3.drag().on("drag", dragged));
        
        var text = nodes.append("text")
        .text(function(d){
            return d.name;
        })
        .attr('font-size', '10px')
        .attr('class', 'text-node')
        .attr('text-anchor', 'middle')
        .style("fill", '#000000')


        //var text_nodes = d3.selectAll('#graph text')
        //text_nodes
        //    .attr("x", function (d) { return d.x; })
        //    .attr("y", function(d) { return d.y; });
        //console.log(text_nodes);

        // Let's list the force we wanna apply on the network
        var simulation = d3.forceSimulation(data.nodes)
        .force("charge", d3.forceManyBody().strength(-300).distanceMin(10).distanceMax(container_height))
        .force('collision', d3.forceCollide().radius(function(d) {
            return weight_scale(d.weight)*3;
          }))
        .force("center", d3.forceCenter(container_width / 2, container_height / 2)) 
        .force("link", d3.forceLink()                             
        .links(data.links).id(function(d){
            return d.id
        }).distance(5)                                          
        )
        
        .on("end", ticked);

        //add zoom capabilities 
        var zoom_handler = d3.zoom()
        .on("zoom", zoom_actions);

        zoom_handler(svg); 

        function zoom_actions(){
            nodes.attr("transform", d3.event.transform);
            link.attr("transform", d3.event.transform);

        };

        nodes.on("mouseover", fade(0.4))
        nodes.on("mouseout", fade(1));

        const linkedByIndex = {};
        data.links.forEach(function(d){
            linkedByIndex[`${d.source.id},${d.target.id}`] = 1;
        });

        function dragged(d) {
            d.x = d3.event.x, d.y = d3.event.y;
            d3.select(this).attr("cx", d.x).attr("cy", d.y);
            link.filter(function(l) { return l.source === d; }).attr("x1", d.x).attr("y1", d.y);
            link.filter(function(l) { return l.target === d; }).attr("x2", d.x).attr("y2", d.y);
            text.filter(function(t) { return t.x === d.x && t.y === d.y; }).attr("x", d.x).attr("y", d.y)
          }

        function isConnected(a, b) {
          return linkedByIndex[`${a.id},${b.id}`] || linkedByIndex[`${b.id},${a.id}`] || a.id === b.id;
        }

        function fade(opacity){
            return function(d){
                console.log(d.name)

                node.style('opacity', function(n){
                    const thisOpacity = isConnected(d, n) ? 1 : opacity;
                    this.setAttribute('fill-opacity', thisOpacity);
                    return thisOpacity;
                })
                text.style('opacity', function(n){
                    const thisOpacity = isConnected(d, n) ? 1 : opacity;
                    this.setAttribute('fill-opacity', thisOpacity);
                    return thisOpacity;
                })
                link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity));
            }
        }

        // This function is run at each iteration of the force algorithm, updating the nodes position.
        function ticked() {
            link
                .attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });
            node
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
            
            text
                .attr("x", function (d) { return d.x; })
                .attr("y", function(d) { return d.y; });
            //children = node.select(this.childNodes);
            //node.selectAll('text')
            //.attr("x", function (d) { return d.x; })
            //.attr("y", function(d) { return d.y; });
        }
    })    
*/
/* line chart
var frame = d3.select('.frame_content').node();
var container_width = frame.getBoundingClientRect().width;
var container_height = 600;
var data_store = [];

var margin = {
    top: 20,
    bottom: 20,
    left: 30,
    right: 20
}

//search bar
var button = d3.select(".search_bar")
            .append("button")
            .attr("class", "add_place_button")
            .text("ajouter");

var clear_button = d3.select(".search_bar")
.append("button")
.attr("class", "clear_all_button")
.text("clear")

var selected_value = d3.select(".search_bar")
.append("input")
.attr("class", "add_place_input")
.text("ok")

// chart
var container = d3.select(".line_chart").append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr('viewBox', [0, 0, container_width, container_height])
            .attr("id", "container");

// axis
var x_axis_scale = d3.scaleTime()
            .domain([new Date(1969, 1, 1), new Date(2014, 31, 12)])
            .range([0+margin.left, container_width-margin.right])
            .nice();

var y_axis_scale = d3.scaleLinear()
            .domain([0, 100])
            .range([container_height, margin.top+margin.bottom])

var y_axis = container.append('g')
            .call(d3.axisLeft(y_axis_scale))
            .attr("class", 'y_axis')
            .attr("transform", "translate("+margin.left+","+(-margin.bottom)+")")

var x_axis = container.append('g')
            .attr("transform", "translate(0, "+(container_height-20)+")")
            .call(d3.axisBottom(x_axis_scale))
            //.tickFormat(d3.timeFormat("%Y"));

var lines_groupe = container.append('g');
var text_groupe = container.append('g');

// Create Event Handlers for mouse
function handleMouseOver(d, i) {  // Add interactivity

    // Use D3 to select element, change color and size
    d3.select(this).attr({
        fill: "orange"
    });

    // Specify where to put label of text
    //svg.append("text").attr({
    //    id: "t" + d.x + "-" + d.y + "-" + i,  // Create an id for text so we can select it later for removing on mouseout
    //    x: function() { return xScale(d.x) - 30; },
    //    y: function() { return yScale(d.y) - 15; }
    //})
}
// interaction
button.on("click", (e)=>{

    var country_name = selected_value.property("value");

    if (country_name != ''){
        try{
            var is_empty = d3.select(`#${country_name}`).node();
            if(!is_empty){

                var lines;

                var url = "http://localhost:3000/location/trend/"
                d3.json(url+country_name)
                    .then((res)=>{
                        // sort data in data store by greatest
                        var in_data_store = data_store.find((e)=>{
                            return e.label == country_name;
                        });

                        if(in_data_store == undefined){
                            data_store.push(res)
                        };
                        
                        data_store.sort((a, b)=>{
                           var reduced_a = Math.max(...a.data.map((e)=>{
                               return e.count
                           }))
                           var reduced_b = Math.max(...b.data.map((e)=>{
                               return e.count
                           }))
                           return reduced_b > reduced_a;
                        });
                        var max_value = Math.max(...data_store[0].data.map((e)=>{
                            return e.count;
                        }));
                        //console.log(max_value);
                        //console.log(data_store);

                        var sequentialScale = d3.scaleSequential()
                            .domain([0, data_store.length])
                            .interpolator(d3.interpolateRgb("#003366","#66FFFF"));
                        
                        var y_axis_scale = d3.scaleLinear()
                            .domain([0, max_value])
                            .range([container_height, 40]);

                        container.select('g.y_axis')
                            //.transition()
                            //.duration(500)
                            //.ease(d3.easeCubic)
                            .call(d3.axisLeft(y_axis_scale));

                        var area = d3.area()
                            .curve(d3.curveBasis)
                            .x(d => x_axis_scale(new Date(d.date, 1, 1)))
                            .y0(d => y_axis_scale(0))
                            .y1(d => y_axis_scale(d.count))
                        /*
                        var lineFunction = d3.line()
                            .x(function(d){
                                return x_axis_scale(new Date(d.date, 1, 1)); 
                            })
                            .y(function(d){
                                return y_axis_scale(d.count); 
                            })
                            .curve(d3.curveBasis);
                        
                            // draw lines
                        */
/*
                        lines = lines_groupe.selectAll('path')
                            .data(data_store, d=>{return d.data});
                        lines.exit().remove();
                        lines
                            .enter()
                            .append('path')
                            .merge(lines)
                            .attr("transform", "translate(0, "+(-20)+")")
                            //.transition()
                            //.duration(1000)
                            .attr("d", function(d){return area(d.data)})
                            .attr("class", 'area')
                            .attr('id', (d)=>{
                                return d.request;
                            })
                            .attr("stroke", (d, i)=>{
                                return sequentialScale(i)
                            })
                            .attr("stroke-width", 2)
                            .attr("fill", (d, i)=>{
                                return sequentialScale(i)
                            })
                            //.on("mouseover", handleMouseOver)
                    });

                d3.select(".location_searched")
                .append("div")
                .attr("class", "selected_value")
                .attr('id', country_name)
                .text(country_name);
                return lines;

            }else{
                window.alert(`${country_name} : already selected`)
            }
        }catch(e){
            console.log(e)
            window.alert("mauvais choix !")
        }
    }else{
        window.alert("empty selection")
    }
});

container.on('mouseover', (e)=>{
    var p = d3.selectAll("path.area");
    p.on("mousemove", (r)=>{
        var x = document.getElementById("container").getBoundingClientRect().x;
        var y = document.getElementById("container").getBoundingClientRect().y - margin.top;
        console.log("x,y svg pos")
        console.log(x, y);
        console.log("d3 mouse pos")
        console.log(d3.event.pageX, d3.event.pageY);
        console.log("mouse pose js")
        console.log(event.clientX, event.clientY)
        var data = [{
            "x": event.clientX - (document.getElementById("container").getBoundingClientRect().x+30),
            "y": event.clientY - 180,
            "label": r.label
        }]
        console.log("data mouse pose")
        console.log(data[0].x, data[0].y)
        var text = text_groupe.selectAll("text")
            .data(data)
        text
            .enter()
            .append("text")
            .merge(text)
            .text(d=>d.label)
            .attr("x", d=>d.x)
            .attr("y", d=>d.y)
            .attr("fill", "black")
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px");
    })
    p.on("mouseout", ()=>{
        text_groupe.select("text").remove()
    })
})
//container.append("rect")
//        .attr("width", container_width-(margin.left+margin.right))
//        .attr("height", container_height-(margin.top+margin.bottom))
//        .style("fill", "#676767")
//        .attr("transform", "translate("+margin.left+", "+margin.top+")")

*/
/*
var frame = d3.select('.frame_content').node();
var width = frame.getBoundingClientRect().width;
var height = 500;

var margin = ({top: 20, right: 30, bottom: 30, left: 30});
var barHeight = 20;
var barWidth = width / 2;
var y_height = 100;

var x_data_scale = d3.scaleLinear()
    .domain([800, 0])
    .range([0+margin.left, width-margin.right]);

var xscale = d3.scaleTime()
    .domain([new Date(1970, 1, 1), new Date(2019, 31, 12)])
    .range([0, width-margin.right-1]);

var lineFunction = d3.line()   
    .x((d, m) => { 
        //console.log(d)
        var keys = Object.keys(d);
        return xscale(new Date(keys[0], 1, 1)); 
    })
    .y((d, m) => { 
        var keys = Object.keys(d);
        //console.log(d[keys[0]])
        return y_data_scale(d[keys[0]]); 
    })

//The SVG Container
var svg = d3.select(".line_chart").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr('viewBox', [0, 0, width, height])


//append axis
var yaxis = d3.scaleLinear()
    .domain([y_height, 0])
    .range([0, height-margin.bottom-margin.top])

var xaxis = d3.axisBottom(xscale)
    .tickFormat(d3.timeFormat("%Y"))
    .ticks(10)

svg.append("g")
    .attr("transform", `translate(${margin.left}, ${height-margin.top})`)
    .call(xaxis);

svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.bottom})`)
    .attr("class", "yaxis")
    .call(d3.axisLeft(yaxis))

// interactions
$(document).ready(function() {

    var max_height = 0;
    y_height = max_height
    data_store = []

    var sequentialScale = d3.scaleSequential()
        .domain([0, 100])
        .interpolator(d3.interpolateMagma);

    $(".add_place_button").click(()=>{

        var pastille = document.createElement("div");
        pastille.setAttribute("class", "clear_search_value");
        var search_value = $('.add_place_input').val();
        pastille.innerText = search_value;
    
        $(".location_searched").height(50)
        $(".location_searched").append(pastille);
        var url = "http://localhost:3000/location/trend/"
        d3.json(url+search_value)
            .then((res)=>{
                console.log(res.label)
                var in_data_store = data_store.find((e)=>{
                    console.log(e.label);
                    return e.label == search_value;
                });
                console.log(in_data_store);
                if(in_data_store == undefined){
                    data_store.push(res)
                };
                if(data_store == true){
                    var last_dataset_inserted = data_store.slice(-1)[0] 
                    var m = last_dataset_inserted.data.map((e)=>{
                        var keys = Object.keys(e)
                        return e[keys[0]]
                    });
                }else{
                    var m = res.data.map((e)=>{
                        var keys = Object.keys(e)
                        return e[keys[0]]
                    })
                };

                svg.selectAll('path').remove();

                Math.max(...m) > max_height ? max_height = Math.max(...m) : max_height = max_height;
                console.log(max_height)

                var yaxis = d3.scaleLinear()
                    .domain([max_height, 0])
                    .range([0, height-50]);

                svg.select('g.yaxis')
                    .call(d3.axisLeft(yaxis))
                
                y_data_scale = d3.scaleLinear()
                    .domain([0, max_height])
                    .range([height, margin.top+30]);
                
                data_store.forEach((el)=>{
                    var color_input = Math.floor(Math.random() * 101);    
                    svg.append("path")
                    .attr("d", lineFunction(el.data, max_height))
                    .attr("transform", `translate(${margin.left+2}, ${-margin.top})`)
                    .attr("stroke", sequentialScale(color_input))
                    .attr("stroke-width", 2)
                    .attr("fill", "none");
                })
            })

        //lineData2 = [{ "x": 0, "y": 500}, {"x": 200, "y": 100}, { "x": 800,  "y": 0}]

        $(".clear_search_value").on("click", (e)=>{
            console.log(this)
            $(e.target).remove()
            //$(this).remove()
        })
    })
    $(".clear_all_button").click(()=>{
        $(".location_searched").empty()
    })
})
*/

/* world_map.js
mapboxgl.accessToken = 'pk.eyJ1IjoicmVyb3VqIiwiYSI6ImNrOWNqZDVneTA1ZnMzbm5rbTc3YXYwb28ifQ.zBj42crqv1VAq50SAs6buQ'

d3.json('http://localhost:3000/location/geo_json')
    .then((data)=>{

        country_data = data.filter((doc)=>{
            return doc.properties.type == 'country'
        })
        locality_data = data.filter((doc)=>{
            return doc.properties.type != 'country'
        })
        js = {
            "type": "FeatureCollection",
            "features": locality_data
        }
        country_js = {
            "type": "FeatureCollection",
            "features": country_data
        }

        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/light-v10',
            center: [8.227511999999999, 46.818188],
            zoom: 0.5
            });

        map.on('load', function() {

            map.addSource('points', {
            'type': 'geojson',
            'data': js
            });

            // continent vector layer
            //map.addSource('test_source', {
            //    type: 'vector',
            //    url: 'mapbox://rerouj.2233d4a3'
//
            //})
//
            //map.addLayer({
            //    'id': 'test',
            //    'type': 'fill',
            //    'source': 'test_source',
            //    'source-layer': 'merica-medium-69i5vy',
            //    'paint': {
            //        //'line-width': 10,
            //        'fill-color': "#0080FF"
            //    }
            //})

            map.addLayer({
                'id': 'coordinates',
                'type': 'circle',
                'source': 'points',
                'layout': {
                    'visibility': 'none'
                },
                'paint':{
                    "circle-color": "#0080FF",
                    "circle-radius": 2,
                    "circle-opacity": 0.5
                }
            });

            map.on('zoom', 'coordinates', (e)=>{
                var treshold = 4;
                var zl = map.getZoom()
                if(zl >= treshold){
                    map.setPaintProperty('coordinates', 'circle-radius', zl/1.4)
                }else if(zl < treshold ){
                    map.setPaintProperty('coordinates', 'circle-radius', 2)
                }
            })

            map.on('click', 'coordinates', function(e) {

                //use jquery for adding the gallery
                var name = e.features[0].properties.name;
                var alias = e.features[0].properties.alias;
                var wiki = e.features[0].properties.wiki;
                var show_infos = JSON.parse(e.features[0].properties.show_infos);

                var show_list = document.createElement("ul")
                show_infos.forEach((item, index)=>{
                    var show_list_el = document.createElement("li");
                    var el_link = document.createElement("a");
                    el_link.setAttribute("href", item.mediaURL);
                    el_link.setAttribute("target", "_blank");
                    el_link.innerText = item.title;
                    show_list_el.appendChild(el_link);
                    show_list.appendChild(show_list_el);
                })

                var box = document.createElement("div");
                var place_name = document.createElement("h1");
                var wiki_paraph = document.createElement("p");
                var liste_title = document.createElement("p");
                var list_container = document.createElement("div");
                
                list_container.setAttribute("class", "list-container");
                list_container.appendChild(show_list);

                liste_title.innerText = "Liste des documentaires :"
                wiki_paraph.innerHTML = wiki.length > 500 ? `${wiki.slice(0, 500)}...` : wiki
                place_name.innerHTML = alias == name ? name : `${name} (${alias})`;
                place_name.setAttribute("class", "gallery-place-name")
                box.setAttribute("class", "gallery");
                box.appendChild(place_name);
                box.appendChild(wiki_paraph);
                box.appendChild(liste_title);
                box.appendChild(list_container);
                $("#map").prepend(box);
                $(".gallery").on("click", ()=>{
                    $(".gallery").remove()
                })
            });

            // Change the cursor to a pointer when the mouse is over the places layer.
            map.on('mouseenter', 'coordinates', function() {
                map.getCanvas().style.cursor = 'pointer';
                });

            // Change it back to a pointer when it leaves.
            map.on('mouseleave', 'coordinates', function() {
                map.getCanvas().style.cursor = '';
                });

            map.addSource('countrys', {
                'type': 'geojson',
                'data': country_js
            })

            map.addLayer({
                'id': 'country_coordinates',
                'type': 'circle',
                'source': 'countrys',
                'layout': {
                    'visibility': 'visible'
                },
                'paint':{
                    "circle-color": "#CC00CC",
                    "circle-radius": 4,
                    "circle-opacity": 0.5
                }
            });

            map.on('zoom', 'country_coordinates', (e)=>{
                var treshold = 4;
                var zl = map.getZoom()
                if(zl >= treshold){
                    map.setPaintProperty('country_coordinates', 'circle-radius', 5+zl)
                }else if(zl < treshold ){
                    map.setPaintProperty('country_coordinates', 'circle-radius', 4)
                }
            })

            map.on('click', 'country_coordinates', function(e) {

                //use jquery for adding the gallery
                var name = e.features[0].properties.name;
                var alias = e.features[0].properties.alias;
                var wiki = e.features[0].properties.wiki;
                var show_infos = JSON.parse(e.features[0].properties.show_infos);

                var show_list = document.createElement("ul")
                show_infos.forEach((item, index)=>{
                    var show_list_el = document.createElement("li");
                    var el_link = document.createElement("a");
                    el_link.setAttribute("href", item.mediaURL);
                    el_link.setAttribute("target", "_blank");
                    el_link.innerText = item.title;
                    show_list_el.appendChild(el_link);
                    show_list.appendChild(show_list_el);
                })

                var box = document.createElement("div");
                var place_name = document.createElement("h1");
                var wiki_paraph = document.createElement("p");
                var liste_title = document.createElement("p");
                var list_container = document.createElement("div");
                
                list_container.setAttribute("class", "list-container");
                list_container.appendChild(show_list);

                liste_title.innerText = "Liste des documentaires :"
                wiki_paraph.innerHTML = wiki.length > 500 ? `${wiki.slice(0, 500)}...` : wiki
                place_name.innerHTML = alias == name ? name : `${name} (${alias})`;
                place_name.setAttribute("class", "gallery-place-name")
                box.setAttribute("class", "gallery");
                box.appendChild(place_name);
                box.appendChild(wiki_paraph);
                box.appendChild(liste_title);
                box.appendChild(list_container);
                $("#map").prepend(box);
                $(".gallery").on("click", ()=>{
                    $(".gallery").remove()
                })
            });
            // Change the cursor to a pointer when the mouse is over the places layer.
            map.on('mouseenter', 'country_coordinates', function() {
                map.getCanvas().style.cursor = 'pointer';
                });

            // Change it back to a pointer when it leaves.
            map.on('mouseleave', 'country_coordinates', function() {
                map.getCanvas().style.cursor = '';
                });
            })
            
            var checkboxes_form = document.createElement("form");
            checkboxes_form.setAttribute("class", 'checkboxes_form');

            var country_button = document.createElement("input");
            country_button.setAttribute("type", 'checkbox');
            country_button.setAttribute("id", "country_button");

            var locality_button = document.createElement("input");
            locality_button.setAttribute("type", 'checkbox');
            locality_button.setAttribute("id", "locality_button");

            var label_a = document.createElement("label");
            label_a.setAttribute("class", "label_a")
            label_a.setAttribute("for", 'country_button');
            label_a.innerText = "pays";

            var label_b = document.createElement("label");
            label_b.setAttribute("class", "label_b")
            label_b.setAttribute("for", 'locality_button');
            label_b.innerText = "autres";
            buttons = [locality_button, country_button]
            buttons.forEach((b)=>{
                b.id == 'country_button' ? b.defaultChecked = true : b.defaultChecked = false
                b.onclick = ()=>{
                    console.log(b.id)
                    if (b.checked){
                        console.log(b.checked)
                        b.id == 'country_button' ? map.setLayoutProperty('country_coordinates', 'visibility', 'visible') : map.setLayoutProperty('coordinates', 'visibility', 'visible')
                    } else {
                        console.log(b.checked)
                        b.id == 'country_button' ? map.setLayoutProperty('country_coordinates', 'visibility', 'none') : map.setLayoutProperty('coordinates', 'visibility', 'none')
                    }
                }
            })

            checkboxes_form.appendChild(country_button);
            checkboxes_form.appendChild(label_a);
            checkboxes_form.appendChild(locality_button)
            checkboxes_form.appendChild(label_b);

            $("#map").prepend(checkboxes_form);
        })
*/

/* space histogram
d3.json('http://localhost:3000/space/top10')
    .then((data, err)=>{
        var frame = d3.select('.histogram').node();
        var width = frame.getBoundingClientRect().width;
        var chart_height = 700;
        var axis_labels = data.map(x => x.country_name)

        console.log(width)

        margin = {
            top: 20,
            right: 30,
            bottom:150,
            left: 40
        }

        var graph = d3.select('.viz')
            .append('svg')
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr('viewBox', [0, 0, width, chart_height])

        var scale_x = d3.scaleLinear()
            .domain([0, data.length])
            .range([0, width-margin.right]);
        var axis_x_scale = d3.scaleBand()
            .domain(axis_labels)
            .range([0, width-margin.right+2])
            //.padding([0]) 
        var scale_y = d3.scaleLinear()
            .domain([0, data[0].national])
            .range([0, chart_height-margin.top-margin.bottom]);

        var axis_y_scale = d3.scaleLinear()
            .domain([data[0].national, 0])
            .range([0, chart_height-margin.top-margin.bottom, ]);

        bar_width = scale_x(1)

        var x_axis = d3.axisBottom()
            .scale(axis_x_scale)
            //.ticks(data.length * 2)
            //.render()

        var y_axis = d3.axisLeft()
            .scale(axis_y_scale);
        
        // national bars

        var bar = graph.selectAll('g')
                        .data(data)
                        .enter()
                        .append('g')
                        .attr("transform", function(d, i) {
                            console.log(i)
                            return "translate("+`${bar_width*(i+1)}`+", "+(chart_height-margin.bottom)+"), rotate(180)";
                        });

        bar.append('rect')
            .attr('width', (bar_width-1)/2)
            .attr('height', d=>{
                return scale_y(d.national)
            })
            .attr('fill', "#44597E")

        bar.append('rect')
            .attr('width', (bar_width-2)/2)
            .attr('height', d=>{
                return scale_y(d.international)
            })
            .attr('fill', "#647491")
            .attr('transform', (d, i)=>{
                return "translate("+`${(-bar_width+1)/2}`+",0)"
            })
        
        //national bar's text
        bar.append("text")
            .attr("x", bar_width/1.5)
            .attr("y", function(d, i) { 
                return chart_height-scale_y(d.national)}
            )
            .attr('font-family', "sans-serif")
            .attr('font-size', '12px')
            .attr('transform', (d, i)=>{
                return "translate("+bar_width+", "+(chart_height+5)+"), rotate(180)"
            })
            .text(d => d.national);

        // international bar's text
        bar.append("text")
            .attr("x", bar_width+10)
            .attr("y", function(d, i) { 
                return chart_height-scale_y(d.international)}
            )
            .attr('font-family', "sans-serif")
            .attr('font-size', '12px')
            .attr('transform', (d, i)=>{
                return "translate("+bar_width+", "+(chart_height+5)+"), rotate(180)"
            })
            .text(d => d.international);

        // axis
        graph.append('g')
            .attr('transform', `translate(${margin.left}, ${chart_height-margin.bottom + 2})`)
            .call(d3.axisBottom(axis_x_scale))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("transform", "translate(-10,10)rotate(-45)")

        graph.append('g')
            .attr('transform', `translate(${margin.left - 2}, ${margin.top})`)
            .call(y_axis)
        
        //legend
        graph.append("circle").attr("cx", width-100).attr("cy", 30).attr("r", 6).style("fill", "#44597E")
        graph.append("circle").attr("cx", width-100).attr("cy", 60).attr("r", 6).style("fill", "#647491")
        graph.append("text").attr("x", width-90).attr("y", 35).text("national").style("font-size", "15px").attr("alignment-baseline","middle").attr('font-family', "sans-serif")
        graph.append("text").attr("x", width-90).attr("y", 65).text("international").style("font-size", "15px").attr("alignment-baseline","middle").attr('font-family', "sans-serif")
        
        //sources
        graph.append("text").attr("x", width-280).attr("y", chart_height-20).text("Source: [Diaz, 2020]").style("font-size", "15px").attr("alignment-baseline","middle").attr('font-family', "sans-serif")
        graph.append("text").attr("x", width-280).attr("y", chart_height-5).text("Dataset : RTS archives v3 (broadcast)").style("font-size", "15px").attr("alignment-baseline","middle").attr('font-family', "sans-serif")
        graph.append("rect").attr('height', 1).attr('width', width).style('fill', '#647491').attr("x", margin.left).attr("y", chart_height-60)
    })

*/
/*
var width = 800;
var height = 500;

var data = [5, 12, 34, 2, 23, 7, 32];
var barHeight = 20;
var barWidth = width / data.length
console.log(barWidth)

var scaleFactor = 10;

var graph = d3.select(".sandbox")
.append("svg")
.attr("width", width)
.attr("height", height)

var bar = graph.selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("transform", function(d, i) {
        return "translate("+barWidth*(i+1)+","+height+"), rotate(180)";
    })

bar.append("rect")
    .attr("width", barWidth)
    .attr("height", function(d) {
        return d * scaleFactor;
});

bar.append("text")
    .attr("x", barWidth/2)
    .attr("y", function(d) { 
        return 500-((d+2)*scaleFactor); 
    })
    .attr("dy", ".35em")
    .attr("transform", "translate("+width/data.length+", 500), rotate(180)")
    .text(function(d) { return d; });

$(".add_button").click(()=>{
    data.push(Math.floor((Math.random() * 45) + 1))
    var updWidth = width / data.length
    console.log(updWidth)
    var bar = graph.selectAll("g")
    .remove()
    .exit()
    .data(data)
    .enter()
    .append("g")
    .attr("transform", function(d, i) {
        return "translate("+updWidth*(i+1)+","+height+"), rotate(180)";
    })
    bar.append("rect")
    .attr("width", updWidth)
    .attr("height", function(d) {
        return d * scaleFactor;
    });
    bar.append("text")
    .attr("x", updWidth/2)
    .attr("y", function(d) { 
        return 500-((d+2)*scaleFactor); 
    })
    .attr("dy", ".35em")
    .attr("transform", "translate("+width/data.length+", 500), rotate(180)")
    .text(function(d) { return d; });
})

$(".button").click(()=>{
    $.ajax({
        url: "http://localhost:3000/location",
        dataType: 'json',
        success: (res)=>{
            var show_ids = res[0]['show_id']
            show_ids.forEach(element => {
                let new_li = document.createElement("li");
                new_li.innerText = element[0];
                $("ul").append(new_li);
            });
            console.log(res[0]['archive_name']);
        }
    })
})
*/