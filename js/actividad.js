//Global
var margin = ({top: 20, right: 0, bottom: 35, left: 40});
var width = d3.select("#bars").node().getBoundingClientRect().width-10;
var etiquetas = ["12am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am","12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];
var height = (width/3);
var rawData, mapData, nulls, pedidos, ocupados, max, totalMediciones, taxis, p, o, n, x, y, numero_graficas;
var f_pedidos = 1;
var f_ocupados = 1;
var f_nulls = 1;

loadData();

// Barras horas
xAxis = g => g
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .attr("class", "xAxis")
  .call(d3.axisBottom(x)
    .tickSizeOuter(0)
    .ticks(24)
    .tickSize(-height))
  .call(g => g.select(".tick:first-of-type text").clone()
      .attr("y", 15)
      .attr("x", -10)
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text("Hora del día"));;
yAxis = g => g
  .attr("transform", `translate(${margin.left},0)`)
  .attr("class", "yAxis")
  .call(d3.axisLeft(y)
    .tickSizeOuter(0)
    .tickSize(-width))
  .call(g => g.select(".domain").remove())
  .call(g => g.select(".tick:first-of-type text").clone()
      .attr("x", 0)
      .attr("y", -20)
      .style("transform","rotate(-90deg)")
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text("Número de mediciones"));;

function loadData(){
  width = d3.select("#bars").node().getBoundingClientRect().width-10;
  numero_graficas = 0;

  if(f_pedidos){
    numero_graficas += 1;
  }
  if(f_ocupados){
    numero_graficas += 1;
  }
  if(f_nulls){
    numero_graficas += 1;
  }

  height = (width/numero_graficas);

  d3.csv("data/actividad.csv").then(function(data){
    rawData = data;
    
    pedidos = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    ocupados = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    nulls = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

    max = 0;
    taxis = [];

    data.forEach(function(d, i){
      if(d.h >= 0 && d.h <= 23){
        if(typeof taxis[d.tid] != "undefined"){
          taxis[d.tid] += 1;
        }else{
          taxis[d.tid] = 1;
        }
        if(d.estado == "pedido" && (f_pedidos == 1)){
          pedidos[d.h] += 1;
          p += 1;
          if(max < pedidos[d.h]){
            max = pedidos[d.h];
          }
        }
        if(d.estado == "ocupado" && (f_ocupados == 1)){
          ocupados[d.h] += 1;
          o += 1;
          if(max < ocupados[d.h]){
            max = ocupados[d.h];
          }
        }
        if(d.estado == "null" && (f_nulls == 1)){
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
      .domain([0, max]).nice()
      .range([height - margin.bottom, margin.top]);
    x = d3.scaleBand()
      .domain(etiquetas)
      .range([margin.left, width - margin.right])
      .padding(0.1);
    
    drawBars();
    nulls_old = nulls;
    pedidos_old = pedidos;
    ocupados_old = ocupados;
  });
}

function drawBars(){
  d3.select("#pedidos")
    .html("");
  d3.select("#ocupados")
    .html("");
  d3.select("#nulls")
    .html("");

  if(f_pedidos == 1){
    const pedidos_svg = d3.select("#pedidos")
      .append("svg")
        .attr("width", width)
        .attr("height", height);

    pedidos_svg.append("g")
      .call(xAxis);
    
    pedidos_svg.append("g")
      .call(yAxis);
      
    pedidos_svg.append("g")
      .attr("fill", "#00a088")
    .selectAll("rect").data(pedidos).enter().append("rect")
      .attr("x", (d,i) => x(etiquetas[i]))
      .attr("y", height - margin.bottom)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .transition()
      .duration(1000)
      .attr("y", d => y(d))
      .attr("height", d => y(0) - y(d));
  }

  if(f_ocupados == 1){
    const ocupados_svg = d3.select("#ocupados")
      .append("svg")
        .attr("width", width)
        .attr("height", height);

    ocupados_svg.append("g")
      .call(xAxis);
    
    ocupados_svg.append("g")
      .call(yAxis);
      
    ocupados_svg.append("g")
      .attr("fill", "#f58518")
    .selectAll("rect").data(ocupados).enter().append("rect")
      .attr("x", (d,i) => x(etiquetas[i]))
      .attr("y", height - margin.bottom)
      .attr("width", x.bandwidth())
      .transition()
      .duration(1000)
      .attr("y", d => y(d))
      .attr("height", d => y(0) - y(d));
  }

  if(f_nulls == 1){
    const nulls_svg = d3.select("#nulls")
      .append("svg")
        .attr("width", width)
        .attr("height", height);
    
    nulls_svg.append("g")
      .call(xAxis);
    
    nulls_svg.append("g")
      .call(yAxis);

    nulls_svg.append("g")
      .attr("fill", "#4c78a8")
    .selectAll("rect").data(nulls).enter().append("rect")
      .attr("x", (d,i) => x(etiquetas[i]))
      .attr("y", height - margin.bottom)
      .attr("width", x.bandwidth())
      .transition()
      .duration(1000)
      .attr("y", d => y(d))
      .attr("height", d => y(0) - y(d));
  }

  d3.select("#bars .loader").remove();
}

d3.select("#estado #f_pedidos")
  .on("click", function(){
    if(!d3.select(this).classed("is-selected")){
      d3.select(this).classed("is-selected", true);
      f_pedidos = 1;
    }else{
      d3.select(this).classed("is-selected", false);
      f_pedidos = 0;

      if(f_nulls == f_pedidos && f_nulls == f_ocupados){
        d3.select("#f_nulls").classed("is-selected", true);
        d3.select("#f_pedidos").classed("is-selected", true);
        d3.select("#f_ocupados").classed("is-selected", true);
        f_nulls = 1; f_ocupados = 1; f_pedidos = 1;
      }
    }
    loadData();
  });

d3.select("#estado #f_ocupados")
  .on("click", function(){
    if(!d3.select(this).classed("is-selected")){
      d3.select(this).classed("is-selected", true);
      f_ocupados = 1;
    }else{
      d3.select(this).classed("is-selected", false);
      f_ocupados = 0;

      if(f_nulls == f_pedidos && f_nulls == f_ocupados){
        d3.select("#f_nulls").classed("is-selected", true);
        d3.select("#f_pedidos").classed("is-selected", true);
        d3.select("#f_ocupados").classed("is-selected", true);
        f_nulls = 1; f_ocupados = 1; f_pedidos = 1;
      }
    }
    loadData();
  });

d3.select("#estado #f_nulls")
  .on("click", function(){
    if(!d3.select(this).classed("is-selected")){
      d3.select(this).classed("is-selected", true);
      f_nulls = 1;
    }else{
      d3.select(this).classed("is-selected", false);
      f_nulls = 0;

      if(f_nulls == f_pedidos && f_nulls == f_ocupados){
        d3.select("#f_nulls").classed("is-selected", true);
        d3.select("#f_pedidos").classed("is-selected", true);
        d3.select("#f_ocupados").classed("is-selected", true);
        f_nulls = 1; f_ocupados = 1; f_pedidos = 1;
      }
    }
    loadData();
  });
// Barras minutos
//d3.select("#minutes .loader").remove();

// Mapa
d3.select("#map").attr("style","height:"+(width-30)+"px");

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
            basemap:"gray-vector",
            center:[-74.1079335, 4.6264527],
            zoom: 19
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

window.onresize = function(event) {
  loadData();
}