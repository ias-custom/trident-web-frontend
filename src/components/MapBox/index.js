import React, { useState, useEffect } from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styles from "./styles";
import MapGL, {
  Marker,
  Popup,
  GeolocateControl,
  NavigationControl
} from "react-map-gl";
import {
  toggleItemMenu,
  selectedItemMenu
} from "../../redux/actions/layoutActions";
import { fetchStructures } from "../../redux/actions/structureActions"
import { fetchSpans } from "../../redux/actions/spanActions"
import { withStyles, Grid, Button } from "@material-ui/core";
import mapboxgl from 'mapbox-gl';

class MapBox extends React.Component {
  state = {
    latitude: -11.9890777,
    longitude: -77.0838287,
    selectedMark: null,
    addStructure: null,
  }

  mapLoaded = false
  map = null
  reactMap = React.createRef();
  
  componentDidMount () {
    mapboxgl.accessToken = process.env.REACT_APP_MAP_TOKEN;
    if("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(({coords}) => { 
        this.setState({latitude: coords.latitude, longitude: coords.longitude})
        this.createMap();
      }); 
    } else { this.createMap()}
  }

  componentDidUpdate(prevProps) {
  }

  createMap () {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/luiguisaenz/ck0cqa4ge03bu1cmvr30e45zs',
      center: [this.state.longitude, this.state.latitude],
      zoom: 13 
    });
    // Add geolocate control to the map.
    this.map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }));
    // Add zoom and rotation controls to the map.
    this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    
    this.map.on('load', () => {
      this.getLayers()
      this.getStructures()
      this.getMarkings()
      this.getAccess()
      /* this.map.on('click', (e) => {
        console.log(e)
        const marker = document.getElementById("new-marker")
        if (marker) marker.remove()
        var el = document.createElement('i');
        el.className = `fab fa-confluence ${this.props.classes.access}`;
        el.id = "new-marker"
        new mapboxgl.Marker(el)
        .setLngLat([e.lngLat.lng, e.lngLat.lat])
        .setPopup(new mapboxgl.Popup({ offset: 10 }) // add popups
        .setHTML(`hola`))
        .addTo(this.map);
      }) */
      var el = document.createElement('i');
      el.className = `fas fa-map-marker-alt ${this.props.classes.structure}`;
      // make a marker for each feature and add to the map
      const {lng, lat} = this.map.getCenter()
      new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .addTo(this.map);
    })
  }

  getLayers () {
    const features = this.props.spans.map( span => {
      return {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [span.coordinates[0], span.coordinates[1]]
        },
        properties: {
          id: span.id,
          link: `/projects/${this.props.projectId}/spans/${span.id}`
        }
      }
    })
    this.map.addSource('spans', {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: features
      }
    })
    this.map.addLayer({
      "id": "span",
      "type": "line",
      "source": "spans",
      "layout": {
        "line-join": "round",
        "line-cap": "round",
      },
      "paint": {
        "line-color": "#888",
        "line-width": 6,
      }
    });

    this.map.on('mouseenter', 'span', (e) => {
      this.map.getCanvas().style.cursor = 'pointer';
    })
    this.map.on('mouseleave', 'span', (e) => {
      this.map.getCanvas().style.cursor = '';
    })
    this.map.on('click', 'span', (e) => {
      const spanId = e.features[0].properties.id;
      const link = e.features[0].properties.link;
      new mapboxgl.Popup({offset: 10})
      .setLngLat([e.lngLat.lng, e.lngLat.lat])
      .setHTML(`<h3>${spanId}</h3><a href='${link}' target='_blank'>Ir</a>`)
      .addTo(this.map);
    })
  }

  getStructures () {
    const features = this.props.structures.map( structure => {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [structure.longitude, structure.latitude]
        },
        properties: {
          name: structure.name,
          link: `/projects/${this.props.projectId}/structures/${structure.id}`
        }
      }
    })

    features.forEach((marker) => {
      // create a HTML element for each feature
      var el = document.createElement('i');
      el.className = `fas fa-broadcast-tower ${this.props.classes.structure}`;
      // make a marker for each feature and add to the map
      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 10 }) // add popups
        .setHTML(`<h3>${marker.properties.name}</h3><a href='${marker.properties.link}' target='_blank'>Ir</a>`))
        .addTo(this.map);
    });
  }

  getMarkings () {
    const features = this.props.markings.map( marking => {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [marking.coordinate[0], marking.coordinate[1]]
        },
        properties: {
          name: marking.details,
          link: `/projects/${this.props.projectId}/spans/${marking.span_id}?marking=true&id=${marking.id}`
        }
      }
    })

    features.forEach((marker) => {
      // create a HTML element for each feature
      var el = document.createElement('i');
      el.className = `fab fa-bandcamp ${this.props.classes.marking}`;
      // make a marker for each feature and add to the map
      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 10 }) // add popups
        .setHTML(`<h3>${marker.properties.name}</h3><a href='${marker.properties.link}' target='_blank'>Ir</a>`))
        .addTo(this.map);
    });
  }

  getAccess () {
    const features = this.props.access.map( a => {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [a.coordinate[0], a.coordinate[1]]
        },
        properties: {
          name: a.notes,
          link: `/projects/${this.props.projectId}/spans/${a.span_id}?access=true&id=${a.id}`
        }
      }
    })

    features.forEach((marker) => {
      // create a HTML element for each feature
      var el = document.createElement('i');
      el.className = `fab fa-confluence ${this.props.classes.access}`;
      // make a marker for each feature and add to the map
      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 10 }) // add popups
        .setHTML(`<h3>${marker.properties.name}</h3><a href='${marker.properties.link}' target='_blank'>Ir</a>`))
        .addTo(this.map);
    });
  }

  addItem () {
    console.log(this.map.getCenter())
  }
  render() {
    const { classes, projectId, structures, markings, access } = this.props;
    const { loading, viewport, selectedMark, addStructure } = this.state;
    
    return (
      <Grid style={{ height: "calc(100% - 95px)", width: "100%" }}>
        <div id="map" style={{ height: "100%", width: "100%" }}>
          <div className={classes.divMarker}>
            <i className={"fas fa-map-marker-alt"}></i>
            <div className={classes.detailsMarker}>
              <div className={classes.triangle}></div>
              <div className={classes.infoMarker}>
                <p>Do you confirm the location?</p>
                <div>
                  <Button
                    variant="outlined"
                    className={classes.buttonCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    style={{ marginLeft: 10 }}
                    variant="outlined"
                    className={classes.buttonAccept}
                    onClick={() => this.addItem()}
                  >
                    Yes, I sure
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.global.loading,
    structures: state.structures.structures,
    spans: state.spans.spans,
    markings: state.spans.markings,
    access: state.spans.access
    
  };
};

const mapDispatchToProps = {
  toggleItemMenu,
  selectedItemMenu,
  fetchStructures,
  fetchSpans
};

export default compose(
  withRouter,
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(MapBox);
