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
import { withStyles, Grid } from "@material-ui/core";

class MapBox extends React.Component {
  state = {
    viewport: {
      latitude: -11.9890777,
      longitude: -77.0838287,
      zoom: 11,
      width: "100%",
      height: "100%"
    },
    selectedMark: null,
    addStructure: null,
    map: ""
  }

  mapLoaded = false
  map = null
  reactMap = React.createRef();
  
  componentDidUpdate(prevProps) {
    const oldSpanIds = prevProps.spans.map(({id}) => id)
    const changeSpans = oldSpanIds.find( id => {
      return this.props.spans.map(({id}) => id).includes(id)
    })
    if (changeSpans === undefined || prevProps.projectId !== this.props.projectId) {
      this.map = this.reactMap.current ? this.reactMap.current.getMap() : null
      if (this.map){
        const features = this.props.spans.map( span => {
          return {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [span.coordinates[0], span.coordinates[1]]
            }
          }
        })
        if (this.mapLoaded){
          this.changeLayers(features)
          return
        } 
        this.map.on('load', () => {
          this.mapLoaded = true
          this.changeLayers(features)
        })
      }
    }
  }

  changeLayers (features) {
    if(this.map.getSource('spans')) {
      this.map.removeLayer('park-boundary')
      this.map.removeSource("spans")
    }
    this.map.addSource('spans', {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: features
      }
    })
    this.map.addLayer({
      "id": "park-boundary",
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
  }

  render() {
    const { classes, projectId, structures, markings, access } = this.props;
    const { viewport, selectedMark, addStructure } = this.state;
    if(this.mapLoaded) {
      this.map.on('click', (e) => {
        console.log(e)
      })
    }
    return (
      <Grid style={{ height: "calc(100% - 95px)", width: "100%" }}>
        { projectId ? (
          <div style={{ height: "100%", width: "100%" }}>
            <MapGL
              ref={this.reactMap}
              {...viewport}
              mapboxApiAccessToken={process.env.REACT_APP_MAP_TOKEN}
              onViewportChange={viewport =>
                this.setState({viewport:  {...viewport, width: "100%", height: "100%" }})
              }
              mapStyle="mapbox://styles/luiguisaenz/ck0cqa4ge03bu1cmvr30e45zs"
              onClick={(e) => {
                console.log(e)
              }}
            >
              {structures.map(structure => {
                return (
                  <Marker
                    key={structure.id}
                    longitude={structure.coordinate[0]}
                    latitude={structure.coordinate[1]}
                  >
                    <i
                      className="fas fa-broadcast-tower"
                      style={{ color: "#3f51b5", fontSize: 25, cursor: "pointer" }}
                      onMouseEnter={() => this.setState({selectedMark: structure})}
                      onMouseLeave={() => this.setState({selectedMark: null})}
                      onClick={() => this.props.history.push(`/projects/${projectId}/structures/${structure.id}`)}
                    ></i>
                  </Marker>
                );
              })}

              {selectedMark ? (
                <Popup
                  longitude={selectedMark.coordinate[0]}
                  latitude={selectedMark.coordinate[1]}
                >
                  {selectedMark.name || selectedMark.details || selectedMark.notes}
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

              {markings.map(marking => {
                return (
                  <Marker
                    key={marking.id}
                    longitude={marking.coordinate[0]}
                    latitude={marking.coordinate[1]}
                  >
                    <i
                      className="fab fa-bandcamp"
                      style={{ color: "#f56c6c", fontSize: 18, cursor: "pointer" }}
                      onMouseEnter={() => this.setState({selectedMark: marking})}
                      onMouseLeave={() => this.setState({selectedMark: null})}
                      onClick={() => this.props.history.push(`/projects/${projectId}/spans/${marking.span_id}?marking=true`)}
                    ></i>
                  </Marker>
                );
              })}

              {access.map(a => {
                return (
                  <Marker
                    key={a.id}
                    longitude={a.coordinate[0]}
                    latitude={a.coordinate[1]}
                  >
                    <i
                      className="fab fa-confluence"
                      style={{ color: "#67c23a", fontSize: 18, cursor: "pointer" }}
                      onMouseEnter={() => this.setState({selectedMark: a})}
                      onMouseLeave={() => this.setState({selectedMark: null})}
                      onClick={() => this.props.history.push(`/projects/${projectId}/spans/${a.span_id}?access=true`)}
                    ></i>
                  </Marker>
                );
              })}

              <GeolocateControl
                trackUserLocation={true}
                showUserLocation={false}
                style={{ width: "30px", margin: 10 }}
                fitBoundsOptions={{ maxZoom: 5 }}
                positionOptions={{ enableHighAccuracy: true }}
                onViewportChange={viewport => this.setState({viewport: {...viewport, zoom: 14, width: "100%", height: "100%" }})} 
              />
              <NavigationControl 
                className={classes.navigation}
              />
            </MapGL>
          </div>
        ) : (
          <div className={classes.divEmpty}>
            SELECT A PROJECT
          </div>
        )}
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
