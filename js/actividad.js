//Global
var margin = ({top: 20, right: 0, bottom: 35, left: 40});
var width = d3.select("#bars").node().getBoundingClientRect().width;
var height = (width/3);
var disponibles, ocupados, max, total_mediciones, taxis, t_taxis, p, o, n, x, y, numero_graficas;
var f_disponibles = 1;
var f_ocupados = 1;
var f_taxi = "all";
var f_taxi_set = false;

//Barras
var etiquetas = ["12am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am","12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];

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
      .attr("y", -35)
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

  height = (width/numero_graficas) -10;

  d3.csv("data/actividad.csv").then(function(data){
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
      if(d.h >= 0 && d.h <= 23 && (f_taxi == "all" || f_taxi == d.tid)){
        if(typeof taxis[d.tid] != "undefined"){
          taxis[d.tid] += 1;
        }else{
          taxis[d.tid] = 1;
          t_taxis += 1;

          if(f_taxi_set == false){
            d3.select("#f_taxis").append("option")
              .attr("value",d.tid)
              .text(d.tid);
          }
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
      if((active_hour == -1 || active_hour == d.h) && (f_taxi == "all" || f_taxi == d.tid)){
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
    total_mediciones = p+o+n;

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
    d3.select("#t_mediciones").text(total_mediciones);

    if(active_hour != -1){
      interaccionBarras(etiquetas[active_hour], true);
    }

    f_taxi_set = true;
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
    .range([width-20 - margin.bottom, margin.top])
    .padding(0.1);
  const xAxis = g => g
    .attr("transform", `translate(0,${width-20 - margin.bottom+10})`)
    .attr("class","yAxis_estados")
    .call(d3.axisBottom(minX)
      .ticks(10)
      .tickSizeOuter(0)
      .tickSize(-width-20))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:first-of-type text").clone()
      .attr("y", 15)
      .attr("x", 0)
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
      .attr("height", width-20);
    
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
  require([
  "esri/Map",
  "esri/views/MapView",
  "esri/widgets/LayerList",
  "esri/layers/FeatureLayer",
  "esri/renderers/Renderer",
  "esri/widgets/Home",
], function (Map, MapView, LayerList, FeatureLayer, Renderer,Home) {

  var map = new Map({
      basemap:"gray-vector"
  });
  const view = new MapView({
    container: "map",
    map: map,
    center:[-74.080, 4.666],
    scale: 206000
  });
  var homeBtn = new Home({
    view: view
  });
  view.ui.add(homeBtn, "top-left");  

  var marks = new FeatureLayer("https://services.arcgis.com/8DAUcrpQcpyLMznu/arcgis/rest/services/EstadoTaxis/FeatureServer/0", {
    id:"marks",
    styling:false,
    popupTemplate: { // autocasts as new PopupTemplate()
      title: "Medición del Taxi {tid}",
      content: "<ul><li>Hora: {hora}</li><li>Estado: {estado}</li><li>Es Origen: {origen}</li></ul>"
    }
  });
  
  view.watch("scale", function(newValue) {
    var dot_size
    if(newValue>20000){
      dot_size = "10px";
    }
    else{
      dot_size = "20px";
    }

    const symbol_oculto = {
      type: "simple-marker",
      color: "rgba(255,255,255,0)",
      outline:{
        width: 0
      },
      width: 0,
      height: 0,
    };
    var symbol_disponible = {
      type: "simple-marker",
      color: "rgba(76,120,168,0.5)",
      outline:{
        width: 0
      },
      size: dot_size,
    };
    var symbol_ocupado = {
      type: "simple-marker",
      color: "rgba(245,133,24,0.5)",
      outline:{
        width: 0
      },
      size: dot_size,
    };
    var symbol_origen = {
      type: "simple-marker",
      color: "rgba(25,25,25,1)",
      outline:{
        color: "rgba(245,133,24,1)",
        width: "2px",
      },
      size: dot_size,
    };
    if(f_disponibles == 0){
      symbol_disponible = symbol_oculto;
    }
    if(f_ocupados == 0){
      symbol_ocupado = symbol_oculto;
      symbol_origen = symbol_oculto;
    }

    var field2 = "origen";
    var unique_vals = [{
      value: "disponible, false",
      symbol: symbol_disponible,
      label: "Disponible"
    }, {
      value: "ocupado, false",
      symbol: symbol_ocupado,
      label: "Ocupado"
    }, {
      value: "ocupado, true",
      symbol: symbol_origen,
      label: "Ocupado (Origen)"
    }];
    var unique_vals_ah = [{
      value: "disponible, false, "+active_hour,
      symbol: symbol_disponible,
      label: "Disponible"
    }, {
      value: "ocupado, false, "+active_hour,
      symbol: symbol_ocupado,
      label: "Ocupado"
    }, {
      value: "ocupado, true, "+active_hour,
      symbol: symbol_origen,
      label: "Ocupado (Origen)"
    }];
    if(active_hour >= 0){
      unique_vals_ah = [{
        value: "disponible, false, "+active_hour,
        symbol: symbol_disponible,
        label: "Disponible"
      }, {
        value: "ocupado, false, "+active_hour,
        symbol: symbol_ocupado,
        label: "Ocupado"
      }, {
        value: "ocupado, true, "+active_hour,
        symbol: symbol_origen,
        label: "Ocupado (Origen)"
      }];
    }

    if(f_taxi != "all"){
      field2 = "tid";
      unique_vals = [{
        value: "disponible, "+f_taxi,
        symbol: symbol_disponible,
        label: "Disponible"
      }, {
        value: "ocupado, "+f_taxi,
        symbol: symbol_ocupado,
        label: "Ocupado"
      }];

      if(active_hour >= 0){
        unique_vals_ah = [{
          value: "disponible, "+f_taxi+", "+active_hour,
          symbol: symbol_disponible,
          label: "Disponible"
        }, {
          value: "ocupado, "+f_taxi+", "+active_hour,
          symbol: symbol_ocupado,
          label: "Ocupado"
        }];
      }
    }

    marks.renderer = {
      type: "unique-value",
      field: "estado",
      field2: field2,
      fieldDelimiter: ", ",
      uniqueValueInfos: unique_vals
    };
  
    if(active_hour >= 0){
      marks.renderer = {
        type: "unique-value",
        field: "estado",
        field2: field2,
        field3: "h",
        fieldDelimiter: ", ",
        uniqueValueInfos: unique_vals_ah
      };
    }
  });
  
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

d3.select("#f_taxis")
  .on("change", function(){
    f_taxi = d3.select("#f_taxis").property("value");
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
    .annotations(annotations);

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
var element = $('.tofix').offset();
$('.tofix').css("width",$('.columns.is-desktop').width());
if($(window).scrollTop() > element.top){
  $('.tofix').css('position','fixed').css('top','0');
} else {
  $('.tofix').css('position','static');
}

$(window).scroll(function(){
  if($(window).scrollTop() > element.top){
    $('.tofix').css('position','fixed').css('top','0');
  } else {
    $('.tofix').css('position','static');
  }   
});

// EnjoyHint

function takeTour(){
  var enjoyhint_instance = new EnjoyHint({});
  var enjoyhint_script_steps = [
    {
      "next #intro": "<p>¡Hola!</p><p>Antes de comenzar debes saber sobre lo que significa la actividad de los taxis inteligentes.</p>",
      "nextButton" : {text: "Siguiente"},
      "skipButton" : {text: "Omitir"},
    },{
      "next #filters": "<p>Puedes filtrar los datos que se muestran en todas las gráficas con estas opciones.</p>",
      "nextButton" : {text: "Siguiente"},
      "skipButton" : {text: "Omitir"},
    },{
      "click #f_ocupados": "<p>Por ejemplo, <b>haz clic</b> en Ocupado para desactivarlo y ocultar sus datos.</p>",
      "showSkip": false
    },{
      "next #graphics-bars": "<p>Nota que los gráficos ahora sólo muestran los datos del estado <b>Disponible</b> ya que el filtro de Ocupado está desactivado.</p>",
      "nextButton" : {text: "Siguiente"},
      "skipButton" : {text: "Omitir"},
    },{
      "next #map": "<p>Incluso el mapa se actualiza con los nuevos parámetros.<br>En el mapa puedes hacer zoom y click sobre los puntos para obtener más información.</p>",
      "nextButton" : {text: "Siguiente"},
      "skipButton" : {text: "Omitir"},
    },{
      "click #f_ocupados": "<p>Reactívalo nuevamente haciendo clic.</p>",
      "showSkip": false
    },{
      "next #bars": "<p>Con esta gráfica también es posible filtrar los datos por hora haciendo click en la etiqueta de la hora o en la barra correspondiente.</p><p>Para desactivar el filtro debes hacer clic nuevamente.</p>",
      "nextButton" : {text: "Siguiente"},
      "skipButton" : {text: "Omitir"},
    },{
      "next #data": "<p>Estos son los datos que se muestran en las gráficas, al usar los filtros estos valores también cambiarán.</p>",
      "nextButton" : {text: "Siguiente"},
      "skipButton" : {text: "Omitir"},
    },{
      "next #insights": "<p>Finalmente nuestro análisis de la información.</p>",
      "showSkip": false,
      "nextButton" : {text: "Terminar"},
    }
  ];

  enjoyhint_instance.set(enjoyhint_script_steps);
  enjoyhint_instance.run();
  document.cookie = "guide=taken";
}

if(document.cookie.indexOf("guide") == -1){
  takeTour();
}