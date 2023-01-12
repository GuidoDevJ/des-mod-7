import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import mapboxgl from "mapbox-gl";
        (()=>{
            mapboxgl.accessToken = process.env.MAPBOX_TOKEN
          const map = new mapboxgl.Map({
            container: "map-container",
            // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
            style: "mapbox://styles/mapbox/streets-v12",
            center: [-79.4512, 43.6568],
            zoom: 13,
          });
      
          // Add the control to the map.
          map.addControl(
            new MapboxGeocoder({
              accessToken: mapboxgl.accessToken,
              mapboxgl: mapboxgl,
            })
          );
          
        })()