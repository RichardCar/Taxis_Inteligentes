var margin = {
    top: 30,
    right: 10,
    bottom: 30,
    left: 10
  },
  node, link;
width = 600, height = 920;
var units = "servicios",
  regiones = ["centro", "sur", "norte", "oriente", "occidente"];
var formatNumber = d3.format(",.0f"), // zero decimal places
  format = function (d) {
    return formatNumber(d) + " " + units;
  },
  color = d3.scaleOrdinal(d3.schemeCategory10);

// append the svg object to the body of the page
var svg = d3.select(".grafico").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);
// svg.append("text")
// .attr("x", 50)
// .attr("y", 5)
// .attr("dy", ".35em")
// .attr("text-anchor", "end")
// .text("Origen")

// svg.append("text")
// .attr("x", (width)-50)
// .attr("y", 5)
// .attr("dy", ".35em")
// .attr("text-anchor", "end")
// .text("Destino")

svg
  .append("rect")
  .attr("height", 10)
  .attr("width", 10)
  .attr("x", 50)
  .attr("y", (height + margin.top + margin.bottom) - 10)
  .attr("fill", d => color("centro"));

svg.append("text")
  .attr("x", 62)
  .attr("y", (height + margin.top + margin.bottom) - 2.5)
  .text("Centro");

svg
  .append("rect")
  .attr("height", 10)
  .attr("width", 10)
  .attr("x", 150)
  .attr("y", (height + margin.top + margin.bottom) - 10)
  .attr("fill", d => color("sur"));

svg.append("text")
  .attr("x", 162)
  .attr("y", (height + margin.top + margin.bottom) - 2.5)
  .text("Sur");

svg
  .append("rect")
  .attr("height", 10)
  .attr("width", 10)
  .attr("x", 250)
  .attr("y", (height + margin.top + margin.bottom) - 10)
  .attr("fill", d => color("norte"));

svg.append("text")
  .attr("x", 262)
  .attr("y", (height + margin.top + margin.bottom) - 2.5)
  .text("Norte");
svg
  .append("rect")
  .attr("height", 10)
  .attr("width", 10)
  .attr("x", 350)
  .attr("y", (height + margin.top + margin.bottom) - 10)
  .attr("fill", d => color("oriente"));

svg.append("text")
  .attr("x", 362)
  .attr("y", (height + margin.top + margin.bottom) - 2.5)
  .text("Oriente");

svg
  .append("rect")
  .attr("height", 10)
  .attr("width", 10)
  .attr("x", 450)
  .attr("y", (height + margin.top + margin.bottom) - 10)
  .attr("fill", d => color("occidente"));

svg.append("text")
  .attr("x", 462)
  .attr("y", (height + margin.top + margin.bottom) - 2.5)
  .text("Occidente");

svg.append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

// Set the sankey diagram properties
var sankey = d3.sankey()
  .nodeWidth(36)
  .nodePadding(40)
  .size([width, height]);

var path = sankey.link();
//get Data
// const _urlData = "data/datos2.json";
// alert(gisService.Abril2017._urlData);
var createSankey = (data) => {
  d3.json(data).then(datos => {
    //console.log(datos);

    const myNotification = window.createNotification({
      closeOnClick: true,
      displayCloseButton: true,
      positionClass: "nfc-bottom-right",
      showDuration: 5000,
      theme: "info"
    })({
      title: "Notificación",
      message: "haga clic sobre un origen"
    });
    sankey
      .nodes(datos.nodes)
      .links(datos.links.sort((a, b) => {
        return a.value - b.value;
      }))
      .layout(50);

    // add in the links
    link = svg.append("g").selectAll(".link")
      .data(datos.links)
      .enter().append("path")
      .attr("class", "link")
      .attr("d", path)
      .style("stroke-width", function (d) {
        return Math.max(1, d.dy);
      })
      .sort(function (a, b) {
        return b.dy - a.dy;
      });

    // add the link titles
    link.append("title")
      .text(function (d) {
        return d.source.name + " → " +
          d.target.name + "\n" + format(d.value);
      });

    // add in the nodes
    node = svg.append("g").selectAll(".node")
      .data(datos.nodes)
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", function (d) {
        return "translate(" + d.x + "," + (d.y) + ")";
      })
      .on("click", (d) => {
        console.log(d);
        cambioMapa(d.name);
      });
    // .call(d3.drag()
    //   .subject(function (d) {
    //     return d;
    //   })
    //   .on("start", function () {
    //     this.parentNode.appendChild(this);
    //   })
    //   //.on("click",changeMap)
    //   .on("drag", dragmove)
    // //.on("click",d=>console.log(d))
    // );


    node.append("rect")
      .attr("height", function (d) {
        return d.dy;
      })
      .attr("width", sankey.nodeWidth())
      .style("fill", function (d) {
        return d.color = color(d.region.replace(/ .*/, ""));
      })
      .style("stroke", function (d) {
        return d3.rgb(d.color).darker(2);
      })
      .append("title")
      .text(function (d) {
        return d.name + "\n " + format(d.value);
      });

    // add in the title for the nodes
    node.append("text")
      .attr("x", -6)
      .attr("y", function (d) {
        return d.dy / 2;
      })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function (d) {
        return d.name;
      })
      .filter(function (d) {
        return d.x < width / 2;
      })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start");


  });
}

var removeData = () => {
  link.remove();
  node.remove();
}

var tour=()=>{
  var enjoyhint_instance = new EnjoyHint({});
  var enjoyhint_script_steps = [
    {
      "next #intro": "<p>¡Hola!</p><p>Antes de comenzar debes saber sobre lo que significa la actividad de los taxis inteligentes.</p>",
      "nextButton" : {text: "Siguiente"},
      "skipButton" : {text: "Omitir"},
    }
    //,{
    //   "next #filters": "<p>Puedes filtrar los datos que se muestran en todas las gráficas con estas opciones.</p>",
    //   "nextButton" : {text: "Siguiente"},
    //   "skipButton" : {text: "Omitir"},
    // },{
    //   "click #f_ocupados": "<p>Por ejemplo, <b>haz clic</b> en Ocupado para desactivarlo y ocultar sus datos.</p>",
    //   "showSkip": false
    // },{
    //   "next #graphics-bars": "<p>Nota que los gráficos ahora sólo muestran los datos del estado <b>Disponible</b> ya que el filtro de Ocupado está desactivado.</p>",
    //   "nextButton" : {text: "Siguiente"},
    //   "skipButton" : {text: "Omitir"},
    // },{
    //   "next #map": "<p>Incluso el mapa se actualiza con los nuevos parámetros.</p>",
    //   "nextButton" : {text: "Siguiente"},
    //   "skipButton" : {text: "Omitir"},
    // },{
    //   "click #f_ocupados": "<p>Reactívalo nuevamente haciendo clic.</p>",
    //   "showSkip": false
    // },{
    //   "next #bars": "<p>Con esta gráfica también es posible filtrar los datos por hora haciendo click en la etiqueta de la hora o en la barra correspondiente.</p><p>Para desactivar el filtro debes hacer clic nuevamente.</p>",
    //   "nextButton" : {text: "Siguiente"},
    //   "skipButton" : {text: "Omitir"},
    // },{
    //   "next #data": "<p>Estos son los datos que se muestran en las gráficas, al usar los filtros estos valores también cambiarán.</p>",
    //   "showSkip": false,
    //   "nextButton" : {text: "Terminar"},
    // }
  ];

  enjoyhint_instance.set(enjoyhint_script_steps);
  enjoyhint_instance.run();
  document.cookie = "tour=taken";
}

if(document.cookie.indexOf("tour") == -1){
  tour();
}