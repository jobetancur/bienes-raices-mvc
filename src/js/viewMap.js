(function() {
    let lat = document.querySelector('#lat').textContent;
    let lng = document.querySelector('#lng').textContent;
    let street = document.querySelector('#street').textContent;
    let map = L.map('map').setView([lat, lng], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    market = new L.marker([lat, lng], {
        draggable: false, // Permite arrastrar el pin.
        autoPan: false, // Mueve el mapa cuando se arrastra el pin.
    }).addTo(map).bindPopup(street).openPopup();

}) ()