import React, { useState, useEffect } from "react";
import { compose } from "recompose";
import styles from "./styles";
import MapGL, {
  Marker,
  Popup,
  GeolocateControl,
  NavigationControl
} from "react-map-gl";
import { withStyles } from "@material-ui/core";

function MapBox({classes}) {
  const [viewport, setViewport] = useState({
    latitude: -11.9890777,
    longitude: -77.0838287,
    zoom: 11,
    width: "100%",
    height: "100%"
  });

  const [selectedMark, setSelectedMark] = useState(null);

  const [addStructure, setAddStructure] = useState(null);

  const [markers, setMarker] = useState([
    {
      id: 1,
      latitude: -11.9890777,
      longitude: -77.0838287
    },
    {
      id: 2,
      latitude: -11.8890777,
      longitude: -77.1038287
    }
  ]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAP_TOKEN}
        onViewportChange={viewport =>
          setViewport({ ...viewport, width: "100%", height: "100%" })
        }
        mapStyle="mapbox://styles/luiguisaenz/ck076tv1t01wv1cnvqc5215jr"
        onClick={({ lngLat, target }) => {
          return target.tagName === "DIV"
            ? setAddStructure({ longitude: lngLat[0], latitude: lngLat[1] })
            : null;
        }}
      >
        {markers.map(marker => {
          return (
            <Marker
              key={marker.id}
              latitude={marker.latitude}
              longitude={marker.longitude}
            >
              <i
                className="fas fa-map-marker-alt"
                onMouseEnter={e => {
                  setSelectedMark(marker);
                }}
                onMouseLeave={e => {
                  setSelectedMark(null);
                }}
                style={{ color: "#3f51b5", fontSize: 30, cursor: "pointer" }}
              ></i>
            </Marker>
          );
        })}
        {selectedMark ? (
          <Popup
            latitude={selectedMark.latitude}
            longitude={selectedMark.longitude}
          >
            holaaa
          </Popup>
        ) : null}
        {addStructure ? (
          <Marker
            key={addStructure.id}
            latitude={addStructure.latitude}
            longitude={addStructure.longitude}
          >
            <i
              className="fas fa-map-marker-alt"
              style={{ color: "red", fontSize: 30, cursor: "pointer" }}
            ></i>
          </Marker>
        ) : null}
        <GeolocateControl
          trackUserLocation={true}
          showUserLocation={false}
          style={{ width: "30px", margin: 10 }}
          fitBoundsOptions={{ maxZoom: 5 }}
          positionOptions={{ enableHighAccuracy: true }}
          onViewportChange={viewport => setViewport({ ...viewport, zoom: 11, width: "100%", height: "100%" })}
        />
        <NavigationControl 
          className={classes.hola}
        />
      </MapGL>
    </div>
  );
}

export default compose(
  withStyles(styles),
)(MapBox);
