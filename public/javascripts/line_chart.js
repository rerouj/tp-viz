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

var lines_groupe = container.append('g')
                    .attr("class", "line_group");
var text_groupe = container.append('g');

// Mouse event
function handleMouseOver(d, i) {

    d3.select(this).attr({
        fill: "orange"
    });
}

// interaction

clear_button.on("click", function(e){
    d3.select('.line_group').selectAll('*').remove();
    d3.select('.location_searched').selectAll('*').remove();
    data_store = [];
})

button.on("click", (e)=>{

    var country_name = selected_value.property("value");

    if (country_name != ''){
        try{
            var is_empty = d3.select(`#${country_name}`).node();
            if(!is_empty){

                var lines;
                var area_color;
                var total_per_year_obj = {
                    total: 712
                };

                var url = "http://localhost:3000/location/trend/"
                d3.json(url+country_name)
                    .then((res)=>{
                        total_per_year_obj["request"] = 'Total per year'
                        total_per_year_obj["label"] = 'Total per year'
                        total_per_year_obj["data"] = []
                        res.data.forEach((doc, index) => {
                            let y = doc.date;
                            var tmp_obj = {}
                            //total_per_year_obj["data"][index] = {};
                            tmp_obj["date"] = y;
                            tmp_obj["count"] = doc.total_per_year;
                            tmp_obj[y] = doc.total_per_year;
                            total_per_year_obj["data"].push(tmp_obj)
                        });
                        data_store[0] = total_per_year_obj
                        // sort data in data store by greatest
                        in_data_store = data_store.find((e)=>{
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

                        var sequentialScale = d3.scaleSequential()
                            .domain([0, data_store.length])
                            .interpolator(d3.interpolateRgb("#003366","#66FFFF"));
                        
                        var pastillesLabelScale = d3.scaleSequential()
                            .domain([0, data_store.length-20, data_store.length])
                            .interpolator(d3.interpolateRgb("#FFFFFF", "#FFFFFF", "#000000"));
                        
                        var y_axis_scale = d3.scaleLinear()
                            .domain([0, max_value])
                            .range([container_height, 40]);

                        container.select('g.y_axis')
                            .call(d3.axisLeft(y_axis_scale));

                        var area = d3.area()
                            .curve(d3.curveLinear)
                            .x(d => x_axis_scale(new Date(d.date, 1, 1)))
                            .y0(d => y_axis_scale(0))
                            .y1(d => y_axis_scale(d.count))

                        lines = lines_groupe.selectAll('path')
                            .data(data_store, d=>{return d.data});
                        lines.exit().remove();
                        lines
                            .enter()
                            .append('path')
                            .merge(lines)
                            .attr("transform", "translate(0, "+(-20)+")")
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
                                area_color = sequentialScale(i);
                                return area_color;
                            })

                        pastilles = d3.select(".location_searched")
                                    .selectAll("div")
                                    .data(data_store, function(d){
                                        return d.data
                                    })
                        pastilles
                                    .exit()
                                    .remove()
                        pastilles
                                    .enter()
                                    .append("div")
                                    .merge(pastilles)
                                    .attr("class", "selected_value")
                                    .attr('id', function(d){
                                        return d.label
                                    })
                                    .style("background-color", function(d, i){
                                        return sequentialScale(i);
                                    })
                                    .style("color", function(d, i){
                                        return pastillesLabelScale(i)
                                    })
                                    .text(function(d){
                                        return d.request;
                                    });
                    });

            }else{
                window.alert(`${country_name} : already selected`)
            }
        }catch(e){
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
        // console.log("x,y svg pos")
        // console.log(x, y);
        // console.log("d3 mouse pos")
        // console.log(d3.event.pageX, d3.event.pageY);
        // console.log("mouse pose js")
        // console.log(event.clientX, event.clientY)
        var data = [{
            "x": event.clientX - (document.getElementById("container").getBoundingClientRect().x+30),
            "y": event.clientY - 180,
            "label": r.label
        }]
        // console.log("data mouse pose")
        // console.log(data[0].x, data[0].y)
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


/* old verion
var width = 800;
var height = 500;

let margin = ({top: 20, right: 30, bottom: 30, left: 30})
var barHeight = 20;
var barWidth = width / 2

var lineData = [ { "x": 0, "y": 500}, { "x": 800,  "y": 0}];

var xscale = d3.scaleTime()
    .domain([new Date(1970, 1, 1), new Date(2019, 31, 12)])
    .range([0, 800]);

var lineFunction = d3.line()   
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; })

//The SVG Container
var svg = d3.select(".line_chart").append("svg")
    .attr("width", width+margin.left+margin.right)
    .attr("height", height+margin.top+margin.bottom)
    //.attr("transform", `translate(0, ${margin.top})`)

//append line
var lineGraph = svg.append("path")
    .attr("d", lineFunction(lineData))
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .attr("stroke", "green")
    .attr("stroke-width", 2)
    .attr("fill", "none");

//append axis
var yaxis = d3.scaleLinear()
    .domain([100, 0])
    .range([0, 500])
var xaxis = d3.axisBottom(xscale)
    .tickFormat(d3.timeFormat("%Y"))
    .ticks(10)

svg.append("g")
    .attr("transform", `translate(${margin.left}, ${height+margin.top})`)
    .call(xaxis);

svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .call(d3.axisLeft(yaxis))

// interactions
$(document).ready(function() {

    $(".add_place_button").click(()=>{

        var pastille = document.createElement("div");
        //var pastille_coll = document.createElement("tr")
        //var pastille_cell1 = document.createElement("td")
        //var pastille_cell2 = document.createElement("td")
        //var pastille_table = document.createElement("table")
        pastille.setAttribute("class", "clear_search_value")
    
        pastille.innerText = $('.add_place_input').val()

        //pastille_coll.appendChild(pastille_cell2)
        //pastille_cell1.innerText = "x"
        //pastille_coll.appendChild(pastille_cell1)
        //pastille_table.appendChild(pastille_coll)
        //pastille.appendChild(pastille_table)
    
        $(".location_searched").height(50)
        $(".location_searched").append(pastille);
        lineData2 = [{ "x": 0, "y": 500}, {"x": 200, "y": 100}, { "x": 800,  "y": 0}]
    
        console.log(lineData)
        svg.append("path")
        .attr("d", lineFunction(lineData2))
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("fill", "none");

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