

{/* let mapToken.ace=mapToken;
    console.log(mapToken); */}
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

//console.log(listing.geometry.coordinates);

// Create custom HTML element
const el = document.createElement('div');
el.className = 'custom-marker';



const marker = new mapboxgl.Marker(el, { anchor: "bottom" })
    .setLngLat(listing.geometry.coordinates)// listing.geometry.coordinates
    .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML(`<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`))
    .addTo(map);
