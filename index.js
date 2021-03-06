mapboxgl.accessToken = 'pk.eyJ1IjoiYXVzdGlucnMxNiIsImEiOiJja2hjcjAyYWwwMTIyMnVsNXc3ajUwMmk0In0.b8-Uodu2rXl9TvsX7vatSQ';


var map = new mapboxgl.Map({
  container: 'map', // HTML container id
  style: 'mapbox://styles/austinrs16/ckoqf7lh646z517msf4mttqe9', // style URL
  center: [-121.78, 47.85], // starting position as [lng, lat]
  zoom: 10.5, // starting zoom
});






map.on('load', function(){
  // var within = turf.pointsWithinPolygon(addresses, sultan);
  // console.log(within)



  map.addSource('sultan',{
         "type": "geojson",
         "data": "jsons/serviceAreas/sultan.geojson"
     });
    map.addLayer({
       "id":"sultan",
       "type":"fill",
       "source":"sultan",
       "layout": {'visibility': 'visible'},
       "paint": {
        'fill-color': ['step',
                ['get', 'ToBreak'],
                'green',
                10,
                'yellow',
                15,
                'red',

              ],
        'fill-opacity': .15
          },
        });

  map.addSource('houses', {
    type: 'geojson',
    data: 'jsons/snoAddresses.geojson',
    cluster: true,
    clusterRadius: 50,
  });
    map.addLayer({
      "id":"uncluster",
      "type":"circle",
      "source":"houses",
      "filter":['!',['has','point_count']],
      "paint": {
        'circle-color':'purple',
        'circle-radius':3}
    });
    map.addLayer({
         "id":"houses",
         "type":"circle",
         "source": 'houses',
         "layout": {'visibility': 'visible'},
         "filter": ['has','point_count'],
         "paint": {
          'circle-color': [
                      'step',
                      ['get', 'point_count'],
                      '#51bbd6',
                      100,
                      '#51bbd6',
                      750,
                      '#51bbd6'
                  ],
                  'circle-radius': [
                      'step',
                      ['get', 'point_count'],
                      10,
                      100,
                      15,
                      750,
                      18
                      ],
            },
          });

    map.addLayer({
           "id":"count",
           "type":"symbol",
           "source": 'houses',
           "layout": {'visibility': 'visible'},
           "filter": ['has', 'point_count'],
           "layout": {
             'text-field': '{point_count_abbreviated}',
             'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
             'text-size': 12,
           },
           "paint": {
            'text-color': 'black',
              },
            });



    var redpep = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        properties: {name: 'Red Pepper'},
        geometry: {
          type: 'Point',
          coordinates:[-121.817760, 47.862394]
        }
      }]
    };


      map.addLayer({
        'id': 'redpep',
        'type': 'symbol',
        'source': {
          type: 'geojson',
          data: redpep
        },
        'layout': {
          'text-field': ['get', 'name'],
          'text-size': 8,
          'text-variable-anchor': ['top'],
          'text-radial-offset': .5,
        },
        'paint': {
          'text-color': 'black',

        }
      });
      map.addLayer({
        'id': 'redpepcirc',
        'type': 'circle',
        'source': {
          type: 'geojson',
          data: redpep
        },
        'paint': {
          'circle-radius': 3
        }
      });

        var draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
                polygon: true,
                trash: true
                },
            defaultMode: 'simple_select'
            });
          map.addControl(draw);

          map.on('draw.create', updateArea);
          map.on('draw.delete', updateArea);
          map.on('draw.update', updateArea);

          function updateArea(e) {
            var data = draw.getAll();
            var answer = document.getElementById('calculated-area');
            var polycoords = document.getElementById('coordinates');
                if (data.features.length > 0) {
                    var area = turf.pointsWithinPolygon(addresses, data);
                    var coords = turf.coordAll(data)

                    answer.innerHTML =
                    '<p><strong>' +
                    area.features.length +
                    '</strong></p>';

                    polycoords.innerHTML =
                    '<p "class"=coords>' +
                    coords +
                    '</p>';
                  }
                else {
                    answer.innerHTML = '';
                    if (e.type !== 'draw.delete')
                    alert('Use the draw tools to draw a polygon!');
                    }
                };


      map.on('click', 'houses', function (e) {
        var features = map.queryRenderedFeatures(e.point, {
          layers: ['houses']
          });
        var clusterId = features[0].properties.cluster_id;
        map.getSource('houses').getClusterExpansionZoom(
          clusterId,
          function (err, zoom) {
            if (err) return;

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom
            });
          }
        );
      });


});
