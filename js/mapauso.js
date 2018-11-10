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
        id: "d5dda743788a4b0688fe48f43ae7beb9"
      }
    });

    const view = new MapView({
      container: "mapauso",
      map: map
    });

    const layerList = new LayerList({
      view: view,
      listItemCreatedFunction: function(event) {
        const item = event.item;
        if (item.layer.type != "group") { 
          item.panel = {
            content: "legend",
            open: true
          };
        }
      }
    });
    view.ui.add(layerList, "top-right");

  });