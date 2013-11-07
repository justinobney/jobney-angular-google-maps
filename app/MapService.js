(function() {
    'use strict';

    var app = angular.module('jo-map');

    app.service('MapService', ['$q', '$http', '$templateCache', '$interpolate',
        function($q, $http, $templateCache, $interpolate) {
            var service = {};

            var geocoder;
            var map;
            var myMarkers = [];
            var google = window.google;
            var geoCache = {};

            service.openMarkerInfo = function(fnFindMarker) {
                if (!myMarkers.length)
                    return;

                var currentMarker = myMarkers.filter(function(marker) {
                    return fnFindMarker(marker);
                });

                if(currentMarker.length == 0)
                    return;

                service.closeInfoWindows();
                service.panTo(currentMarker[0].getPosition());
                currentMarker[0].InfoBox.open(map, currentMarker[0]);
            };

            service.panTo = function(latLng){
                map.panTo(latLng);
            };

            service.plotPoints = function(points, options) {
                if (options.clearPrevious)
                    service.clearMap();

                angular.forEach(points, function(value) {
                    var marker = service.createGenericMarker(value[0], null, google.maps.Animation.DROP);

                    if (options.infoBoxTemplate && value[1])
                        createInfoBox(marker, options.infoBoxTemplate, value[1]);

                    myMarkers.push(marker);
                });
            };

            service.clearMap = function() {
                service.closeInfoWindows();
                angular.forEach(myMarkers, function(marker, key) {
                    marker.setMap(null);
                });
                myMarkers = [];
            };

            service.closeInfoWindows = function() {
                angular.forEach(myMarkers, function(marker, key) {
                    if (marker.InfoBox)
                        marker.InfoBox.close();
                });
            };

            service.convertToGoogleLatLng = function(lat, lng) {
                return new google.maps.LatLng(lat, lng);
            }

            service.createGenericMarker = function(googleLatLng, icon, animation) {
                var optMap = {
                    map: map,
                    position: googleLatLng
                };
                if (icon)
                    optMap.icon = icon;

                if (animation)
                    optMap.animation = animation;

                var marker = new google.maps.Marker(optMap);

                return marker;
            };

            service.geocodeAddress = function(address) {
                var deferred = $q.defer();

                if (geoCache[address]) {
                    deferred.resolve(geoCache[address]);
                }
                else {
                    if (angular.isUndefined(geocoder)) {
                        geocoder = new google.maps.Geocoder();
                    }

                    geocoder.geocode({
                        'address': address
                    }, geocodeCallback);
                }

                function geocodeCallback(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
                            if (results && results[0] && results[0].geometry && results[0].geometry.viewport) {
                                geoCache[address] = results[0].geometry.location;
                                deferred.resolve(geoCache[address]);
                            }
                        }
                        else {
                            deferred.reject("No results found");
                        }
                    }
                    else {
                        deferred.reject("Geocode was not successful for the following reason: " + status);
                    }
                };

                return deferred.promise;
            };

            service.createPolygon = function(points) {
                var invisColor = "#000000";
                var outlineColor = "#0ABA02";

                points = points.map(function(latLong) {
                    return new google.maps.LatLng(latLong[0], latLong[1]);
                }); // Construct the polygon
                var polygon = new google.maps.Polygon({
                    paths: points,
                    strokeColor: outlineColor,
                    strokeOpacity: 1,
                    strokeWeight: 2,
                    fillColor: invisColor,
                    fillOpacity: 0.1
                });

                polygon.setMap(map);
            };

            service.initMap = function(mapId, options) {
                map = new google.maps.Map(document.getElementById(mapId), options);
            }

            function createInfoBox(marker, infoBoxTemplate, model) {

                $http.get(infoBoxTemplate, {
                    cache: $templateCache
                }).success(function(tplContent) {
                    var compiledTemplate = $interpolate(tplContent)(model);

                    var myOptions = {
                        content: compiledTemplate,
                        disableAutoPan: false,
                        maxWidth: 0,
                        pixelOffset: new google.maps.Size(-140, 0),
                        zIndex: null,
                        boxStyle: {
                            width: "280px"
                        },
                        closeBoxMargin: "5px 5px 5px 0",
                        closeBoxURL: "http://cdn1.iconfinder.com/data/icons/mimiGlyphs/16/close_delete.png",
                        infoBoxClearance: new google.maps.Size(1, 1),
                        isHidden: false,
                        pane: "floatPane",
                        enableEventPropagation: false
                    };
                    // end example code for custom infobox
                    var ib = new InfoBox(myOptions);

                    marker.InfoBox = ib;

                    marker.model = model;

                    google.maps.event.addListener(marker, "click", function(e) {
                        service.closeInfoWindows();
                        ib.open(map, this);
                    });
                });
            }


            return service;
        }
    ]);
})();
