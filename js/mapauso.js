var dojoConfig = { isDebug: true };
require([
    "esri/WebMap",
    "esri/views/MapView",
    "esri/widgets/LayerList"
  ], function(
    WebMap, MapView, LayerList
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



  });