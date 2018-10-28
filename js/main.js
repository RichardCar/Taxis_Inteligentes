var selectDepto = document.getElementById("selDepto"),
 margin = {
  top: 20,
  right: 80,
  bottom: 130,
  left: 50
};
width = 620, height = 500;

//get Data
const _urlData = "https://fabianheredia.github.io/creditosAgroColombia/data/datos.json";

d3.json(_urlData).then(datos => {
  console.log(datos);
  
  //Listado de Departamentos y tipos de productor
  var departamentos = datos
    .map(d => d.Departamento)
    .filter((v, i, a) => a.indexOf(v) === i);

  departamentos.map((d,i)=>{
    let c = document.createElement("option");
    c.text = d;
    selectDepto.options.add(c, i);
  });
  selectDepto.getElementsByTagName('option')[1].selected = 'selected';
  var tiposProductor = datos
    .map(d => d.Tproductor)
    .filter((v, i, a) => a.indexOf(v) === i);
  const anios = datos
    .map(d => d.Anio)
    .filter((v, i, a) => a.indexOf(v) === i);

  //creo el espacio de trabajo
  var svg = d3
    .select(".grafico")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  // defini las escalas
  var x = d3.scaleLinear().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeDark2);
  x.domain([d3.min(datos,d=>d.Anio),d3.max(datos,d=>d.Anio)]);
  y.domain([(d3.min(datos, d => d.Valor)-1), d3.max(datos, d => d.Valor)]).nice();

  //console.log(departamentos);
  g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("fill", "#000")
    .text("Millones, $");

  svg
    .selectAll(".dot")
    .data(datos)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("transform", "translate("+ margin.left + "," + 0 + ")")
    .attr("fill",d=> z(d.Tproductor))
    .attr("cx", d => x(d.Anio))
    .attr("cy", d => y(d.Valor))
    .on("mouseover", d => {
      d3.select(".info").remove();
      console.log(d);
      svg
        .selectAll("text.info")
        .data([d])
        .enter()
        .append("text")
        .attr("class", "info")
        .attr("x", d => {return x(d.Anio)+70;})
        .attr("y", d => y(+d.Valor)+10) 
        .text(d.Departamento+": "+d.Valor + " Millones");
    });
    
    svg
    .append("circle")
    .attr("r", 5)
    .attr("cx", 300)
    .attr("cy", 600)
    .attr("fill",d=> z("Pequenos Productores"));
    svg
    .append("circle")
    .attr("r", 5)
    .attr("cx", 500)
    .attr("cy", 600)
    .attr("fill",d=> z("Grandes Productores"));
    svg.append("text")
        .attr("x", 307)
        .attr("y", 605) 
        .text("Pequenos Productores");
        svg.append("text")
        .attr("x", 507)
        .attr("y", 605) 
        .text("Grandes Productores");
  segundaGraica(datos);
});