const confirmPin = document.getElementById('confirmPin');
let map;
let markerArray = [];

function initMap() {
    confirmPin.disabled = true;
    let myLatLng;
    let zoomVal;

    switch (mode) {
        case "lugaya":
            myLatLng = { lat: 24.79360866539293, lng: 42.63691120388848 };
            zoomVal = 3;
            break;
        case "zart":
            myLatLng = { lat: 46.37166748852439, lng: 14.916301179034187 };
            zoomVal = 3;
            break;
        case "dumenden":
            myLatLng = { lat: 45.99077953053835, lng: -105.33510075773074 };
            zoomVal = 2;
            break;
        case "laga":
            myLatLng = { lat: -23.18894341606518, lng: -58.82929816801125 };
            zoomVal = 2;
            break;
        case "saksuka":
            myLatLng = { lat: -24.15487320484811, lng: 134.5638389324763 };
            zoomVal = 2;
            break;
        case "rastgele":
            myLatLng = { lat: 46.37166748852439, lng: 14.916301179034187 };
            zoomVal = 8;
            break;
        case "dalgadan":
            myLatLng = { lat: 29.55320816750227, lng: -4.750033235036346 };
            zoomVal = 1;
            break;
        case "zorttri":
            myLatLng = { lat: 26.292966327268765, lng: 105.95316428653376 };
            zoomVal = 2;
            break;
        case "sakada":
            myLatLng = { lat: 0.04401599461441711, lng: 25.383148861553586 };
            zoomVal = 2;
            break;
        default:
            myLatLng = { lat: 0, lng: 0 };
            zoomVal = 2;
    }

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: zoomVal,
        center: myLatLng,
        mapTypeControl: false,
        zoomControl: false,
        gorselVControl: false,
        keyboardShortcuts: false,
        width: '100%',
        height: '500px'
    });

    map.addListener("click", (mapsMouseEvent) => {
        confirmPin.disabled = false;
        deleteMarkers();
        const latLng = mapsMouseEvent.latLng.toJSON();
        addMarker(latLng.lat, latLng.lng, "images/kırmızıiğne.png");
        document.getElementById("latitude").value = latLng.lat;
        document.getElementById("longitude").value = latLng.lng;
    });
}

function addMarker(lat, lng, icon) {
    const marker = new google.maps.Marker({
        map,
        position: { lat, lng },
        icon: icon,
    });
    markerArray.push(marker);
}

function deleteMarkers() {
    for (let i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
    }
    markerArray = [];
}

let distance;
function calcDistance(lat1, lat2, lon1, lon2) {
    lon1 = lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;

    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
        + Math.cos(lat1) * Math.cos(lat2)
        * Math.pow(Math.sin(dlon / 2), 2);

    let c = 2 * Math.asin(Math.sqrt(a));
    let r = 6371;
    distance = c * r;
}

confirmPin.addEventListener('click', () => {
    const originLat = parseFloat(document.getElementById("latitude").value);
    const originLng = parseFloat(document.getElementById("longitude").value);
    const destLat = parseFloat(document.getElementById("destLat").value);
    const destLng = parseFloat(document.getElementById("destLong").value);

    map.setCenter({ lat: (originLat + destLat) / 2, lng: (originLng + destLng) / 2 });
    map.setZoom(3);

    const lineSymbol = {
        path: "M 0,-1 0,1",
        strokeOpacity: 1,
        scale: 3,
    };

    const line = new google.maps.Polyline({
        path: [
            { lat: originLat, lng: originLng },
            { lat: destLat, lng: destLng },
        ],
        strokeOpacity: 0,
        icons: [
            {
                icon: lineSymbol,
                offset: "0",
                repeat: "20px",
            },
        ],
        map: map,
    });

    calcDistance(originLat, destLat, originLng, destLng);
    document.getElementById("distance").innerText = Math.round(distance).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    deleteMarkers();

    addMarker(originLat, originLng, "images/kırmızıiğne.png");
    addMarker(destLat, destLng, "images/yeşiliğne.png");
});