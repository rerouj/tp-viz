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
        var data = [{
            "x": event.clientX - (document.getElementById("container").getBoundingClientRect().x+30),
            "y": event.clientY - 180,
            "label": r.label
        }]

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