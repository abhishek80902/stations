var map = L.map('map').setView([28.6139, 77.2090], 13);

// Tile layer from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Fetch user's current location
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Update map to center on user's current position
function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Set the map view to user's current location
    map.setView([latitude, longitude], 13);

    // Add a marker for the current location
    L.marker([latitude, longitude]).addTo(map)
        .bindPopup("You are here")
        .openPopup();
}

// Error handling for geolocation
function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

// Fetch available stations from the backend
fetch('/api/stations')
    .then(response => response.json())
    .then(data => {
        data.forEach(station => {
            L.marker([station.latitude, station.longitude]).addTo(map)
                .bindPopup(`${station.name} <br> Available Spots: ${station.availableSpots}`)
                .openPopup();
        });
    })
    .catch(error => console.error('Error fetching stations:', error));

// Close dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.account-btn')) {
        var dropdowns = document.getElementsByClassName("account-dropdown");
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.style.display === "block") {
                openDropdown.style.display = "none";
            }
        }
    }
};

// Function to plan a route and display number of EV stations on the route
function planRoute() {
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;

    let evStations = 0;

    // Clear the button container each time route planning is initiated
    const buttonContainer = document.getElementById("button-container");
    buttonContainer.innerHTML = ''; // Clear any previous buttons

    if (start && end) {
        // Handle specific routes and set the number of EV stations
        if (start === 'Delhi' && end === 'Jaipur') {
            evStations = 3;
        } else if (start === 'Jaipur' && end === 'Delhi') {
            evStations = 3;
        } else if (start === 'Delhi' && end === 'Mumbai') {
            evStations = 4;
        } else if (start === 'Mumbai' && end === 'Delhi') {
            evStations = 4;
        } else if (start === 'Delhi' && end === 'Chandigarh') {
            evStations = 2;
        } else if (start === 'Mumbai' && end === 'Jaipur') {
            evStations = 5;
        } else if (start === 'Jaipur' && end === 'Mumbai') {
            evStations = 5;
        } else if (start === 'Delhi' && end === 'Gurugram') {
            evStations = 1;
        } else {
            alert(`Currently no EV stations found on your route`);
            return; // Exit if no EV stations are found on the route
        }

        alert(`Your Route is planned Sucessfully ! There are ${evStations} EV stations between ${start} and ${end}.`);

        // Add the "Prebook Your Slot" button dynamically only if EV stations are found
        const prebookButton = document.createElement("button");
        prebookButton.innerHTML = "Prebook Your Slot";
        prebookButton.style.backgroundColor = "green";
        prebookButton.style.color = "white";
        prebookButton.style.padding = "10px";
        prebookButton.style.border = "none";
        prebookButton.style.cursor = "pointer";
        prebookButton.style.fontSize = "16px";

        // Change color on hover
        prebookButton.addEventListener("mouseover", function() {
            prebookButton.style.backgroundColor = "red";
        });
        prebookButton.addEventListener("mouseout", function() {
            prebookButton.style.backgroundColor = "green";
        });

        // Click event to show booking confirmation
        prebookButton.addEventListener("click", function() {
            alert("Great Your nearest slot is booked! You can also select the charger type");
        });

        // Append the button to the container
        buttonContainer.appendChild(prebookButton);

    } else {
        alert("Please enter both start and end locations.");
    }
}

// Automatically fetch and set the current location when the page loads
window.onload = function() {
    getCurrentLocation();
};