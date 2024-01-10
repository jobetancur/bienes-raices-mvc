(function() {
    const lat = document.querySelector('#lat').value || 6.2363764;
    const lng = document.querySelector('#lng').value || -75.5946371;
    const map = L.map('map').setView([lat, lng ], 12);
    let market;

    // Leer el nombre de la calle
    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // pin
    market = new L.marker([lat, lng], {
        draggable: true, // Permite arrastrar el pin.
        autoPan: true // Mueve el mapa cuando se arrastra el pin.
    }).addTo(map); // Agrega el pin al mapa.

    // Leer coordenadas del pin
    market.on('moveend', function(e) {
        market = e.target;
        const position = market.getLatLng();
        console.log(position);
        map.panTo(new L.LatLng(position.lat, position.lng));
        // Reverse Geocoding, cuando el usuario reubica el pin.

        geocodeService.reverse().latlng(position, 13).run(function(error, result) {
            // console.log(result);
            market.bindPopup(result.address.LongLabel); // Muestra la dirección en el pin.
            market.openPopup(); // Abre el popup.
            // fillInputs(result);

            // Llenar los inputs
            document.querySelector('.street').textContent = result.address.Address || '';
            document.querySelector('#street').value = result.address.Address || '';
            document.querySelector('#lat').value = result.latlng.lat || '';
            document.querySelector('#lng').value = result.latlng.lng || '';
        });


    });

    

})()