 
        mapboxgl.accessToken = mapToken;

        const map = new mapboxgl.Map({
            container: "map",
            style: "mapbox://styles/mapbox/streets-v12",
            center: listing.geometry.coordinates,
            zoom: 9
        });
         const marker1 = new mapboxgl.Marker( { color: "red" })
        .setLngLat(listing.geometry.coordinates)
        .setPopup( new mapboxgl.Popup({offset: popupOffsets, className: 'my-class'})
    .setHTML('<h4>listing.location </h4><p>Exact location will be provided after booking')
    
    .addTo(map));
    
