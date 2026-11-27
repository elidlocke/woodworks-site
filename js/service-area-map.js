// Service area map: MapLibre GL + OpenFreeMap tiles (free, no API key).
(function () {
  "use strict";

  var el = document.getElementById("map");
  if (!el || typeof maplibregl === "undefined") return;

  var CENTER = [-80.48, 43.45]; // [lng, lat] Kitchener-Waterloo
  var RADIUS_KM = 22;
  var COLOR = "rgb(222,184,135)";

  // Approximate a circle of RADIUS_KM around CENTER as a GeoJSON polygon.
  function circlePolygon(center, radiusKm, steps) {
    var coords = [];
    var lat = (center[1] * Math.PI) / 180;
    var dLat = radiusKm / 111.32;
    var dLng = radiusKm / (111.32 * Math.cos(lat));
    for (var i = 0; i <= steps; i++) {
      var t = (i / steps) * 2 * Math.PI;
      coords.push([center[0] + dLng * Math.cos(t), center[1] + dLat * Math.sin(t)]);
    }
    return {
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [coords] }
    };
  }

  var map = new maplibregl.Map({
    container: el,
    style: "https://tiles.openfreemap.org/styles/positron",
    center: CENTER,
    zoom: 7.9,
    attributionControl: { compact: true },
    scrollZoom: false,
    dragRotate: false,
    pitchWithRotate: false
  });

  map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
  map.touchZoomRotate.disableRotation();

  map.on("load", function () {
    map.addSource("service-area", {
      type: "geojson",
      data: circlePolygon(CENTER, RADIUS_KM, 96)
    });
    map.addLayer({
      id: "service-area-fill",
      type: "fill",
      source: "service-area",
      paint: { "fill-color": COLOR, "fill-opacity": 0.35 }
    });
    map.addLayer({
      id: "service-area-outline",
      type: "line",
      source: "service-area",
      paint: { "line-color": COLOR, "line-opacity": 0.8, "line-width": 2 }
    });

    // The basemap hides Waterloo's label at this zoom (it collides with
    // Kitchener's), so draw it ourselves, to the left of "Kitchener".
    map.addSource("waterloo-label", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: { name: "Waterloo" },
        geometry: { type: "Point", coordinates: [-80.5204, 43.4643] }
      }
    });
    map.addLayer({
      id: "waterloo-label",
      type: "symbol",
      source: "waterloo-label",
      maxzoom: 9.5, // the basemap shows its own Waterloo label past this
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Noto Sans Regular"],
        "text-size": 13,
        "text-anchor": "bottom-right",
        "text-offset": [-1.75, 0.15],
        "text-allow-overlap": true,
        "text-ignore-placement": true
      },
      paint: {
        "text-color": "#000",
        "text-halo-color": "#fff",
        "text-halo-width": 1,
        "text-halo-blur": 1
      }
    });
  });
})();
