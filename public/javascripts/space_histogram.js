// Code de l'histogramme : classement des espaces (nationaux et internationaux) selon le nombre d'occurrences dans le corpus. 
// Cet histogramme est écrit en D3.js. 
// Les résultats sont commentés dans le mémoire sous le chapitre 5.4.


d3.json('http://localhost:3000/space/top10')
.then((data, err)=>{
    var frame = d3.select('.histogram').node();
    var width = frame.getBoundingClientRect().width;
    var chart_height = 700;
    var axis_labels = data.map(x => x.country_name)

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
    })
