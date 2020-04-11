function hslToHex(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = (x) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

var urlParams = new URLSearchParams(window.location.search);
var yearParam = urlParams.get('year');

var grays = new Array(14)
  .fill('')
  .map((item, index) => hslToHex(0, 0, index * 2.5));

function initMap() {
  var paths = [];
  var styledMapType = new google.maps.StyledMapType(
    [
      {
        elementType: 'geometry',
        stylers: [
          {
            color: grays[3],
          },
        ],
      },
      {
        elementType: 'labels',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        elementType: 'labels.icon',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: grays[11],
          },
        ],
      },
      {
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: grays[3],
          },
        ],
      },
      {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [
          {
            color: grays[11],
          },
          {
            visibility: 'off',
          },
        ],
      },
      {
        featureType: 'administrative.country',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: grays[13],
          },
        ],
      },
      {
        featureType: 'administrative.land_parcel',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: grays[14],
          },
        ],
      },
      {
        featureType: 'administrative.neighborhood',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        featureType: 'poi',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: grays[11],
          },
        ],
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [
          {
            color: grays[1],
          },
        ],
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: grays[10],
          },
        ],
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: grays[2],
          },
        ],
      },
      {
        featureType: 'road',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: grays[5],
          },
        ],
      },
      {
        featureType: 'road',
        elementType: 'labels.icon',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: grays[12],
          },
        ],
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          {
            color: grays[6],
          },
        ],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: grays[7],
          },
        ],
      },
      {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry',
        stylers: [
          {
            color: grays[5],
            strokeWeight: 1,
          },
        ],
      },
      {
        featureType: 'road.local',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: grays[10],
          },
        ],
      },
      {
        featureType: 'transit',
        stylers: [
          {
            visibility: 'off',
          },
        ],
      },
      {
        featureType: 'transit',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: grays[11],
          },
        ],
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [
          {
            color: grays[0],
          },
        ],
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: grays[8],
          },
        ],
      },
    ],
    { name: 'Styled Map' }
  );

  var bounds = new google.maps.LatLngBounds();

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: { lat: 35, lng: -100 },
    mapTypeId: 'terrain',
  });

  window.mapData.all
    .filter((item) => {
      // If the URL param has been passed, then filter on it...
      if (yearParam != null) {
        return parseInt(item.year, 10) === parseInt(yearParam, 10);
      }

      // Otherwise return everything
      return true;
    })
    .forEach((item) => {
      // [TODO] Ensure this color contrasts well with the map background color
      var randomColor = Math.floor(Math.random() * 16777215).toString(16);

      const polyLine = new google.maps.Polyline({
        path: item.coordinates,
        geodesic: true,
        // strokeColor: '#00ffff',
        strokeColor: '#9dff00',
        // strokeOpacity: 1.0,
        strokeOpacity: 0.3,
        strokeWeight: 1,
      });
      item.coordinates.forEach((coord) => bounds.extend(coord));
      polyLine.setMap(map);
    });

  map.mapTypes.set('styled_map', styledMapType);
  map.setMapTypeId('styled_map');
  map.fitBounds(bounds);
}

window.initMap = initMap;
