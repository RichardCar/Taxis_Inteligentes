//Global
var margin = ({top: 20, right: 0, bottom: 35, left: 40});
var width = d3.select("#bars").node().getBoundingClientRect().width;
var height = (width/3);
var rawData, mapData, disponibles, ocupados, max, totalMediciones, taxis, t_taxis, p, o, n, x, y, numero_graficas;

//Barras
var etiquetas = ["12am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am","12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];
var f_disponibles = 1;
var f_ocupados = 1;

//Barras Minutos
var minutos = {"disponible": 0, "ocupado": 0};

//Mapa
var origenes = [];

// Annotations
var etiquetas_ann = ["[12am - 1am)","[1am - 2am)","[2am - 3am)","[3am - 4am)","[4am - 5am)","[5am - 6am)","[6am - 7am)","[7am - 8am)","[8am - 9am)","[9am - 10am)","[10am - 11am)","[11am - 12pm)","[12pm - 1pm)","[1pm - 2pm)","[2pm - 3pm)","[3pm - 4pm)","[4pm - 5pm)","[5pm - 6pm)","[6pm - 7pm)","[7pm - 8pm)","[8pm - 9pm)","[9pm - 10pm)","[10pm - 11pm)","[11pm - 12am)"];
var disponibles_svg, ocupados_svg;
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

function loadData(click_hora = false){
  width = d3.select("#bars").node().getBoundingClientRect().width;
  numero_graficas = 0;

  if(f_disponibles){
    numero_graficas += 1;
  }
  if(f_ocupados){
    numero_graficas += 1;
  }

  height = (width/numero_graficas);

  d3.csv("data/actividad.csv").then(function(data){
    rawData = data;
    
    disponibles = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    ocupados = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    minutos = {"disponible": 0, "ocupado": 0};

    max = 0;
    taxis = [];
    t_taxis = 0;
    p = 0;
    o = 0;
    n = 0;

    var min_ocupados = [];
    var min_disponibles = [];
    
    data.forEach(function(d, i){
      var to_count = 0;
      if(d.h >= 0 && d.h <= 23){
        if(typeof taxis[d.tid] != "undefined"){
          taxis[d.tid] += 1;
        }else{
          taxis[d.tid] = 1;
          t_taxis += 1;
        }
        if(d.estado == "disponible" && (f_disponibles == 1)){
          disponibles[d.h] += 1;
          p += 1;
          if(max < disponibles[d.h]){
            max = disponibles[d.h];
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
      }
      if(active_hour == -1 || active_hour == d.h){
        if(to_count == 1){
          if(d.estado == "ocupado"){
            min_ocupados[d.tid+d.hora] = 1;
          }else{
            min_disponibles[d.tid+d.hora] = 1;
          }
        }
      }
    });
    
    for(var propertyName in min_ocupados){     
      minutos["ocupado"] += 1;
    }
    for(var propertyName in min_disponibles){     
      minutos["disponible"] += 1;
    }
    totalMediciones = p+o+n;

    y = d3.scaleLinear()
      .domain([0, max]).nice()
      .range([height - margin.bottom, margin.top]);
    x = d3.scaleBand()
      .domain(etiquetas)
      .range([margin.left, width - margin.right])
      .padding(0.1);
    
    if(click_hora == false){
      drawBars();
      drawHorizontalBars();
      drawMap();
    }else{
      drawHorizontalBars();
      drawMap();
    }

    disponibles_old = disponibles;
    ocupados_old = ocupados;

    d3.select("#t_taxis").text(t_taxis);
    d3.select("#t_mediciones").text(totalMediciones);

    if(active_hour != -1){
      interaccionBarras(etiquetas[active_hour], true);
    }
  });
}

function drawBars(){
  d3.select("#disponibles")
    .html("");
  d3.select("#ocupados")
    .html("");

  if(f_disponibles == 1){
    disponibles_svg = barsSvg(disponibles, disponibles_svg, "#disponibles", "#4c78a8");
  }

  if(f_ocupados == 1){
    ocupados_svg = barsSvg(ocupados, ocupados_svg, "#ocupados", "#f58518");
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
          disponibles_svg.select(".annotation-group").remove();
          ocupados_svg.select(".annotation-group").remove();
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
        loadData(true);
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
        disponibles_svg.select(".annotation-group").remove();
        ocupados_svg.select(".annotation-group").remove();
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
      loadData(true);
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
  //minutos["ocupado"] = Math.round(minutos["ocupado"]/t_taxis);
  //minutos["disponible"] = Math.round(minutos["disponible"]/t_taxis);
  if(max_minutos < minutos["disponible"] && f_disponibles == 1){
    max_minutos = minutos["disponible"];
  }
  if(max_minutos < minutos["ocupado"] && f_ocupados == 1){
    max_minutos = minutos["ocupado"];
  }

  var domain = [];
  if(f_disponibles == 1){
    domain.push("Disponible");
  }
  if(f_ocupados == 1){
    domain.push("Ocupado");
  }

  const minX = d3.scaleLinear()
    .domain([0, max_minutos]).nice()
    .range([margin.left+15, width - margin.right - 10]);
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
      .attr("transform", `translate(${margin.left+15},0)`)
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

  if(f_disponibles == 1){
    svg.append("g")
      .attr("fill", "#4c78a8")
      .append("rect")
      .attr("x", minX(0))
      .attr("y", d => minY("Disponible"))
      .attr("height", minY.bandwidth())
      .attr("width", 0)
      .transition()
      .duration(1000)
      .attr("width", d => minX(minutos["disponible"]) - minX(0));
    svg.append("g")
      .attr("fill", "white")
      .attr("text-anchor", "end")
      .style("font", "1.51m sans-serif")
      .append("text")
      .attr("x", d =>  minX(minutos["disponible"]) - 5)
      .attr("y", d => minY("Disponible") + minY.bandwidth() - 10)
      .html(d => minutos["disponible"]);
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
      .text(d => minutos["ocupado"]);
  }

  const myNotification = window.createNotification({
    closeOnClick: true,
    displayCloseButton: true,
    positionClass: "nfc-bottom-right",
    showDuration: 5000,
    theme: "info"
  })({
    title: "Notificación",
    message: "Las barras horizontales han sido actualizadas"
  });
}
d3.select("#minutes .loader").remove();

// End Barras Minutos

// Begin Mapa
function insertOrigen(cid,lat,lon){
  if(cid != 0){
    if(origenes.indexOf(cid) == -1){
      origenes[cid] = [];
    }
    origenes[cid].push({"lat":lat,"lon":lon});
  }
}
function drawMap(){
  d3.select("#map")
    .html("");
  d3.select("#map").attr("style","height:"+(width-30)+"px");
  var service = "https://services.arcgis.com/8DAUcrpQcpyLMznu/arcgis/rest/services/TActividadTaxis/FeatureServer/0";
  require([
  "esri/Map",
  "esri/views/MapView",
  "esri/widgets/LayerList",
  "esri/layers/FeatureLayer",
  "esri/renderers/Renderer",
], function (Map, MapView, LayerList, FeatureLayer, Renderer) {

  var map = new Map({
      basemap:"gray-vector"
  });
  const view = new MapView({
    container: "map",
    map: map,
    center:[-74.1079335, 4.6264527],
    zoom: 19
  });

  var marks = new FeatureLayer("https://services.arcgis.com/8DAUcrpQcpyLMznu/arcgis/rest/services/TActividadTaxis/FeatureServer/0", {
    id:"marks",
    styling:false,
    popupTemplate: { // autocasts as new PopupTemplate()
      title: "Medición del taxi {tid}",
      content: "test"
    }
  });
  const symbol_oculto = {
    type: "simple-marker",
    color: "rgba(255,255,255,0)",
    outline:{
      width: 0
    },
    width: 0,
    height: 0,
  };
  const symbol_null = {
    type: "simple-marker",
    color: "rgba(76,120,168,0.5)",
    outline:{
      width: 0
    },
    width: 10,
    height: 10,
  };
  const symbol_pedido = {
    type: "simple-marker",
    color: "rgba(0,160,136,0.5)",
    outline:{
      width: 0
    },
    width: 10,
    height: 10,
  };
  var symbol_disponible = {
    type: "simple-marker",
    color: "rgba(76,120,168,0.5)",
    outline:{
      width: 0
    },
    width: 10,
    height: 10,
  };
  var symbol_ocupado = {
    type: "simple-marker",
    color: "rgba(245,133,24,0.5)",
    outline:{
      width: 0
    },
    width: 10,
    height: 10,
  };
  var symbol_origen = {
    type: "simple-marker",
    color: "rgba(25,25,25,1)",
    outline:{
      color: "rgba(245,133,24,1)",
      width: 2
    },
    width: 8,
    height: 8,
  };
  if(f_disponibles == 0){
    symbol_disponible = symbol_oculto;
  }
  if(f_ocupados == 0){
    symbol_ocupado = symbol_oculto;
    symbol_origen = symbol_oculto;
  }

  marks.renderer = {
    type: "unique-value",
    field: "estado",
    //field2: "origen",
    uniqueValueInfos: [{
      value: "null",
      symbol: symbol_null,
      label: "Vacío"
    }, {
      value: "pedido",
      symbol: symbol_pedido,
      label: "Pedido"
    }, {
      value: "disponible",//"disponible, false"
      symbol: symbol_disponible,
      label: "Disponible"
    }, {
      value: "ocupado",//"ocupado, false"
      symbol: symbol_ocupado,
      label: "Ocupado"
    }, {
      value: "ocupado",//"ocupado, true"
      symbol: symbol_origen,
      label: "Ocupado (Origen)"
    }]
  };
  
  const layerList = new LayerList({
    view: view,
    listItemCreatedFunction: function(event) {
      event.item.title = "Actividad de Taxis";
      event.item.panel = {
        content: "legend",
        open: true
      };
    }
  });
  view.ui.add(layerList, "top-right");
  map.add(marks);
  
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
d3.select("#estado #f_disponibles")
  .on("click", function(){
    if(!d3.select(this).classed("is-selected")){
      d3.select(this).classed("is-selected", true);
      f_disponibles = 1;
    }else{
      d3.select(this).classed("is-selected", false);
      f_disponibles = 0;

      if(f_disponibles == f_ocupados){
        d3.select("#f_disponibles").classed("is-selected", true);
        d3.select("#f_ocupados").classed("is-selected", true);
        f_ocupados = 1; f_disponibles = 1;
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

      if(f_disponibles == f_ocupados){
        d3.select("#f_disponibles").classed("is-selected", true);
        d3.select("#f_ocupados").classed("is-selected", true);
        f_ocupados = 1; f_disponibles = 1;
      }
    }
    loadData();
  });

function interaccionBarras(hora, active = false){
  var i = etiquetas.indexOf(hora);
  barras_annotate(disponibles_svg, x(etiquetas[i]), y(disponibles[i]), disponibles[i], i, "Disponibles", active);
  barras_annotate(ocupados_svg, x(etiquetas[i]), y(ocupados[i]), ocupados[i], i, "Ocupados", active);
}
// End Interacciones

// Begin Annotations
function barras_annotate(svg, posX, posY, d, i, label, active){
  if(svg){
    svg.select(".annotation-group").remove();
  }
  posX += x.bandwidth()/2;

  var color = (active)? "#ff3860" : "#00a088";
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

// JQuery
var element = $('#filters').offset();
$('#filters').css("width",$('.columns.is-desktop').width());
if($(window).scrollTop() > element.top){
  $('#filters').css('position','fixed').css('top','0');
} else {
  $('#filters').css('position','static');
}

$(window).scroll(function(){
  if($(window).scrollTop() > element.top){
    $('#filters').css('position','fixed').css('top','0');
  } else {
    $('#filters').css('position','static');
  }   
});