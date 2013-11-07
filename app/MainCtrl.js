(function() {
    'use strict';

    var app = angular.module('jo-map');

    app.controller('MainCtrl', ['MapService',
        function(MapService) {
            var vm = this;

            vm.places = [
                {id:1, address: '10000 Perkins Rowe Ave, Baton Rouge, LA', name: "Envoc (My Office)", logo: 'http://dl.dropboxusercontent.com/u/2857953/img/logo.png'},
                {id:2, address: '15961 Airline Hwy, Baton Rouge, LA', name: "MMR", logo: 'http://placehold.it/380x380'},
                {id:3, address: '302 Pinoak Street, Denham Springs, LA', name: "Where I grew up", logo: 'http://placehold.it/380x380'}
            ];

            vm.addPlace = function(){
                var place = {
                    id: vm.places.length +1,
                    name: vm.newPlaceName,
                    address: vm.newPlaceAddress
                };

                var address = place.address;
                MapService.geocodeAddress(address).then(function (location) {
                    var geocodedPlace = [location, place];
                    plotLocation([geocodedPlace]);
                    MapService.panTo(location);
                });

                vm.places.push(place);
            }

            vm.showPlace = function(place){
                MapService.openMarkerInfo(function(marker){
                    return marker.model.id == place.id;
                })
            }

            activate();

            function activate() {
                vm.data = "Some Data";
                
                var mapOptions = {
                    zoom: 8,
                    center: MapService.convertToGoogleLatLng(30.349978, -90.99710700000003),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                MapService.initMap('map_canvas',mapOptions);

                angular.forEach(vm.places, function (place) {
                    var address = place.address;
                    MapService.geocodeAddress(address).then(function (location) {
                        var geocodedPlace = [location, place];
                        plotLocation([geocodedPlace]);
                    });
                });
            }

            function plotLocation(placeWithLocationArray) {
                var infoboxTemplate = 'app/partials/infobox.html';

                MapService.plotPoints(placeWithLocationArray, {
                    clearPrevious: false,
                    infoBoxTemplate: infoboxTemplate
                });
            }
        }
    ]);

})();
