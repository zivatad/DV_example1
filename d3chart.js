// d3 quick prototype

var dataPath = paymentdata.overall_statistics;
//console.log (data);

// Chart 1 top
$(function(chart1t){

    //Create object to plot stached area chart
    var data = [];
    dataPath.forEach(function(d) {
    	var authorisedCount = {
            "date" : d.date,
            "value": d.authorisedCount,
            "key" : "authorized"
        };
        var chargebackCount = {
            "date" : d.date,
            "value": d.chargebackCount,
            "key" : "chargeback"
        };
    	data.push(chargebackCount, authorisedCount);
    });

    var format = d3.time.format("%Y-%m-%d");

    var margin = {top: 20, right: 40, bottom: 0, left: 60},
        width = 800 - margin.left - margin.right,
        height = 360 - margin.top - margin.bottom;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    // create color palette
    function count_clr(n) {
      var colores_c = ["#feb32b","#d4d4d4"];
      return colores_c[n % colores_c.length];
    }

    // var xAxis = d3.svg.axis()
    //     .scale(x)
    //     .orient("bottom")
    //     .ticks(d3.time.days);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var stack = d3.layout.stack()
        .offset("zero")
        .values(function(d) { return d.values; })
        .x(function(d) { return d.date; })
        .y(function(d) { return d.value; });

    var nest = d3.nest()
        .key(function(d) { return d.key; });

    var area = d3.svg.area()
        .interpolate("cardinal")
        .x(function(d) { return x(d.date); })
        .y0(function(d) { return y(d.y0); })
        .y1(function(d) { return y(d.y0 + d.y); });

    var svg = d3.select("#chart1-box_top").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data.forEach(function(d) {
        d.date = format.parse(d.date);
        d.value = +d.value;
    });

    var layers = stack(nest.entries(data));

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);

    svg.selectAll(".layer")
        .data(layers)
        .enter().append("path")
        .attr("class", "layer")
        .attr("d", function(d) { return area(d.values); })
        .style("fill", function(d, i) { return count_clr(i); });

    // svg.append("g")
    //     .attr("class", "x axis")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // Remove 0 on yaxis only for this quick prototype
    svg.selectAll(".tick")
    .each(function (d) {
        if ( d === 0 ) {
            this.remove();
        }
    });

    // Create line to separate top and bottom charts
    svg.append("rect")
        .attr("width", width)
        .attr("height", 1)
        .attr("fill", "#222222")
        .attr("y", 339)
        .attr("x", 0)
        .attr("class", "customRuler");
});


//chart 2 bottom
$(function(chart1b){
    var data = [];
    dataPath.forEach(function(d) {
        var authorisedAmount = {
            "date" : d.date,
            "value": d.authorisedEurAmount,
            "key" : "authorized"
        };
        var chargebackAmount = {
            "date" : d.date,
            "value": d.chargebackEurAmount,
            "key" : "chargeback"
        };
        data.push(chargebackAmount, authorisedAmount);
    });

    var format = d3.time.format("%Y-%m-%d");

    var margin = {top: 0, right: 40, bottom: 40, left: 60},
        width = 800 - margin.left - margin.right,
        height = 360 - margin.top - margin.bottom;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([0, height]);

    function count_clr(n) {
      var colores_c = ["#e4732b","#b5bdd1"];
      return colores_c[n % colores_c.length];
    }

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(d3.time.format("%m/%d"))
        .ticks(8);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var stack = d3.layout.stack()
        .offset("zero")
        .values(function(d) { return d.values; })
        .x(function(d) { return d.date; })
        .y(function(d) { return d.value; });

    var nest = d3.nest()
        .key(function(d) { return d.key; });

    var area = d3.svg.area()
        .interpolate("cardinal")
        .x(function(d) { return x(d.date); })
        .y0(function(d) { return y(d.y0); })
        .y1(function(d) { return y(d.y0 + d.y); });

    var svg = d3.select("#chart1-box_bottom").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data.forEach(function(d) {
        d.date = format.parse(d.date);
        d.value = +d.value;
    });

    var layers = stack(nest.entries(data));

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);

    svg.selectAll(".layer")
        .data(layers)
        .enter().append("path")
        .attr("class", "layer")
        .attr("d", function(d) { return area(d.values); })
        .style("fill", function(d, i) { return count_clr(i); });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.selectAll(".tick")
    .each(function (d) {
        if ( d === 0 ) {
            this.remove();
        }
    });
});

// Chart 2
$(function(chart2){

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = 340 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

    var x = d3.scale.linear()
         .domain([0, 30]) 
         .range([0, width]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(5);

    var svg = d3.select("#chart2").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("width", width)
        .attr("height", height);
        
    svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", x(30))
        .attr("height", 20)
        .style("fill", "#efefef");

    svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", x(5.8))
        .attr("height", 20)
        .style("fill", "#FEB32B");

    svg.append("rect")
        .attr("x", x(2))
        .attr("y", 0)
        .attr("width", 1)
        .attr("height", 20)
        .style("fill", "#ffffff");

    svg.append("g")
        .attr("class", "chart2_xaxis")
        .attr("transform", "translate(0," + 30 + ")")
        .call(xAxis);
});

// Chart3
$(function(chart3){

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = 340 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

    var x = d3.scale.linear()
         .domain([0, 30]) 
         .range([0, width]);


    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(5);

    var svg = d3.select("#chart3").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("width", width)
        .attr("height", height);
        
    svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", x(30))
        .attr("height", 20)
        .style("fill", "#efefef");

    svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", x(15.6))
        .attr("height", 20)
        .style("fill", "#BC3130");

    svg.append("rect")
        .attr("x", x(3.5))
        .attr("y", 0)
        .attr("width", 1)
        .attr("height", 20)
        .style("fill", "#ffffff");

    svg.append("g")
        .attr("class", "chart3_xaxis")
        .attr("transform", "translate(0," + 30 + ")")
        .call(xAxis);
});