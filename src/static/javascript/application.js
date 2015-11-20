const MAPBOX_TOKEN = 'pk.eyJ1IjoiaHl3YW4iLCJhIjoiY2loNmdzM2J6MGJ0YXU3bHg3dXRpZnVxciJ9.RJgHGOG1Btr9aLyoHoyVSQ';
const MAPZEN_API_KEY = 'vector-tiles-JfcnLuk';


function Map (id)
{
    mapboxgl.accessToken = MAPBOX_TOKEN;

    var map = new mapboxgl.Map({
        container: id,
        style: 'mapbox://styles/hywan/cih7cb25l001kbkkop9xdggad',
        center: [-74.50, 40],
        zoom: 9
    });

    map.addControl(new mapboxgl.Navigation());

    return map;
}

document.addEventListener(
    'readystatechange',
    function () {
        if ('complete' !== document.readyState) {
            return;
        }

        var map = Map('map');
    }
);
