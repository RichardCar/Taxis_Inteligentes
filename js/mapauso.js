var serviceTaxisOrigen = "https://services.arcgis.com/8DAUcrpQcpyLMznu/arcgis/rest/services/taxisInteligentes/FeatureServer/1",
  serviceTaxisDestination = "https://services.arcgis.com/8DAUcrpQcpyLMznu/arcgis/rest/services/taxisInteligentes/FeatureServer/0";
var dojoConfig = {
  isDebug: true
};
require([
  "esri/WebMap",
  "esri/views/MapView",
  "esri/widgets/LayerList",
  "esri/layers/FeatureLayer",
  "esri/renderers/Renderer"
], function (
  WebMap, MapView, LayerList, FeatureLayer,Renderer
) {

  const map = new WebMap({
    portalItem: {
      id: "969976048a874f41bcdb9ad93f0713f0"
    }
  });

  const view = new MapView({
    container: "mapauso",
    map: map
  });
  const symbolOrigin = {
    type: "picture-marker", 
    url: "img/6.png",
    width: "16px",
    height: "16px"
  };
  const symbolDestination = {
    type: "picture-marker", 
    url: "img/3.png",
    width: "32px",
    height: "32px"
  };
  const layerDestination = new FeatureLayer({
    url: serviceTaxisDestination,
    visible: false,
    renderer: {type:"simple",symbol:symbolDestination}
  });
  const layerOrigin = new FeatureLayer({
    url: serviceTaxisOrigen,
    visible: false,
    renderer: {type:"simple",symbol:symbolOrigin}
  });

  document.getElementById("selDepto").onchange = (d) => {
    let _select = document.getElementById("selDepto").item(document.getElementById("selDepto").selectedIndex).text;
    //alert(_select)
    layerDestination.definitionExpression = "LOCALIDAD1 = '" + _select + "'";
    layerOrigin.definitionExpression = "LOCALIDAD1 = '" + _select + "'";
    layerDestination.visible = true;
    layerOrigin.visible = true;
  };
  map.add(layerDestination, 1);
  map.add(layerOrigin, 2);

});