document.addEventListener("DOMContentLoaded", function() {
    // Initialize the map
    var map = L.map('map').setView([51.5074, -0.1278], 13); // Centered around London, England

    // Add OpenStreetMap basemap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add Compass Control
    L.control.compass({ position: "top-left" }).addTo(map);

    // Add Scale Control
    L.control.scale({ position: "bottom-right" }).addTo(map);

    // Add Legend Control
    var legend = L.control({ position: "bottom-right" });

    function createLegend(map) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<b>Legend</b><br>";
        div.innerHTML += "<i style='background:blue'></i> Walking Route<br>";
        div.innerHTML += "<i style='background:red'></i> Landmarks<br>";
        return div;
    }

    legend.onAdd = createLegend;
    legend.addTo(map);

    // Example landmarks (markers with popups)
    var landmarks = [
        { name: "Big Ben", coords: [51.5007, -0.1246], description: "Renowned clock tower in London." },
        { name: "Tower of London", coords: [51.5081, -0.0759], description: "Historic castle and former prison." },
        { name: "Buckingham Palace", coords: [51.5014, -0.1419], description: "The official residence of the British monarch." },
        { name: "London Eye", coords: [51.5033, -0.1195], description: "Famous Ferris wheel on the South Bank of the River Thames." }
    ];

    landmarks.forEach(function(landmark) {
        L.marker(landmark.coords).addTo(map)
            .bindPopup(`<b>${landmark.name}</b><br>${landmark.description}`);
    });

    // Load GeoJSON data
    fetch('path/to/london-boroughs_1179.geojson') // Update with correct path
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                style: function (feature) {
                    return { color: 'red', weight: 2 }; // Customize appearance
                },
                onEachFeature: function (feature, layer) {
                    if (feature.properties && feature.properties.name) {
                        layer.bindPopup(`<b>${feature.properties.name}</b>`);
                    }
                }
            }).addTo(map);
        })
        .catch(error => {
            console.error('Error loading GeoJSON:', error);
            alert('There was an issue loading the map data. Please try again later.');
        });

    // Walking route (Polyline)
    var route = L.polyline([
        [51.5007, -0.1246], // Big Ben
        [51.5014, -0.1419], // Buckingham Palace
        [51.5033, -0.1195], // London Eye
        [51.5081, -0.0759]  // Tower of London
    ], { color: 'blue', weight: 4 });
    route.addTo(map);

    // Toggle route visibility
    var routeVisible = true;
    document.getElementById("toggle-route").addEventListener("click", function() {
        if (routeVisible) {
            map.removeLayer(route);
        } else {
            route.addTo(map);
        }
        routeVisible = !routeVisible;
    });

    // Add landmarks to the sidebar list
    var tourList = document.getElementById("tour-list");
    if (tourList) {
        landmarks.forEach(function(landmark) {
            var listItem = document.createElement("li");
            listItem.innerHTML = `<a href="#" onclick="zoomToLandmark(${landmark.coords[0]}, ${landmark.coords[1]})">${landmark.name}</a>`;
            tourList.appendChild(listItem);
        });
    } else {
        console.error('tour-list element not found!');
    }

    function zoomToLandmark(lat, lng) {
        map.setView([lat, lng], 15); // Zoom in to the selected landmark
    }

});
