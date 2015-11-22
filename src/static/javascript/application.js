const MAPBOX_TOKEN          = 'pk.eyJ1IjoiaHl3YW4iLCJhIjoiY2loNmdzM2J6MGJ0YXU3bHg3dXRpZnVxciJ9.RJgHGOG1Btr9aLyoHoyVSQ';
const MAPZEN_TILES_API_KEY  = 'vector-tiles-JfcnLuk';
const MAPZEN_SEARCH_API_KEY = 'search--conohY';

var model = {
    from: '',
    autocompleted: []
};

function Map(id)
{
    mapboxgl.accessToken = MAPBOX_TOKEN;

    var style = {
        'version': 8,
        'sources': {
            'osm': {
                'type': 'vector',
                'tiles': [
                    'https://vector.mapzen.com/osm/all/{z}/{x}/{y}.mvt?api_key=' + MAPZEN_TILES_API_KEY
                ]
            }
        },
        'glyphs': 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
        'layers': [
            {
                'id': 'background',
                'type': 'background',
                'paint': {
                    'background-color': '#ededed'
                }
            },
            {
                'id': 'water-line',
                'type': 'line',
                'source': 'osm',
                'source-layer': 'water',
                'filter': [
                    '==',
                    '$type',
                    'LineString'
                ],
                'paint': {
                    'line-color': '#7acad0',
                    'line-width': {
                        'base': 1.2,
                        'stops': [
                            [
                                8,
                                0.5
                            ],
                            [
                                20,
                                15
                            ]
                        ]
                    }
                }
            },
            {
                'id': 'water-polygon',
                'type': 'fill',
                'source': 'osm',
                'source-layer': 'water',
                'filter': [
                    '==',
                    '$type',
                    'Polygon'
                ],
                'paint': {
                    'fill-color': '#7acad0'
                }
            },
            {
                'id': 'park',
                'type': 'fill',
                'source': 'osm',
                'source-layer': 'landuse',
                'filter': [
                    'in',
                    'kind',
                    'park',
                    'forest',
                    'garden',
                    'grass',
                    'farm',
                    'meadow',
                    'playground',
                    'golf_course',
                    'nature_reserve',
                    'wetland',
                    'wood',
                    'cemetery'
                ],
                'paint': {
                    'fill-color': '#c2cd44'
                },
                'min-zoom': 6
            },
            {
                'id': 'river',
                'type': 'line',
                'source': 'osm',
                'source-layer': 'water',
                'filter': [
                    'all',
                    [
                        '==',
                        '$type',
                        'LineString'
                    ],
                    [
                        '==',
                        'kind',
                        'river'
                    ]
                ],
                'layout': {
                    'line-cap': 'round',
                    'line-join': 'round'
                },
                'paint': {
                    'line-color': '#7acad0',
                    'line-width': {
                        'base': 1.2,
                        'stops': [
                            [
                                8,
                                0.75
                            ],
                            [
                                20,
                                15
                            ]
                        ]
                    }
                },
                'min-zoom': 6
            },
            {
                'id': 'stream-etc',
                'type': 'line',
                'source': 'osm',
                'source-layer': 'water',
                'filter': [
                    'all',
                    [
                        '==',
                        '$type',
                        'LineString'
                    ],
                    [
                        '==',
                        'kind',
                        'stream',
                    ],
                    [
                        '==',
                        'kind',
                        'canal'
                    ]
                ],
                'layout': {
                    'line-cap': 'round',
                    'line-join': 'round'
                },
                'paint': {
                    'line-color': '#7acad0',
                    'line-width': {
                        'base': 1.4,
                        'stops': [
                            [
                                10,
                                0.5
                            ],
                            [
                                20,
                                15
                            ]
                        ]
                    }
                },
                'min-zoom': 11
            },
            {
                'id': 'country-boundary',
                'type': 'line',
                'source': 'osm',
                'source-layer': 'places',
                'filter': [
                    '==',
                    'admin_level',
                    '2'
                ],
                'layout': {
                    'line-cap': 'round',
                    'line-join': 'round'
                },
                'paint': {
                    'line-color': '#afd3d3',
                    'line-width': {
                        'base': 2,
                        'stops': [
                            [
                                1,
                                0.5
                            ],
                            [
                                7,
                                3
                            ]
                        ]
                    }
                },
                'max-zoom': 4
            },
            {
                'id': 'state-boundary',
                'type': 'fill',
                'source': 'osm',
                'source-layer': 'places',
                'filter': [
                    '==',
                    'admin_level',
                    '4'
                ],
                'paint': {
                    'fill-color': '#ededed',
                    'fill-outline-color': '#cacecc'
                },
                'max-zoom': 10
            },
            {
                'id': 'subways',
                'type': 'line',
                'source': 'osm',
                'source-layer': 'roads',
                'filter': [
                    '==',
                    'railway',
                    'subway'
                ],
                'paint': {
                    'line-color': '#ef7369',
                    'line-dasharray': [
                        2,
                        1
                    ]
                }
            },
            {
                'id': 'link-tunnel',
                'type': 'line',
                'source': 'osm',
                'source-layer': 'roads',
                'filter': [
                    'any',
                    [
                        '==',
                        'is_tunnel',
                        'yes'
                    ]
                ],
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#afd3d3',
                    'line-width': {
                        'base': 1.55,
                        'stops': [
                            [
                                4,
                                0.25
                            ],
                            [
                                20,
                                30
                            ]
                        ]
                    },
                    'line-dasharray': [
                        1,
                        2
                    ]
                }
            },
            {
                'id': 'buildings',
                'type': 'fill',
                'source': 'osm',
                'source-layer': 'buildings',
                'paint': {
                    'fill-outline-color': '#afd3d3',
                    'fill-color': '#ededed'
                }
            },
            {
                'id': 'road',
                'type': 'line',
                'source': 'osm',
                'source-layer': 'roads',
                'filter': [
                    'any',
                    [
                        '==',
                        'kind',
                        'minor_road'
                    ],
                    [
                        '==',
                        'kind',
                        'major_road'
                    ]
                ],
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#c0c4c2',
                    'line-width': {
                        'base': 1.55,
                        'stops': [
                            [
                                4,
                                0.25
                            ],
                            [
                                20,
                                30
                            ]
                        ]
                    }
                }
            },
            {
                'id': 'link-bridge',
                'type': 'line',
                'source': 'osm',
                'source-layer': 'roads',
                'filter': [
                    'any',
                    [
                        '==',
                        'is_link',
                        'yes'
                    ],
                    [
                        '==',
                        'is_bridge',
                        'yes'
                    ]
                ],
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#c0c4c2',
                    'line-width': {
                        'base': 1.55,
                        'stops': [
                            [
                                4,
                                0.5
                            ],
                            [
                                8,
                                1.5
                            ],
                            [
                                20,
                                40
                            ]
                        ]
                    }
                }
            },
            {
                'id': 'highway',
                'type': 'line',
                'source': 'osm',
                'source-layer': 'roads',
                'filter': [
                    '==',
                    'kind',
                    'highway'
                ],
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#5d6765',
                    'line-width': {
                        'base': 1.55,
                        'stops': [
                            [
                                4,
                                0.5
                            ],
                            [
                                8,
                                1.5
                            ],
                            [
                                20,
                                40
                            ]
                        ]
                    }
                },
                'line-join': 'round'
            },
            {
                'id': 'path',
                'type': 'line',
                'source': 'osm',
                'source-layer': 'roads',
                'filter': [
                    '==',
                    'kind',
                    'path'
                ],
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': '#5d6765',
                    'line-width': {
                        'base': 1.8,
                        'stops': [
                            [
                                10,
                                0.15
                            ],
                            [
                                20,
                                15
                            ]
                        ]
                    },
                    'line-dasharray': [
                        2,
                        2
                    ]
                },
                'line-join': 'round',
                'line-cap': 'round',
                'min-zoom': 12
            },
            {
                'id': 'country-label',
                'type': 'symbol',
                'source': 'osm',
                'source-layer': 'places',
                'filter': [
                    'all',
                    [
                        '==',
                        '$type',
                        'Point'
                    ],
                    [
                        '==',
                        'kind',
                        'country'
                    ]
                ],
                'layout': {
                    'text-field': '{name}',
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold'
                    ],
                    'text-max-width': 4,
                    'text-size': {
                        'stops': [
                            [
                                2,
                                24
                            ],
                            [
                                6,
                                21
                            ]
                        ]
                    }
                },
                'paint': {
                    'text-color': '#cb4b49',
                    'text-halo-color': 'rgba(255,255,255,0.5)'
                },
                'max-zoom': 7
            },
            {
                'id': 'state-label',
                'type': 'symbol',
                'source': 'osm',
                'source-layer': 'places',
                'filter': [
                    'all',
                    [
                        '==',
                        '$type',
                        'Point'
                    ],
                    [
                        '==',
                        'kind',
                        'state'
                    ]
                ],
                'layout': {
                    'text-field': '{name}',
                    'text-font': [
                        'Open Sans Regular',
                        'Arial Unicode MS Regular'
                    ],
                    'text-max-width': 8,
                    'text-size': {
                        'stops': [
                            [
                                7,
                                18
                            ],
                            [
                                10,
                                30
                            ]
                        ]
                    }
                },
                'paint': {
                    'text-color': '#f27a87',
                    'text-halo-color': 'rgba(255,255,255,0.5)'
                },
                'min-zoom': 6,
                'max-zoom': 12
            },
            {
                'id': 'city-label',
                'type': 'symbol',
                'source': 'osm',
                'source-layer': 'places',
                'filter': [
                    'all',
                    [
                        '==',
                        '$type',
                        'Point'
                    ],
                    [
                        '==',
                        'kind',
                        'city',
                    ],
                    [
                        '==',
                        'kind',
                        'county',
                    ],
                    [
                        '==',
                        'kind',
                        'district'
                    ]
                ],
                'layout': {
                    'text-field': '{name}',
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold'
                    ],
                    'text-max-width': 10,
                    'text-letter-spacing': 0.1,
                    'text-size': {
                        'stops': [
                            [
                                8,
                                14
                            ],
                            [
                                12,
                                21
                            ]
                        ]
                    }
                },
                'paint': {
                    'text-color': '#384646',
                    'text-halo-color': 'rgba(255,255,255,0.5)'
                },
                'min-zoom': 10,
                'max-zoom': 14
            },
            {
                'id': 'other-label',
                'type': 'symbol',
                'source': 'osm',
                'source-layer': 'places',
                'filter': [
                    'all',
                    [
                        '==',
                        '$type',
                        'Point'
                    ],
                    [
                        '==',
                        'kind',
                        'neighbourhood',
                    ],
                    [
                        '==',
                        'kind',
                        'hamlet',
                    ],
                    [
                        '==',
                        'kind',
                        'suburb'
                    ]
                ],
                'layout': {
                    'text-field': '{name}',
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold'
                    ],
                    'text-max-width': 10,
                    'text-size': {
                        'stops': [
                            [
                                12,
                                14
                            ],
                            [
                                20,
                                21
                            ]
                        ]
                    }
                },
                'paint': {
                    'text-color': '#cb4b49',
                    'text-halo-color': 'rgba(255,255,255,0.5)'
                },
                'min-zoom': 12
            },
            {
                'id': 'ocean-label',
                'type': 'symbol',
                'source': 'osm',
                'source-layer': 'places',
                'filter': [
                    '==',
                    'kind',
                    'ocean'
                ],
                'layout': {
                    'text-field': '{name}',
                    'text-font': [
                        'Open Sans Italic',
                        'Arial Unicode MS Regular'
                    ],
                    'text-max-width': 14,
                    'text-letter-spacing': 0.1,
                    'text-size': {
                        'stops': [
                            [
                                2,
                                28
                            ],
                            [
                                6,
                                32
                            ]
                        ]
                    }
                },
                'paint': {
                    'text-color': '#ededed',
                    'text-halo-color': 'rgba(0,0,0,0.2)'
                },
                'min-zoom': 2,
                'max-zoom': 6
            }
        ]
    };

    var map = new mapboxgl.Map({
        container: id,
        style: style,
        center: [2.3472633364474, 48.860268320347],
        zoom: 12
    });

    map.addControl(new mapboxgl.Navigation());

    return map;
}

Function.prototype.throttle = function (threshhold)
{
    var lambda       = this;
    var previousTick = null;
    var setTimeoutId = null;

    return function () {
        var currentTick = (new Date()).getTime();
        var args        = arguments;

        if (previousTick && currentTick < previousTick + threshhold) {
            clearTimeout(setTimeoutId);
            setTimeoutId = setTimeout(
                function () {
                    previousTick = currentTick;
                    lambda.apply(null, args);
                },
                threshhold
            );
        } else {
            previousTick = currentTick;
            lambda.apply(null, args);
        }
    };
};

document.addEventListener(
    'readystatechange',
    function () {
        if ('complete' !== document.readyState) {
            return;
        }

        var map = null;

        var view = new Vue({
            el: '[role="application"]',
            data: model,
            methods: {
                autocomplete: new function ()
                {
                    var lastReceivedTimestamp = 0;

                    return function (event) {
                        var search = event.target.value;

                        if ('' === search) {
                            model.autocompleted = [];

                            return;
                        }

                        httpinvoke(
                            'https://search.mapzen.com/v1/autocomplete' +
                                '?text=' + encodeURIComponent(search) +
                                '&api_key=' + MAPZEN_SEARCH_API_KEY,
                            'GET'
                        ).then(function (value) {
                            if (200 !== value.statusCode) {
                                return;
                            }

                            var result = JSON.parse(value.body);

                            if ('FeatureCollection' !== result.type) {
                                return;
                            }

                            if (lastReceivedTimestamp > result.geocoding.timestamp) {
                                return;
                            }

                            lastReceivedTimestamp = result.geocoding.timestamp;
                            model.autocompleted   = result.features;
                        }, function (error) {
                            console.log('Failure', error);
                        });
                    };
                },

                flyToFeature: function (feature)
                {
                    if (null === map) {
                        return;
                    }

                    map.flyTo({
                        center: feature.geometry.coordinates,
                        zoom:   13
                    });
                    document.querySelector('input[name="from"]').value = feature.properties.label;
                    model.autocompleted = [];

                    this.setPopup(
                        feature.geometry.coordinates,
                        feature.properties.name
                    );

                    return;
                },

                setPopup: new function ()
                {
                    var popup = null;

                    return function (coordinates, message) {
                        if (null === map) {
                            return;
                        }

                        if (null !== popup) {
                            popup.remove(map);
                        }

                        popup = new mapboxgl.Popup();
                        popup.setLngLat(coordinates);
                        popup.setHTML('<p>' + message + '</p>');
                        popup.addTo(map);

                        return;
                    };
                }
            }
        })
        map = Map('map');
    }
);
