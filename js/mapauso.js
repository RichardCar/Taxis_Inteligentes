var serviceTaxisOrigen = "https://services.arcgis.com/8DAUcrpQcpyLMznu/arcgis/rest/services/taxisInteligentes/FeatureServer/1",
  serviceTaxisDestination = "https://services.arcgis.com/8DAUcrpQcpyLMznu/arcgis/rest/services/taxisInteligentes/FeatureServer/0";
var dojoConfig = {
  isDebug: true
};
var map,layerDestination,layerOrigin;
require([
  "esri/WebMap",
  "esri/views/MapView",
  "esri/widgets/LayerList",
  "esri/layers/FeatureLayer",
  "esri/renderers/Renderer",
  "esri/core/watchUtils"
], function (
  WebMap, MapView, LayerList, FeatureLayer,Renderer,watchUtils
) {

  map = new WebMap({
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
   layerDestination = new FeatureLayer({
    url: serviceTaxisDestination,
    visible: false
    
  });
   layerOrigin = new FeatureLayer({
    url: serviceTaxisOrigen,
    visible: false
  });

  map.add(layerDestination, 1);
  map.add(layerOrigin, 2);
  const layerList = new LayerList({
    view: view,
    listItemCreatedFunction: function(event) {
      const item = event.item;
      if (item.layer.type != "group") { // don't show legend twice
        item.panel = {
          content: "legend",
          open: false
        };
      }
    }
  });
  view.ui.add(layerList, "top-right");
  view.watch("scale", function(newValue) {
    // layer.renderer = newValue <= 72224 ? simpleRenderer :
    //   heatmapRenderer;
    if(newValue>20000){
      console.log("estamos head")
      layerDestination.renderer = {
        type: "heatmap",
        colorStops: [
          { ratio: 0, color: "rgba(255, 255, 255, 0)" },
          { ratio: 0.2, color: "rgba(255, 255, 255, 1)" },
          { ratio: 0.5, color: "rgba(255, 140, 0, 1)" },
          { ratio: 0.8, color: "rgba(255, 140, 0, 1)" },
          { ratio: 1, color: "rgba(255, 0, 0, 1)" }
        ],
        minPixelIntensity: 10,
        maxPixelIntensity: 100
      };
      layerOrigin.renderer = {
        type: "heatmap", 
        colorStops: [
          { ratio: 0, color: "rgba(173, 235, 173, 0)" },
          { ratio: 0.2, color: "rgba(132, 225, 132, .4)" },
          { ratio: 0.5, color: "rgba(70, 210, 70, .4)" },
          { ratio: 0.8, color: "rgba(45, 185, 45, .4)" },
          { ratio: 1, color: "rgba(25, 103, 25, .4)" }
        ],
        minPixelIntensity: 10,
        maxPixelIntensity: 100
      };
    }
    else{
      console.log("estamos puntos")
      layerDestination.renderer = {
        type:"simple",symbol:symbolDestination
      }
      layerOrigin.renderer = {
        type:"simple",symbol:symbolOrigin
      }
    }
  });


});

var cambioMapa = (localidad)=>{
  document.getElementById("selectLocalidad").innerHTML = "Localidad Seleccionada: " + localidad;

  console.log(localidad + "el id del mapa es: "+map.id)
  layerDestination.definitionExpression = "LOCALIDAD1 = '" + localidad + "'";
  layerOrigin.definitionExpression = "LOCALIDAD1 = '" + localidad + "'";
  layerDestination.visible = true;
  layerOrigin.visible = true;
}