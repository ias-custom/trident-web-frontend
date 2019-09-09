import React, { useState, useEffect } from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import styles from "./styles";
import ReactMapGL, {
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
  
  reactMap = React.createRef();
  componentDidMount () {
  }
  
  render() {
    const { classes, projectId, structures, spans, markings, access } = this.props;
    const { loading, viewport, selectedMark, addStructure } = this.state;
    const map = this.reactMap.current ? this.reactMap.current.getMap() : null
    if (map) {
      map.on('load', () => {
        spans.map( span => {
          if (map.getLayer(String(span.id))) {
            map.removeLayer(String(span.id))
            map.removeSource(String(span.id))
          } 
          return (
            map.addLayer({
              id: String(span.id),
              type: "line",
              source: {
                type: "geojson",
                data: {
                  type: "Feature",
                  geometry: {
                    type: "LineString",
                    coordinates: [
                      span.coordinates[0],
                      span.coordinates[1]
                    ]
                  }
                }
              },
              layout: {
                "line-join": "round",
                "line-cap": "round"
              },
              paint: {
                "line-color": "#888",
                "line-width": 6
              }
            })
          )
        })
      })
    }
    return (
      <Grid style={{ height: "calc(100% - 95px)", width: "100%" }}>
        { projectId ? (
          <div style={{ height: "100%", width: "100%" }}>
            <ReactMapGL
              ref={this.reactMap}
              {...viewport}
              mapboxApiAccessToken={process.env.REACT_APP_MAP_TOKEN}
              onViewportChange={viewport =>
                this.setState({viewport:  {...viewport, width: "100%", height: "100%" }})
              }
              mapStyle="mapbox://styles/luiguisaenz/ck0cqa4ge03bu1cmvr30e45zs"
              /* onClick={({ lngLat, target }) => {
                return target.tagName === "DIV"
                  ? setAddStructure({ longitude: lngLat[0], latitude: lngLat[1] })
                  : null;
              }} */
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
            </ReactMapGL>
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
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(MapBox);
