d3.select(".div.vega-actions-wrapper").remove();
var wh = d3.select("#lines").node().getBoundingClientRect().width-80;
var lines = {
  "data": {"url": "data/actividad.csv"},
  "mark": {"type":"line", "point":{"color":"black"}},
  "width": wh,
  "height": wh,
  "encoding": {
    "x": {"field": "h", "type": "quantitative", "axis": {"title": "Hora (24 horas)"}},
    "y": {"aggregate":"count","field": "estado", "type": "quantitative", "axis": {"title": "Estado (cantidad)"}},
    "color": {"field": "estado","type": "nominal"}
  },
}

vegaEmbed("#lines", lines);