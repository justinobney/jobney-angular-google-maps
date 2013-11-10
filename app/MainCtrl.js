(function() {
    'use strict';

    var app = angular.module('jo-map');

    app.controller('MainCtrl', ['MapService',
        function(MapService) {
            var vm = this;

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

                vm.newPlaceName = "";
                vm.newPlaceAddress = "";
            }

            vm.showPlace = function(place){
                MapService.openMarkerInfo(function(marker){
                    return marker.model.id == place.id;
                })
            }

            activate();

            function activate() {
                fakeDataAndState();
                
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
                MapService.plotPoints(placeWithLocationArray, {
                    clearPrevious: false,
                    infoBoxTemplate: vm.selectedTemplate
                });
            }

            function fakeDataAndState(){
                vm.newPlaceName = "The White House";
                vm.newPlaceAddress = "1600 Pennsylvania Ave NW, Washington";

                vm.places = [
                    {id:1, address: '10000 Perkins Rowe Ave, Baton Rouge, LA', name: "Envoc (My Office)", logo: 'http://dl.dropboxusercontent.com/u/2857953/img/logo.png'},
                    {id:2, address: '15961 Airline Hwy, Baton Rouge, LA', name: "MMR", logo: 'http://placehold.it/380x380'},
                    {id:3, address: '302 Pinoak Street, Denham Springs, LA', name: "Where I grew up", logo: 'http://placehold.it/380x380'}
                ];

                vm.availableTemplates = [
                    'app/partials/infobox.html',
                    'app/partials/infobox2.html'
                ];

                vm.selectedTemplate = vm.availableTemplates[1];
            }
        }
    ]);

})();
