// Code de l'analyse de réseau. 
// Cette visualisation est écrite en D3.js. 
// Les résultats sont commenté dans le mémoire sous le chapitre 5.3.

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

// node size scale
var weight_scale = d3.scaleLinear()
                .domain([0, 130])
                .range([7, 30])

// node's x position scale
var xScale = d3.scaleLinear().domain([0, 150]).range([0, container_width/2]);

// node's color scale
var color_scale = d3.scaleLinear().domain([0, 150]).range(['#CCEEFF', "#0059B3"])
// text's color scale
var text_color_scale = d3.scaleLinear().domain([0, 90, 100]).range(['#000000', "#000000", "#FFFFFF"])


// network setup
var simulation = d3.forceSimulation()
        .force("charge", d3.forceManyBody().strength(-300).distanceMin(10).distanceMax(container_height))
        .force("center", d3.forceCenter(container_width / 2, container_height / 2)) 
        .force("link", d3.forceLink().id(function(d){
            return d.id
        }).distance(100)                                          
        )

d3.json('http://localhost:3000/graph')
    .then(function(data){

        // Initialize the links
        var link = svg
            .selectAll("line")
            .data(data.links)
            .enter()
            .append("line")
            .style("stroke", "#aaa")
            .attr("stroke-width", function(d) { return d.weight; });

        // Initialize the nodes
        var nodes = svg.selectAll('g')
                    .data(data.nodes)
                    .enter()
                    .append('g')

        var node = nodes
            .append("circle")
            .attr('r', function(d){
                return weight_scale(d.weight)*2
            })
            .style("fill", function(d){
                return color_scale(d.weight);
            })
            .call(d3.drag().on("drag", dragged));
        
        // append text over nodes
        var text = nodes.append("text")
        .text(function(d){
            return d.name;
        })
        .attr('font-size', '10px')
        .attr('class', 'text-node')
        .attr('text-anchor', 'middle')
        .style("fill", function(d){
            return text_color_scale(d.weight);
        });

        // mouse event

        nodes.on("mouseover", fade(0.4, 0));
        nodes.on("mouseout", fade(1, 1));
        simulation
            .nodes(data.nodes)
            .force('collision', d3.forceCollide().radius(function(d) {
                return weight_scale(d.weight)*4.5;
              }))
            .on("tick", ticked);
  
        simulation.force("link")
            .links(data.links);

        //zoom capabilities 
        var zoom_handler = d3.zoom()
        .on("zoom", zoom_actions);

        zoom_handler(svg); 

        function zoom_actions(){
            nodes.attr("transform", d3.event.transform);
            link.attr("transform", d3.event.transform);
        };

        // drag capabilities

        function dragged(d) {
            d.x = d3.event.x, d.y = d3.event.y;
            d3.select(this).attr("cx", d.x).attr("cy", d.y);
            link.filter(function(l) { return l.source === d; }).attr("x1", d.x).attr("y1", d.y);
            link.filter(function(l) { return l.target === d; }).attr("x2", d.x).attr("y2", d.y);
            text.filter(function(t) { return t.x === d.x && t.y === d.y; }).attr("x", d.x).attr("y", d.y)
            }

        // mouse over functions

        const linkedByIndex = {};
            data.links.forEach(function(d){
                linkedByIndex[`${d.source.id},${d.target.id}`] = 1;
            });

        function isConnected(a, b) {
          return linkedByIndex[`${a.id},${b.id}`] || linkedByIndex[`${b.id},${a.id}`] || a.id === b.id;
        }

        function fade(opacity, line_opacity){
            return function(d){
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
                link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : line_opacity));
            }
        }

        // simulation on(tick) function 
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
        }
    })