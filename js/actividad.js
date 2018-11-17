/*d3.select(".div.vega-actions-wrapper").remove();
var wh = d3.select("#lines").node().getBoundingClientRect().width-100;
var lines = {
  "data": {"url": "data/actividad.csv"},
  "mark": {"type":"line", "point":{"color":"black"}},
  "width": wh,
  "height": wh,
  "encoding": {
    "x": {"field": "h", "type": "quantitative", "axis": {"title": "Hora (24 horas)"}},
    "y": {"aggregate":"count","field": "estado", "type": "quantitative", "axis": {"title": "Estado (cantidad)"}},
    "color": {
      "field": "estado",
      "type": "nominal",
      "scale": {
        "domain": ["null","ocupado","pedido"],
        "range": ["#4c78a8","#f58518","#00a088"]
      }
    }
  },
}

vegaEmbed("#lines", lines);*/
var margin = ({top: 20, right: 0, bottom: 35, left: 40});
var wh = d3.select("#lines").node().getBoundingClientRect().width-10;
var rawData, nulls, pedidos, ocupados, max, x, y, p, o, n, totalMediciones, taxis;
var f_estado = "all";
var f_desde = 0;
var f_hasta = 23;

line = d3.line()
  .defined(d => !isNaN(d))
  .x((d,i) => x(i))
  .y(d => y(d));

yAxis = g => g
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(y))
  .call(g => g.select(".domain").remove())
  .call(g => g.select(".tick:first-of-type text").clone()
    .attr("x", 10)
    .attr("y", -30)
    .style("transform","rotate(-90deg)")
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .text("Número de mediciones"));

xAxis = g => g
  .attr("transform", `translate(0,${wh - margin.bottom})`)
  .call(d3.axisBottom(x).ticks(wh / 80).tickSizeOuter(0))
  .call(g => g.select(".tick:first-of-type text").clone()
    .attr("y", 25)
    .attr("x", 10)
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .text("Hora del día"));

loadData();

function loadData(){
  wh = d3.select("#lines").node().getBoundingClientRect().width-10;
  d3.csv("data/actividad.csv").then(function(data){
    rawData = data;
    if(f_estado == "all" || f_estado == "pedidos"){
      pedidos = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    }
    if(f_estado == "all" || f_estado == "ocupados"){
      ocupados = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    }
    if(f_estado == "all" || f_estado == "nulls"){
      nulls = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    }

    max = 0;
    p = 0;
    o = 0;
    n = 0;
    taxis = [];

    data.forEach(function(d, i){
      if(d.h >= f_desde && d.h <= f_hasta){
        if(typeof taxis[d.tid] != "undefined"){
          taxis[d.tid] += 1;
        }else{
          taxis[d.tid] = 1;
        }
        if(d.estado == "pedido" && (f_estado == "all" || f_estado == "pedidos")){
          pedidos[d.h] += 1;
          p += 1;
          if(max < pedidos[d.h]){
            max = pedidos[d.h];
          }
        }
        if(d.estado == "ocupado"  && (f_estado == "all" || f_estado == "ocupados")){
          ocupados[d.h] += 1;
          o += 1;
          if(max < ocupados[d.h]){
            max = ocupados[d.h];
          }
        }
        if(d.estado == "null"  && (f_estado == "all" || f_estado == "nulls")){
          nulls[d.h] += 1;
          n += 1;
          if(max < nulls[d.h]){
            max = nulls[d.h];
          }
        }
      }
    });
    totalMediciones = p+o+n;
console.log(taxis);
    y = d3.scaleLinear()
      .domain([0, max])
      .range([ wh - margin.bottom, margin.top]);
    x = d3.scaleLinear()
      .domain([f_desde,f_hasta])
      .range([margin.left, wh - margin.right]);
    
    drawLines();
  });
}

function drawLines(){
  d3.select("#lines").html("");

  const svg = d3.select("#lines")
    .append("svg")
      .attr("width", wh)
      .attr("height", wh);

  svg.append("g")
    .call(xAxis);

  svg.append("g")
    .call(yAxis);

  if(f_estado == "all" || f_estado == "pedidos"){
    svg.append("path")
      .datum(pedidos)
      .attr("fill", "none")
      .attr("stroke", "#00a088")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line);
  }

  if(f_estado == "all" || f_estado == "ocupados"){
    svg.append("path")
      .datum(ocupados)
      .attr("fill", "none")
      .attr("stroke", "#f58518")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line);
  }

  if(f_estado == "all" || f_estado == "nulls"){
    svg.append("path")
      .datum(nulls)
      .attr("fill", "none")
      .attr("stroke", "#4c78a8")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line);
  }
}

d3.select("#estado")
  .on("change", function(){
    f_estado = d3.select(this).property("value");
    loadData();
  });
d3.select("#desde")
  .on("change", function(){
    f_desde = d3.select(this).property("value");
    loadData();
  });
d3.select("#hasta")
  .on("change", function(){
    f_hasta = d3.select(this).property("value");
    loadData();
  });

window.onresize = function(event) {
  loadData();
}