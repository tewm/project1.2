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
    
    // Add landmark info to sidebar
    var listItem = document.createElement("li");
    listItem.innerHTML = `<b>${landmark.name}</b>: ${landmark.description}`;
    document.getElementById("tour-list").appendChild(listItem);
});

// Load GeoJSON data
fetch('megantew/project1/london-boroughs_1179.json') // Replace with your actual GeoJSON file path
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
    .catch(error => console.error('Error loading GeoJSON:', error));

// Download latest version using fetch API
fetch('https://www.kaggle.com/api/v1/datasets/download/jonbown/london-tube-station-usage')
    .then(response => response.blob())
    .then(blob => {
        var url = URL.createObjectURL(blob);
        console.log("Path to dataset files:", url);
    })
    .catch(error => console.error('Error downloading dataset:', error));

// Walking route (Polyline)
var route = L.polyline([
    [51.5007, -0.1246], // Big Ben
    [51.5014, -0.1419], // Buckingham Palace
    [51.5033, -0.1195], // London Eye
    [51.5081, -0.0759]  // Tower of London
], { color: 'blue', weight: 4 });

// Toggle route visibility
var routeVisible = true;
function toggleRoute() {
    if (routeVisible) {
        map.removeLayer(route);
    } else {
        route.addTo(map);
    }
    routeVisible = !routeVisible;
}



