var margin = ({top: 20, right: 0, bottom: 35, left: 40});
var wh = d3.select("#lines").node().getBoundingClientRect().width-10;
var rawData, mapData, etiquetas, nulls, pedidos, ocupados, max, x, y, p, o, n, totalMediciones, taxis;
var f_all = 1;
var f_pedidos = 0;
var f_ocupados = 0;
var f_nulls = 0;
var nulls_old = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var ocupados_old = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var pedidos_old = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

line = d3.line()
  .defined(d => !isNaN(d))
  .x((d,i) => x(i))
  .y(d => y(d));

yAxis = g => g
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(y))
  //.call(g => g.select(".domain").remove())
  .call(g => g.select(".tick:first-of-type text").clone()
    .attr("x", 10)
    .attr("y", -30)
    .style("transform","rotate(-90deg)")
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .text("Número de mediciones"));

xAxis = g => g
  .attr("transform", `translate(0,${wh - margin.bottom})`)
  .attr("class","x-axis")
  .call(d3.axisBottom(x).ticks(wh/80).tickSizeOuter(0))
  .call(g => g.select(".tick:first-of-type text").clone()
    .attr("y", 25)
    .attr("x", 10)
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .text("Hora del día"));

loadData();

function loadData(){
  if(f_pedidos == f_ocupados && f_ocupados == f_nulls && f_nulls == 1){
    d3.select("#all").classed("is-selected", true);
    d3.select("#pedidos").classed("is-selected", false);
    d3.select("#ocupados").classed("is-selected", false);
    d3.select("#nulls").classed("is-selected", false);
    f_all = 1; f_pedidos = 0; f_ocupados = 0; f_nulls = 0;
  }
  wh = d3.select("#lines").node().getBoundingClientRect().width-10;
  d3.csv("data/actividad.csv").then(function(data){
    rawData = data;
    etiquetas = ["12am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am","12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];

    pedidos = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    ocupados = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    nulls = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

    max = 0;
    p = 0;
    o = 0;
    n = 0;
    taxis = [];

    data.forEach(function(d, i){
      if(d.h >= 0 && d.h <= 23){
        if(typeof taxis[d.tid] != "undefined"){
          taxis[d.tid] += 1;
        }else{
          taxis[d.tid] = 1;
        }
        if(d.estado == "pedido" && (f_all == 1 || f_pedidos == 1)){
          pedidos[d.h] += 1;
          p += 1;
          if(max < pedidos[d.h]){
            max = pedidos[d.h];
          }
        }
        if(d.estado == "ocupado"  && (f_all == 1 || f_ocupados == 1)){
          ocupados[d.h] += 1;
          o += 1;
          if(max < ocupados[d.h]){
            max = ocupados[d.h];
          }
        }
        if(d.estado == "null"  && (f_all == 1 || f_nulls == 1)){
          nulls[d.h] += 1;
          n += 1;
          if(max < nulls[d.h]){
            max = nulls[d.h];
          }
        }
      }
    });
    totalMediciones = p+o+n;

    y = d3.scaleLinear()
      .domain([0, max])
      .range([ wh - margin.bottom, margin.top]);
    x = d3.scaleLinear()
      .domain([0,23])
      .range([margin.left, wh - margin.right]);
    
    drawLines();
    nulls_old = nulls;
    pedidos_old = pedidos;
    ocupados_old = ocupados;
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

  scgAppendPath(pedidos, pedidos_old, "#00a088");
  scgAppendPath(ocupados, ocupados_old, "#f58518");
  scgAppendPath(nulls, nulls_old, "#4c78a8");

  d3.selectAll(".x-axis .tick text").each(function(d, i){
    d3.select(this).text(etiquetas[d]);
  });

  function scgAppendPath(datos, datos_old, color){
    svg.append("path")
      .datum(datos)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line(datos_old))
      .transition()
      .duration(1000)
      .attr("d", line);
  }
}

d3.select("#estado #all")
  .on("click", function(){
    if(!d3.select(this).classed("is-selected")){
      d3.select(this).classed("is-selected", true);
      d3.select("#pedidos").classed("is-selected", false);
      d3.select("#ocupados").classed("is-selected", false);
      d3.select("#nulls").classed("is-selected", false);
      f_all = 1; f_pedidos = 0; f_ocupados = 0; f_nulls = 0;
    }
    loadData();
  });

d3.select("#estado #pedidos")
  .on("click", function(){
    if(!d3.select(this).classed("is-selected")){
      d3.select(this).classed("is-selected", true);
      d3.select("#all").classed("is-selected", false);
      f_all = 0; f_pedidos = 1;
    }else{
      d3.select(this).classed("is-selected", false);
      f_pedidos = 0;

      if(f_pedidos == f_ocupados && f_pedidos == f_nulls){
        d3.select("#all").classed("is-selected", true);
        f_all = 1;
      }
    }
    loadData();
  });

d3.select("#estado #ocupados")
  .on("click", function(){
    if(!d3.select(this).classed("is-selected")){
      d3.select(this).classed("is-selected", true);
      d3.select("#all").classed("is-selected", false);
      f_all = 0; f_ocupados = 1;
    }else{
      d3.select(this).classed("is-selected", false);
      f_ocupados = 0;

      if(f_pedidos == f_ocupados && f_ocupados == f_nulls){
        d3.select("#all").classed("is-selected", true);
        f_all = 1;
      }
    }
    loadData();
  });

d3.select("#estado #nulls")
  .on("click", function(){
    if(!d3.select(this).classed("is-selected")){
      d3.select(this).classed("is-selected", true);
      d3.select("#all").classed("is-selected", false);
      f_all = 0; f_nulls = 1;
    }else{
      d3.select(this).classed("is-selected", false);
      f_nulls = 0;

      if(f_nulls == f_pedidos && f_nulls == f_ocupados){
        d3.select("#all").classed("is-selected", true);
        f_all = 1;
      }
    }
    loadData();
  });


window.onresize = function(event) {
  loadData();
}

/// Mapa /////////////////////
d3.select("#map").attr("style","height:"+(wh-30)+"px");

require([
    "esri/map",
    "esri/layers/FeatureLayer",
    "dojo/_base/array",
    "dojo/dom",
    "dojo/number",
    "dojo/on",
    "dojo/parser",
    "dojo/ready"
], function (Map, FeatureLayer, array, dom, number, on, parser, ready) {
    parser.parse();

    var map, layer, classification;

    ready(function () {
        map = new Map("map", {
            basemap:"gray",
            center:[-74.1082335, 4.6264527],
            zoom: 17
        });
        addMarks();
    });

    function addMarks() {
      var marks = new FeatureLayer("https://services.arcgis.com/8DAUcrpQcpyLMznu/arcgis/rest/services/TActividadTaxis/FeatureServer/0", {
        id:"marks",
        styling:false
      });
      if(marks.surfaceType === "svg") {
        classification = {"null":"#4c78a8","pedido":"#00a088","ocupado":"#f58518"};

        on(marks, "graphic-draw", function (evt) {
          var attrs = evt.graphic.attributes;
          var estado = (attrs && attrs.estado) || undefined;
          var h = (attrs && attrs.h) || undefined;
          var color = classification[estado];
          evt.node.setAttribute("data-classification", estado);
        });
        //createLegend();
      }else{
        alert("Parece que tu navegador no soporta SVG.\nPrueba usar uno que sí lo haga, te recomendamos Google Chrome.");
        dom.byId("legend").innerHTML = "Parece que tu navegador no soporta SVG.";
      }
      map.addLayer(marks);
      return marks;
    }
});

d3.select("#map .loader").remove();