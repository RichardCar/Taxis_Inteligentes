var segundaGraica = (datos) => {

    var datosDepto;
    document.getElementById("selDepto").onchange = (d) => {

        let _select = document.getElementById("selDepto").item(document.getElementById("selDepto").selectedIndex).text;
        d3.selectAll(".rectangulo").remove();
        this.cambiarDataSet(_select);
    };

    var svg2 = d3
        .select(".grafico2")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    var g = svg2.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand().range([0, width]),
        y = d3.scaleLinear().range([height, 0]),
        z = d3.scaleOrdinal(d3.schemeDark2);
    x.domain(datos
        .map(d => d.Anio)
        .filter((v, i, a) => a.indexOf(v) === i));
    y.domain([(d3.min(datos, d => d.Valor)), d3.max(datos, d => d.Valor)]).nice();

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
    let firstSelect = document.getElementById("selDepto").item(1).text;

    this.cambiarDataSet = (departamento) => {
        datosDepto = datos.filter(d => d.Departamento == departamento);
        console.log(datosDepto);
        console.log("altura" + height);
        console.log("altura svg"+(height + margin.top + margin.bottom));
        g
            .selectAll(".dot1")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + 0+ ")")
            .data(datosDepto)
            .enter()
            .append("rect")
            .attr("class","rectangulo")
            .attr("x", (d) => {return x(d.Anio)+ margin.left;})
            .attr("y", (d) => y(d.Valor))
            .attr("width", 20)
            .attr("height", (d) => {
                return height- y(d.Valor);
            })
            .attr("fill", (d) => z(d.Tproductor));

     

    }
    this.cambiarDataSet(firstSelect);


}
