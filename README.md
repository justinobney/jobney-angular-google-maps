jobney-angular-google-maps
==========================

This is the Angular Google Map service I have come up with. It works well for me. Uses InfoBox.js for 
custom map info windows.

Simple Info:
* AngularJS
* Google Maps API - V3
* Infobox.js for custom info windows
* Uses interpolation to allow for custom per marker templates and data-binding (WIN)

Usage:

Plotting some points with a specific databound infowindow on the map
```javascript
var infoboxTemplate = 'app/partials/infobox.html'; // for databinding a map infobox

var model = {id:1, name: 'Title'};
var location: new google.maps.LatLng(30.987, -91.345);

var arrayOfLocationsWithModels = [
    [location, model]
]

MapService.plotPoints(placeWithLocationArray, {
    clearPrevious: false,
    infoBoxTemplate: infoboxTemplate
});
```

DEMO: http://code.justinobney.com/sandbox/jobney-ng-maps/

Demo TODO:
* Implement a template switcher
