jobney-angular-google-maps
==========================

This is the Angular Google Map service I have come up with. It works well for me. Uses InfoBox.js for 
custom map info windows.

*Simple Info:*
* AngularJS
* Google Maps API - V3
* Infobox.js for custom info windows
* Uses interpolation to allow for custom per marker templates and data-binding (WIN)

*Usage:*

Plotting some points with a specific databound infowindow on the map
```javascript
var infoboxTemplate = 'app/partials/infobox.html'; // for databinding a map infobox

var model = {id:1, name: 'Title'};
var location: new google.maps.LatLng(30.987, -91.345);

var arrayOfLocationsWithModels = [
    [location, model]
]

MapService.plotPoints(arrayOfLocationsWithModels, {
    clearPrevious: false,
    infoBoxTemplate: infoboxTemplate
});
```

Opening an info window
```javascript
// have a reference to the model attached to the marker
var place = {id:5, props:'..'}

// The mapservice keeps a list of all markers shown on the map.
// openMarkerInfo takes a compare function that will be given each
// marker to compare against. The first true result will be the marker used.
MapService.openMarkerInfo(function(marker){
    return marker.model.id == place.id;
})
```
DEMO: http://code.justinobney.com/sandbox/jobney-ng-maps/

Demo TODO:
- [ ] Implement a template switcher
