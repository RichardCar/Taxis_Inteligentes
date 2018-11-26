//Global
var margin = ({top: 20, right: 0, bottom: 35, left: 40});
var width = d3.select("#bars").node().getBoundingClientRect().width-10;
var height = (width/3);
var rawData, mapData, nulls, pedidos, ocupados, max, totalMediciones, taxis, t_taxis, p, o, n, x, y, numero_graficas;

//Barras
var etiquetas = ["12am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am","12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];
var f_pedidos = 1;
var f_ocupados = 1;
var f_nulls = 1;

//Barras Minutos
var minutos = {"pedido": 0, "ocupado": 0, "null": 0};

// Annotations
var etiquetas_ann = ["[12am - 1am)","[1am - 2am)","[2am - 3am)","[3am - 4am)","[4am - 5am)","[5am - 6am)","[6am - 7am)","[7am - 8am)","[8am - 9am)","[9am - 10am)","[10am - 11am)","[11am - 12pm)","[12pm - 1pm)","[1pm - 2pm)","[2pm - 3pm)","[3pm - 4pm)","[4pm - 5pm)","[5pm - 6pm)","[6pm - 7pm)","[7pm - 8pm)","[8pm - 9pm)","[9pm - 10pm)","[10pm - 11pm)","[11pm - 12am)"];
var pedidos_svg, ocupados_svg, nulls_svg
var active_hour = -1;
var annotations, makeAnnotations;
var type = d3.annotationCallout;

loadData();

// Barras horas
yAxis_estados = g => g
  .attr("transform", `translate(${margin.left},0)`)
  .attr("class", "yAxis_estados")
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
      .text("Número de mediciones"));
xAxis_estados = g => g
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .attr("class", "xAxis_estados")
  .call(d3.axisBottom(x)
    .tickSizeOuter(0)
    .ticks(24)
    .tickSize(-height))
  .call(g => g.select(".tick:first-of-type text").clone()
      .attr("y", 15)
      .attr("x", -10)
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text("Hora del día"));

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
    minutos = {"pedido": 0, "ocupado": 0, "null": 0};

    max = 0;
    taxis = [];
    t_taxis = 0;
    p = 0;
    o = 0;
    n = 0;

    var last_carrera = 0;
    var last_estado = "";
    var inicio_minutos = 0;
    var fin_minutos = 0;
    
    data.forEach(function(d, i){
      var to_count = 0;
      if(d.h >= 0 && d.h <= 23){
        if(typeof taxis[d.tid] != "undefined"){
          taxis[d.tid] += 1;
        }else{
          taxis[d.tid] = 1;
          t_taxis += 1;
        }
        if(d.estado == "pedido" && (f_pedidos == 1)){
          pedidos[d.h] += 1;
          p += 1;
          if(max < pedidos[d.h]){
            max = pedidos[d.h];
          }
          to_count = 1;
        }
        if(d.estado == "ocupado" && (f_ocupados == 1)){
          ocupados[d.h] += 1;
          o += 1;
          if(max < ocupados[d.h]){
            max = ocupados[d.h];
          }
          to_count = 1;
        }
        if(d.estado == "null" && (f_nulls == 1)){
          nulls[d.h] += 1;
          n += 1;
          if(max < nulls[d.h]){
            max = nulls[d.h];
          }
          to_count = 1;
        }
      }

      if(to_count == 1){
        if(last_carrera == 0 && last_estado == ""){
          last_carrera = d.cid;
          last_estado = d.estado;
          inicio_minutos = getMinutes(d.hora);
          fin_minutos = getMinutes(d.hora);
        }
        if(last_carrera != d.cid || last_estado != d.estado){
          minutos[last_estado] += (fin_minutos - inicio_minutos);
          last_carrera = d.cid;
          inicio_minutos = getMinutes(d.hora);
        }
        fin_minutos = getMinutes(d.hora);
        last_estado = d.estado;
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
    drawHorizontalBars();
    drawMap();

    nulls_old = nulls;
    pedidos_old = pedidos;
    ocupados_old = ocupados;

    d3.select("#t_taxis").text(t_taxis);
    d3.select("#t_mediciones").text(totalMediciones);

    if(active_hour != -1){
      interaccionBarras(etiquetas[active_hour], true);
    }
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
    pedidos_svg = barsSvg(pedidos, pedidos_svg, "#pedidos", "#00a088");
  }

  if(f_ocupados == 1){
    ocupados_svg = barsSvg(ocupados, ocupados_svg, "#ocupados", "#f58518");
  }

  if(f_nulls == 1){
    nulls_svg = barsSvg(nulls, nulls_svg, "#nulls", "#4c78a8");
  }

  d3.select("#bars .loader").remove();
}

function barsSvg(data, svg, id, color){
  svg = d3.select(id)
    .append("svg")
      .attr("width", width)
      .attr("height", height);
  
  svg.append("g")
    .call(yAxis_estados);
  svg.append("g")
    .call(xAxis_estados)
      .selectAll(".tick")
      .on("mouseover", function(d,i){
        if(active_hour == -1){
          interaccionBarras(d);
        }
      })
      .on("mouseout", function(d,i){
        if(active_hour == -1){
          pedidos_svg.select(".annotation-group").remove();
          ocupados_svg.select(".annotation-group").remove();
          nulls_svg.select(".annotation-group").remove();
        }
      })
      .on("click", function(d,i){
        if(active_hour == i){
          active_hour = -1;
          interaccionBarras(etiquetas[i], false);
        }else{
          active_hour = i;
          interaccionBarras(etiquetas[i], true);
        }
      });

  svg.append("g")
    .attr("fill", color)
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .on("mouseover", function(d, i){
      if(active_hour == -1){
        interaccionBarras(etiquetas[i]);
      }
    })
    .on("mouseout", function(d,i){
      if(active_hour == -1){
        pedidos_svg.select(".annotation-group").remove();
        ocupados_svg.select(".annotation-group").remove();
        nulls_svg.select(".annotation-group").remove();
      }
    })
    .on("click", function(d,i){
      if(active_hour == i){
        active_hour = -1;
        interaccionBarras(etiquetas[i], false);
      }else{
        active_hour = i;
        interaccionBarras(etiquetas[i], true);
      }
    })
    .attr("x", (d,i) => x(etiquetas[i]))
    .attr("y", height - margin.bottom)
    .attr("width", x.bandwidth())
    .transition()
    .duration(1000)
    .attr("y", d => y(d))
    .attr("height", d => y(0) - y(d));

  return svg;
}

// Begin Barras Minutos

function getMinutes(hour){
  var arr = hour.split(":");
  var m1 = 0;
  var m2 = 0;

  if(parseInt(arr[0][0]) == 0){
    m1 = parseInt(arr[0][1]) * 60;
  }else{
    m1 = parseInt(arr[0]) * 60;
  }

  if(parseInt(arr[1][0]) == 0){
    m2 = parseInt(arr[1][1]);
  }else{
    m2 = parseInt(arr[1]);
  }
  
  return m1 + m2;
}

function drawHorizontalBars(){
  var max_minutos = 0;
  if(max_minutos < minutos["pedido"] && f_pedidos == 1){
    max_minutos = minutos["pedido"];
  }
  if(max_minutos < minutos["ocupado"] && f_ocupados == 1){
    max_minutos = minutos["ocupado"];
  }
  if(max_minutos < minutos["null"] && f_nulls == 1){
    max_minutos = minutos["null"];
  }

  var domain = [];
  if(f_nulls == 1){
    domain.push("Vacío");
  }
  if(f_ocupados == 1){
    domain.push("Ocupado");
  }
  if(f_pedidos == 1){
    domain.push("Pedido");
  }

  const minX = d3.scaleLinear()
    .domain([0, max_minutos]).nice()
    .range([margin.left+10, width - margin.right - 10]);
  const minY = d3.scaleBand()
    .domain(domain)
    .range([width - margin.bottom, margin.top])
    .padding(0.1);
  const xAxis = g => g
    .attr("transform", `translate(0,${width - margin.bottom+10})`)
    .attr("class","yAxis_estados")
    .call(d3.axisBottom(minX)
      .ticks(10)
      .tickSizeOuter(0)
      .tickSize(-width))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:first-of-type text").clone()
      .attr("y", 15)
      .attr("x", -10)
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text("Minutos"));
  var yAxis = g => g
      .attr("transform", `translate(${margin.left+10},0)`)
      .call(d3.axisLeft(minY).tickSizeOuter(0));

  d3.select("#minutes").html("");

  const svg = d3.select("#minutes")
    .append("svg")
      .attr("width", width)
      .attr("height", width);
    
  svg.append("g")
    .call(xAxis);
  svg.append("g")
    .call(yAxis);

  if(f_pedidos == 1){
    svg.append("g")
      .attr("fill", "#00a088")
      .append("rect")
      .attr("x", minX(0))
      .attr("y", d => minY("Pedido"))
      .attr("height", minY.bandwidth())
      .attr("width", 0)
      .transition()
      .duration(1000)
      .attr("width", d => minX(minutos["pedido"]) - minX(0));
    svg.append("g")
      .attr("fill", "white")
      .attr("text-anchor", "end")
      .style("font", "1.51m sans-serif")
      .append("text")
      .attr("x", d =>  minX(minutos["pedido"]) - 5)
      .attr("y", d => minY("Pedido") + minY.bandwidth() - 10)
      .html(d => minutos["pedido"]+" Minutos");
  }
  if(f_ocupados == 1){
    svg.append("g")
      .attr("fill", "#f58518")
      .append("rect")
      .attr("x", minX(0))
      .attr("y", d => minY("Ocupado"))
      .attr("height", minY.bandwidth())
      .attr("width", 0)
      .transition()
      .duration(1000)
      .attr("width", d => minX(minutos["ocupado"]) - minX(0));
    svg.append("g")
      .attr("fill", "white")
      .attr("text-anchor", "end")
      .style("font", "1.51m sans-serif")
      .append("text")
      .attr("x", d =>  minX(minutos["ocupado"]) - 5)
      .attr("y", d => minY("Ocupado") + minY.bandwidth() - 10)
      .text(d => minutos["ocupado"]+" Minutos");
  }
  if(f_nulls == 1){
    svg.append("g")
      .attr("fill", "#4c78a8")
      .append("rect")
      .attr("x", minX(0))
      .attr("y", d => minY("Vacío"))
      .attr("height", minY.bandwidth())
      .attr("width", 0)
      .transition()
      .duration(1000)
      .attr("width", d => minX(minutos["null"]) - minX(0));
      svg.append("g")
      .attr("fill", "white")
      .attr("text-anchor", "end")
      .style("font", "1.51m sans-serif")
      .append("text")
      .attr("x", d =>  minX(minutos["null"]) - 5)
      .attr("y", d => minY("Vacío") + minY.bandwidth() - 10)
      .text(d => minutos["null"]+" Minutos");
  }
}
d3.select("#minutes .loader").remove();

// End Barras Minutos

// Begin Mapa
function drawMap(){
  d3.select("#map")
    .html("");
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
  const myNotification = window.createNotification({
    closeOnClick: true,
    displayCloseButton: true,
    positionClass: "nfc-bottom-right",
    showDuration: 5000,
    theme: "info"
  })({
    title: "Notificación",
    message: "El mapa ha sido actualizado"
  });
}
// End Mapa

// Begin Interacciones
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

function interaccionBarras(hora, active = false){
  var i = etiquetas.indexOf(hora);
  barras_annotate(pedidos_svg, x(etiquetas[i]), y(pedidos[i]), pedidos[i], i, "Pedidos", active);
  barras_annotate(ocupados_svg, x(etiquetas[i]), y(ocupados[i]), ocupados[i], i, "Ocupados", active);
  barras_annotate(nulls_svg, x(etiquetas[i]), y(nulls[i]), nulls[i], i, "Vacío", active);
}
// End Interacciones

// Begin Annotations
function barras_annotate(svg, posX, posY, d, i, label, active){
  if(svg){
    svg.select(".annotation-group").remove();
  }
  posX += x.bandwidth()/2;

  var color = (active)? "#ff3860" : "#209cee";
  if(active){
    label = label+" (Filtro Activo)"
  }
  var mediciones = (d == 1)? " Medición" : " Mediciones";
  annotations = [{
    note: {
      label: label,
      title: etiquetas_ann[i]+" * "+d+mediciones,
      wrapSplitter: " * "
    },
    //can use x, y directly instead of data
    x: posX,
    y: posY,
    dy: (height/2)-posY-10,
    dx: ((posX + 50) >= (width-160))? -50 : 50,
    width: 160,
    color: color
  }];

  makeAnnotations = d3.annotation()
    .editMode(false)
    .notePadding(5)
    .type(type)
    .annotations(annotations)

  var ac = (active)? " active" : "";
  svg.append("g")
    .attr("class", "annotation-group"+ac)
    .call(makeAnnotations)
}
// End Annotations

window.onresize = function(event) {
  loadData();
}