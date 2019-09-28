import React from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { REACT_APP_MAP_TOKEN } from "../../config/environment";
import styles from "./styles";
import {
  toggleItemMenu,
  selectedItemMenu
} from "../../redux/actions/layoutActions";
import { setPoint } from "../../redux/actions/projectActions";
import { fetchStructures } from "../../redux/actions/structureActions";
import {
  fetchSpans,
  setSpan,
  setStructures
} from "../../redux/actions/spanActions";
import { withStyles, Grid, Button } from "@material-ui/core";
import mapboxgl from "mapbox-gl";
import { CheckCircle } from "@material-ui/icons";
import { withSnackbar } from "notistack";

class MapBox extends React.Component {
  state = {
    latitude: -11.9890777,
    longitude: -77.0838287,
    selectedMark: null,
    addItem: null,
    link: "",
    itemValue: 0,
    span: {
      id: "",
      name: ""
    },
    spanSelected: "",
    structuresSelected: {
      first: {
        id: "",
        name: ""
      },
      second: {
        id: "",
        name: ""
      }
    },
    addFirstStructure: true,
    confirmStructures: false
  };

  mapLoaded = false;
  map = null;
  reactMap = React.createRef();

  componentDidMount() {
    mapboxgl.accessToken = REACT_APP_MAP_TOKEN;
    if ("geolocation" in navigator) {
      this.createMap();
      // FOR PAGE HTTPS
      /* navigator.geolocation.getCurrentPosition(({ coords }) => {
        this.setState({
          latitude: coords.latitude,
          longitude: coords.longitude
        });
        this.createMap();
      }); */
    } else {
      this.createMap();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.open !== this.props.open) {
      setTimeout(() => {
        this.map.resize();
      }, 180);
    }
  }

  createMap() {
    this.map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/luiguisaenz/ck0cqa4ge03bu1cmvr30e45zs",
      center: [this.state.longitude, this.state.latitude],
      zoom: 13
    });
    // Add geolocate control to the map.
    this.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      })
    );
    // Add zoom and rotation controls to the map.
    this.map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    this.map.on("load", () => {
      this.getLayers();
      this.getStructures();
      this.getMarkings();
      this.getAccess();
      this.map.on("click", ({ lngLat }) => {
        this.map.flyTo({ center: [lngLat.lng, lngLat.lat] });
      });
    });
  }

  getLayers() {
    const features = this.props.spans.map(span => {
      return {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [span.coordinates[0], span.coordinates[1]]
        },
        properties: {
          id: span.id,
          link: `/projects/${this.props.projectId}/spans/${span.id}`,
          number: span.number
        }
      };
    });
    this.map.addSource("spans", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: features
      }
    });
    this.map.addLayer({
      id: "span",
      type: "line",
      source: "spans",
      layout: {
        "line-join": "round",
        "line-cap": "round"
      },
      paint: {
        "line-color": "#444444",
        "line-width": 5
      }
    });

    this.map.on("mouseenter", "span", e => {
      this.map.getCanvas().style.cursor = "pointer";
    });
    this.map.on("mouseleave", "span", e => {
      this.map.getCanvas().style.cursor = "";
    });
    this.map.on("click", "span", e => {
      const spanId = e.features[0].properties.id;
      const link = e.features[0].properties.link;
      const number = e.features[0].properties.number;
      if ([3, 4].includes(this.state.itemValue)) {
        this.setState({ span: { id: spanId, number } });
      } else {
        new mapboxgl.Popup({ offset: 10 })
          .setLngLat([e.lngLat.lng, e.lngLat.lat])
          .setHTML(`<h3>${number}</h3><a href='${link}' target='_blank'>Ir</a>`)
          .addTo(this.map);
      }
    });
  }

  getDialogConfirm() {
    const { classes } = this.props;
    const { spanSelected, span, structuresSelected, itemValue } = this.state;
    return (
      <div>
        {itemValue !== 2 ? (
          <i className={`fas fa-map-marker-alt ${classes.iconMarker}`}></i>
        ) : null}
        <div className={classes.detailsMarker}>
          <div className={classes.triangle}></div>
          <div className={classes.infoMarker}>
            {itemValue === 2 ? (
              <p className={classes.paragraph}>CONFIRM THE STRUCTURES?</p>
            ) : (
              <p className={classes.paragraph}>¡SELECT TO LOCATION !</p>
            )}
            {spanSelected ? (
              <p className={classes.paragraph}>
                {" "}
                - Selected span: {span.number}
              </p>
            ) : null}
            {structuresSelected.first.id ? (
              <p className={classes.paragraph}>
                {" "}
                - Selected structure start: {structuresSelected.first.name}
              </p>
            ) : null}
            {structuresSelected.second.id ? (
              <p className={classes.paragraph}>
                {" "}
                - Selected structure end: {structuresSelected.second.name}
              </p>
            ) : null}
            <div>
              <Button
                variant="outlined"
                className={classes.buttonCancel}
                onClick={() =>
                  this.setState({
                    itemValue: 0,
                    link: "",
                    spanSelected: "",
                    addFirstStructure: true
                  })
                }
              >
                Cancel
              </Button>
              <Button
                style={{ marginLeft: 10 }}
                variant="outlined"
                className={classes.buttonAccept}
                onClick={() => this.confirmAddItem()}
              >
                Yes, I sure
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  getStructures() {
    console.log(this.props.structures);
    const features = this.props.structures.map(structure => {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [structure.longitude, structure.latitude]
        },
        properties: {
          name: structure.name,
          link: `/projects/${this.props.projectId}/structures/${structure.id}`,
          id: structure.id,
          collected: structure.state_id === 1
        }
      };
    });

    features.forEach(marker => {
      // create a HTML element for each feature
      var el = document.createElement("i");
      const classMarker = marker.properties.collected
        ? this.props.classes.structure
        : this.props.classes.structureRed;
      el.className = `fas fa-broadcast-tower ${classMarker}`;
      // make a marker for each feature and add to the map
      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .addTo(this.map);

      el.addEventListener("click", e => {
        e.stopPropagation();
        const { id, name } = marker.properties;
        const { itemValue, structuresSelected, addFirstStructure } = this.state;
        if (itemValue === 2) {
          if (addFirstStructure) {
            this.setState(prevState => {
              return {
                structuresSelected: {
                  ...prevState.structuresSelected,
                  first: { id, name }
                }
              };
            });
          } else {
            if (id !== structuresSelected.first.id) {
              this.setState(prevState => {
                return {
                  structuresSelected: {
                    ...prevState.structuresSelected,
                    second: { id, name }
                  }
                };
              });
            } else {
              this.props.enqueueSnackbar("Cannot select the same structure", {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "center" }
              });
            }
          }
        } else {
          new mapboxgl.Popup({ offset: 10 })
            .setLngLat(marker.geometry.coordinates)
            .setHTML(
              `<h3>${marker.properties.name}</h3><a href='${marker.properties.link}' target='_blank'>Ir</a>`
            )
            .addTo(this.map);
        }
      });
    });
  }

  getMarkings() {
    const features = this.props.markings.map(marking => {
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
      };
    });

    features.forEach(marker => {
      // create a HTML element for each feature
      var el = document.createElement("i");
      el.className = `fab fa-bandcamp ${this.props.classes.marking}`;
      // make a marker for each feature and add to the map
      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 10 }) // add popups
            .setHTML(
              `<h3>${marker.properties.name}</h3><a href='${marker.properties.link}' target='_blank'>Ir</a>`
            )
        )
        .addTo(this.map);
    });
  }

  getAccess() {
    const features = this.props.access.map(a => {
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
      };
    });

    features.forEach(marker => {
      // create a HTML element for each feature
      var el = document.createElement("i");
      el.className = `fab fa-confluence ${this.props.classes.access}`;
      // make a marker for each feature and add to the map
      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 10 }) // add popups
            .setHTML(
              `<h3>${marker.properties.name}</h3><a href='${marker.properties.link}' target='_blank'>Ir</a>`
            )
        )
        .addTo(this.map);
    });
  }

  setItem(value, link) {
    this.setState({
      itemValue: value,
      link,
      span: {
        id: "",
        name: ""
      },
      spanSelected: "",
      structuresSelected: {
        first: {
          id: "",
          name: ""
        },
        second: {
          id: "",
          name: ""
        }
      }
    });
  }

  confirmAddItem() {
    // CALL TO DISPATCH TO SET LAT AND LNG
    const { itemValue, structuresSelected, spanSelected, link } = this.state;
    if (itemValue === 2) {
      this.props.setStructures(
        structuresSelected.first.id,
        structuresSelected.second.id
      );
    } else {
      const { lng, lat } = this.map.getCenter();
      this.props.setPoint(lat, lng);
      if ([3, 4].includes(itemValue)) this.props.setSpan(spanSelected);
    }
    this.props.history.push(link);
  }

  cancelAddMarkingOrAccess() {
    this.setState({
      itemValue: 0,
      link: "",
      spanSelected: "",
      span: { id: "", number: "" }
    });
  }

  cancelAddSpan() {
    this.setState({
      itemValue: 0,
      link: "",
      structuresSelected: {
        first: { id: "", name: "" },
        second: { id: "", name: "" }
      },
      addFirstStructure: true
    });
  }

  render() {
    const { classes, projectId } = this.props;
    const {
      itemValue,
      spanSelected,
      span,
      structuresSelected,
      addFirstStructure,
      confirmStructures
    } = this.state;
    return (
      <Grid style={{ height: "calc(100% - 95px)", width: "100%" }}>
        <div id="map" style={{ height: "100%", width: "100%" }}>
          <div className={classes.divMenu}>
            <Button
              variant="outlined"
              className={classes.buttonMenu}
              onClick={() =>
                this.setItem(1, `/projects/${projectId}/structures/create`)
              }
            >
              Add structure
              {itemValue === 1 ? (
                <CheckCircle className={classes.iconButtonMenu}></CheckCircle>
              ) : null}
            </Button>
            <Button
              variant="outlined"
              className={classes.buttonMenu}
              onClick={() =>
                this.setItem(2, `/projects/${projectId}/spans/create`)
              }
            >
              Add span
              {itemValue === 2 ? (
                <CheckCircle className={classes.iconButtonMenu}></CheckCircle>
              ) : null}
            </Button>
            <Button
              variant="outlined"
              className={classes.buttonMenu}
              onClick={() => {
                this.setItem(3, `/projects/${projectId}/markings/create`);
              }}
            >
              Add marking
              {itemValue === 3 ? (
                <CheckCircle className={classes.iconButtonMenu}></CheckCircle>
              ) : null}
            </Button>
            <Button
              variant="outlined"
              className={classes.buttonMenu}
              onClick={() =>
                this.setItem(4, `/projects/${projectId}/access/create`)
              }
            >
              Add access
              {itemValue === 4 ? (
                <CheckCircle className={classes.iconButtonMenu}></CheckCircle>
              ) : null}
            </Button>
          </div>
          {itemValue === 2 ? (
            <div>
              {structuresSelected.first.id &&
              structuresSelected.second.id &&
              confirmStructures ? (
                this.getDialogConfirm()
              ) : (
                <div className={classes.detailsMarker}>
                  <div className={classes.triangle}></div>
                  <div className={classes.infoMarker}>
                    {addFirstStructure ? (
                      <div>
                        <p className={classes.paragraph}>
                          THE SELECTED STRUCTURE START:
                        </p>
                        <p className={classes.paragraph}>
                          {structuresSelected.first.id
                            ? structuresSelected.first.name
                            : "Not selected"}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className={classes.paragraph}>
                          THE SELECTED STRUCTURE END:
                        </p>
                        <p className={classes.paragraph}>
                          {structuresSelected.second.id
                            ? structuresSelected.second.name
                            : "Not selected"}
                        </p>
                      </div>
                    )}
                    <div>
                      <Button
                        variant="outlined"
                        className={classes.buttonCancel}
                        onClick={() => this.cancelAddSpan()}
                      >
                        Cancel
                      </Button>
                      <Button
                        style={{ marginLeft: 10 }}
                        variant="outlined"
                        className={classes.buttonAccept}
                        onClick={() => {
                          if (addFirstStructure) {
                            this.setState({ addFirstStructure: false });
                          } else {
                            this.setState({ confirmStructures: true });
                          }
                        }}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}
          {itemValue === 3 || itemValue === 4 ? (
            <div>
              {spanSelected ? (
                this.getDialogConfirm()
              ) : (
                <div className={classes.detailsMarker}>
                  <div className={classes.triangle}></div>
                  <div className={classes.infoMarker}>
                    <p className={classes.paragraph}>THE SELECTED SPAN IS:</p>
                    <p className={classes.paragraph}>
                      {span.number ? span.number : "Not selected"}
                    </p>
                    <div>
                      <Button
                        variant="outlined"
                        className={classes.buttonCancel}
                        onClick={() => this.cancelAddMarkingOrAccess()}
                      >
                        Cancel
                      </Button>
                      <Button
                        style={{ marginLeft: 10 }}
                        variant="outlined"
                        className={classes.buttonAccept}
                        onClick={() => {
                          this.setState({ spanSelected: span.id });
                        }}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}
          {itemValue === 1 ? this.getDialogConfirm() : null}
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
  fetchSpans,
  setPoint,
  setSpan,
  setStructures
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(MapBox);
