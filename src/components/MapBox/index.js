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
import { setPoint, setFromMap } from "../../redux/actions/projectActions";
import {
  fetchStructures,
  getStructure
} from "../../redux/actions/structureActions";
import {
  fetchSpans,
  setSpan,
  setStructures,
  getSpan
} from "../../redux/actions/spanActions";
import { withStyles, Grid, Button, Avatar, Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import mapboxgl from "mapbox-gl";
import { CheckCircle, CancelOutlined } from "@material-ui/icons";
import { withSnackbar } from "notistack";
import { getSubstations } from "../../redux/actions/substationActions";
import substationImage from "../../img/substation.png";
import woodStructureGray from "../../img/wood_structure_gray.png";
import steelStructureGray from "../../img/steel_structure_gray.png";
import woodStructureOrange from "../../img/wood_structure_orange.png";
import steelStructureOrange from "../../img/steel_structure_orange.png";
import woodStructureRed from "../../img/wood_structure_red.png";
import steelStructureRed from "../../img/steel_structure_red.png";
import woodStructureGreen from "../../img/wood_structure_green.png";
import steelStructureGreen from "../../img/steel_structure_green.png";
import { CAN_ADD_STRUCTURE, CAN_ADD_SPAM } from "../../redux/permissions";

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
    deficiencies: "",
    spanSelected: "",
    structuresSelected: {
      first: {
        id: "",
        name: "",
        type: ""
      },
      second: {
        id: "",
        name: "",
        type: ""
      }
    },
    addFirstStructure: true,
    confirmStructures: false,
    categories: [],
    items: [],
    popup: null,
    marker: null,
    open: false,
    openPhoto: false,
    url: ""
  };

  mapLoaded = false;
  map = null;
  reactMap = React.createRef();

  componentDidMount = async () => {
    await this.props.getSubstations(false);
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
  };

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
      this.getStructures();
      this.getLayers();
      this.getMarkings();
      this.getAccess();
      this.getInteractions();
      this.getSubstations();
      this.map.on("click", ({ lngLat }) => {
        this.map.flyTo({ center: [lngLat.lng, lngLat.lat] });
      });
    });
  }

  formatterInfo(items, categories) {
    const itemsFilter = items.filter(
      ({ deficiencies }) => deficiencies.length > 0
    );
    const categoriesFilter = categories.filter(({ id }) => {
      return itemsFilter.map(({ category_id }) => category_id).includes(id);
    });
    this.setState({
      categories: categoriesFilter,
      items: itemsFilter
    });
  }

  getInfo(marker) {
    const { categories, items } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.divInfo}>
        <a
          href={marker.properties.link}
          className={classes.link}
          target={"_blank"}
        >
          <h3>{marker.properties.name}</h3>
        </a>
        {items.length > 0 ? (
          categories.map((category, index) => (
            <div key={category.id}>
              <p className={classes.label}>
                {index + 1}. {category.name}
              </p>
              <div className={classes.divItems}>
                {items
                  .filter(({ category_id }) => category_id === category.id)
                  .map(item => (
                    <div key={item.id}>
                      <span className={classes.label}>
                        - Item "{item.item_parent.name}":
                      </span>
                      <div className={classes.divItems}>
                        {item.deficiencies.map(d => (
                          <div>
                            <p key={d.id}>
                              {d.deficiency.name}{" "}
                              {d.emergency ? (
                                <i
                                  className="fas fa-exclamation-triangle"
                                  style={{ color: "red" }}
                                ></i>
                              ) : (
                                ""
                              )}
                            </p>
                            {/* d.photos.map(p => (
                               <Avatar alt="photo" src={p.url} key={p.id}/>
                            )) */}
                            <div>
                              {[
                                "https://uploads-ssl.webflow.com/5c8147c9231350d8ded8875e/5c846ad47c584b9a97e70d6a_avatar-3.png",
                                "https://uploads-ssl.webflow.com/5c8147c9231350d8ded8875e/5c846ad47c584b9a97e70d6a_avatar-3.png",
                                "https://uploads-ssl.webflow.com/5c8147c9231350d8ded8875e/5c846ad47c584b9a97e70d6a_avatar-3.png",
                                "https://uploads-ssl.webflow.com/5c8147c9231350d8ded8875e/5c846ad47c584b9a97e70d6a_avatar-3.png",
                                "https://uploads-ssl.webflow.com/5c8147c9231350d8ded8875e/5c846ad47c584b9a97e70d6a_avatar-3.png",
                                "https://uploads-ssl.webflow.com/5c8147c9231350d8ded8875e/5c846ad47c584b9a97e70d6a_avatar-3.png"
                              ].map(p => (
                                <Avatar
                                  alt="photo"
                                  src={p}
                                  className={classes.avatar}
                                  onClick={() =>
                                    this.setState({ openPhoto: true, url: p })
                                  }
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))
        ) : (
          <h3>WITHOUT DEFICIENCIES</h3>
        )}
      </div>
    );
  }

  getInfoSpan = async span => {
    const response = await this.props.getSpan(
      this.props.projectId,
      span.id,
      false
    );
    let color = "";
    if (span.state_id !== 1) color = "gray";
    else {
      const items = response.data.items.filter(
        ({ deficiencies }) => deficiencies.length > 0
      );
      if (items.length > 0) {
        const deficienciesEmergency = items.filter(({ deficiencies }) => {
          return deficiencies.find(({ emergency }) => emergency) !== undefined;
        });
        color = deficienciesEmergency.length === 0 ? "orange" : "red";
      } else color = "green";
    }
    return {
      id: span.id,
      link: `/projects/${this.props.projectId}/spans/${span.id}`,
      name: span.number,
      items: response.data.items,
      categories: response.data.inspection.categories,
      color
    };
  };

  getLayers = async () => {
    let features = await Promise.all(
      this.props.spans.map(async span => {
        const info = await this.getInfoSpan(span);
        return {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [span.coordinates[0], span.coordinates[1]]
          },
          properties: info
        };
      })
    );
    this.map.addLayer({
      id: "span",
      type: "line",
      source: {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: features
        }
      },
      layout: {
        "line-join": "round",
        "line-cap": "round"
      },
      paint: {
        "line-color": {
          type: "identity",
          property: "color"
        },
        "line-width": 5
      }
    });

    this.map.on("mouseenter", "span", e => {
      this.map.getCanvas().style.cursor = "pointer";
    });
    this.map.on("mouseleave", "span", e => {
      this.map.getCanvas().style.cursor = "";
    });
    this.map.on("click", "span", async e => {
      const span = e.features[0];
      const spanId = span.properties.id;
      const number = span.properties.name;
      if ([3, 4].includes(this.state.itemValue)) {
        this.setState({ span: { id: spanId, number } });
      } else {
        this.formatterInfo(
          JSON.parse(span.properties.items),
          JSON.parse(span.properties.categories)
        );
        this.setState({ marker: span, open: true });
      }
    });
  };

  getInfoStructure = async structure => {
    const response = await this.props.getStructure(
      this.props.projectId,
      structure.id,
      false
    );
    let color = "";
    if (structure.state_id !== 1) {
      color = "gray";
    } else {
      const items = response.data.items.filter(
        ({ deficiencies }) => deficiencies.length > 0
      );
      if (items.length > 0) {
        const deficienciesEmergency = items.filter(({ deficiencies }) => {
          return deficiencies.find(({ emergency }) => emergency) !== undefined;
        });
        color = deficienciesEmergency.length === 0 ? "orange" : "red";
      } else {
        color = "green";
      }
    }
    return {
      id: structure.id,
      link: `/projects/${this.props.projectId}/structures/${structure.id}`,
      name: structure.name,
      items: response.data.items,
      categories: response.data.inspection.categories,
      color,
      iconSize: [86, 41],
      type: structure.inspection.name === "Wood Inspection" ? 1 : 2
    };
  };

  getStructures = async () => {
    const features = await Promise.all(
      this.props.structures.map(async structure => {
        const info = await this.getInfoStructure(structure);
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [structure.longitude, structure.latitude]
          },
          properties: info
        };
      })
    );

    features.forEach(marker => {
      // create a HTML element for each feature
      var el = document.createElement("img");
      if (marker.properties.color === "gray") {
        el.src =
          marker.properties.type === 1 ? woodStructureGray : steelStructureGray;
      }
      if (marker.properties.color === "green") {
        el.src =
          marker.properties.type === 1
            ? woodStructureGreen
            : steelStructureGreen;
      }
      if (marker.properties.color === "orange") {
        el.src =
          marker.properties.type === 1
            ? woodStructureOrange
            : steelStructureOrange;
      }
      if (marker.properties.color === "red") {
        el.src =
          marker.properties.type === 1 ? woodStructureRed : steelStructureRed;
      }
      el.className = "marker";
      el.style.cursor = "pointer";
      el.style.width = marker.properties.iconSize[0] + "px";
      el.style.height = marker.properties.iconSize[1] + "px";
      // make a marker for each feature and add to the map
      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .addTo(this.map);
      el.addEventListener("click", e => {
        e.stopPropagation();
        const { id, name, items, categories } = marker.properties;
        const { itemValue, structuresSelected, addFirstStructure } = this.state;
        if (itemValue === 2) {
          if (addFirstStructure) {
            this.setState(prevState => {
              return {
                structuresSelected: {
                  ...prevState.structuresSelected,
                  first: { id, name, type: "st" }
                }
              };
            });
          } else {
            if (id !== structuresSelected.first.id) {
              this.setState(prevState => {
                return {
                  structuresSelected: {
                    ...prevState.structuresSelected,
                    second: { id, name, type: "st" }
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
          this.formatterInfo(items, categories);
          this.setState({ open: true, marker });
        }
      });
    });
  };

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
              `<div style="text-align:center"><h2 style="text-align:center">${marker.properties.name}</h3><a href='${marker.properties.link}' target='_blank' style="color: black">SEE MORE</a></div>`
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
              `<div style="text-align:center"><h2 style="text-align:center">${marker.properties.name}</h3><a href='${marker.properties.link}' target='_blank' style="color: black">SEE MORE</a></div>`
            )
        )
        .addTo(this.map);
    });
  }

  getSubstations() {
    const features = this.props.substations
      .filter(({ project_ids }) =>
        project_ids.includes(parseInt(this.props.projectId))
      )
      .map(sub => {
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [parseFloat(sub.longitude), parseFloat(sub.latitude)]
          },
          properties: {
            name: sub.name,
            id: sub.id,
            link: `/substations/${sub.id}`,
            iconSize: [30, 30]
          }
        };
      });

    features.forEach(marker => {
      // create a HTML element for each feature
      var el = document.createElement("img");
      el.src = substationImage;
      el.className = "marker";
      el.style.cursor = "pointer";
      el.style.width = marker.properties.iconSize[0] + "px";
      el.style.height = marker.properties.iconSize[1] + "px";

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
                  first: { id, name, type: "sub" }
                }
              };
            });
          } else {
            if (id !== structuresSelected.first.id) {
              this.setState(prevState => {
                return {
                  structuresSelected: {
                    ...prevState.structuresSelected,
                    second: { id, name, type: "sub" }
                  }
                };
              });
            } else {
              this.props.enqueueSnackbar("Cannot select the same substation", {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "center" }
              });
            }
          }
        } else {
          new mapboxgl.Popup()
            .setLngLat(marker.geometry.coordinates)
            .setHTML(
              `<div style="text-align:center"><h2 style="text-align:center">${marker.properties.name}</h3><a href='${marker.properties.link}' target='_blank' style="color: black">SEE MORE</a></div>`
            )
            .addTo(this.map);
        }
      });
    });
  }

  getInteractions() {
    const features = this.props.interactions.map(item => {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [item.coordinate[0], item.coordinate[1]]
        },
        properties: {
          name: item.name,
          link: `/projects/${this.props.projectId}/interactions/${item.id}`
        }
      };
    });
    features.forEach(marker => {
      // create a HTML element for each feature
      var el = document.createElement("i");
      el.className = `fas fa-bacon ${this.props.classes.interaction}`;
      // make a marker for each feature and add to the map
      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 10 }) // add popups
            .setHTML(
              `<div style="text-align:center"><h2 style="text-align:center">${marker.properties.name}</h3><a href='${marker.properties.link}' target='_blank' style="color: black">SEE MORE</a></div>`
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
    this.props.setFromMap(true);
    const { itemValue, structuresSelected, spanSelected, link } = this.state;
    if (itemValue === 2) {
      this.props.setStructures(
        structuresSelected.first.id + "-" + structuresSelected.first.type,
        structuresSelected.second.id + "-" + structuresSelected.second.type
      );
    } else {
      const { lng, lat } = this.map.getCenter();
      this.props.setPoint(lat, lng);
      if ([3, 4].includes(itemValue)) this.props.setSpan(spanSelected);
    }
    this.props.history.push(link);
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
              <p className={classes.paragraph}>CONFIRM THE STR/SUB?</p>
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
                - Selected str/sub start: {structuresSelected.first.name}
              </p>
            ) : null}
            {structuresSelected.second.id ? (
              <p className={classes.paragraph}>
                {" "}
                - Selected str/sub end: {structuresSelected.second.name}
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
        first: { id: "", name: "", type: "" },
        second: { id: "", name: "", type: "" }
      },
      addFirstStructure: true
    });
  }

  render() {
    const { classes, projectId, tab, type } = this.props;
    const {
      itemValue,
      spanSelected,
      span,
      structuresSelected,
      addFirstStructure,
      confirmStructures,
      open,
      marker,
      openPhoto,
      url
    } = this.state;
    return (
      <Grid style={{ height: "100%", width: "100%" }}>
        <Dialog
          open={openPhoto}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onEscapeKeyDown={() => this.setState({openPhoto: false})}
          onBackdropClick={() => this.setState({openPhoto: false})}
        >
          <DialogTitle>{""}</DialogTitle>
          <DialogContent>
            <img src={url} alt="deficiency" style={{height: 400}}/>
          </DialogContent>
        </Dialog>
        <div id="map" style={{ height: "100%", width: "100%" }}>
          {((tab === 5 && type === 1) || (tab === 4 && type === 2)) && (
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
                  <CheckCircle
                    className={classes.iconButtonMenu}
                  ></CheckCircle>
                ) : null}
              </Button>
              {type === 1 && (
                <Button
                  variant="outlined"
                  className={classes.buttonMenu}
                  onClick={() =>
                    this.setItem(2, `/projects/${projectId}/spans/create`)
                  }
                >
                  Add span
                  {itemValue === 2 ? (
                    <CheckCircle
                      className={classes.iconButtonMenu}
                    ></CheckCircle>
                  ) : null}
                </Button>
              )}
              { type === 1 && (
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
              )}
              { type === 1 && (
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
              )}
              <Button
                variant="outlined"
                className={classes.buttonMenu}
                onClick={() =>
                  this.setItem(5, `/projects/${projectId}/interactions/create`)
                }
              >
                Add interaction
                {itemValue === 5 ? (
                  <CheckCircle className={classes.iconButtonMenu}></CheckCircle>
                ) : null}
              </Button>
            </div>
          )}
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
                          THE SELECTED STR/SUB START:
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
                          THE SELECTED STR/SUB END:
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
          {itemValue === 1 || itemValue === 5 ? this.getDialogConfirm() : null}
          {open && (
            <div className={classes.drawer}>
              <CancelOutlined
                className={classes.close}
                onClick={() => this.setState({ open: false })}
              />
              {marker && this.getInfo(marker)}
            </div>
          )}
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
    access: state.spans.access,
    interactions: state.interactions.list,
    substations: state.substations.list,
    permissions: state.auth.permissions,
    is_superuser: state.auth.is_superuser
  };
};

const mapDispatchToProps = {
  toggleItemMenu,
  selectedItemMenu,
  fetchStructures,
  fetchSpans,
  setPoint,
  setSpan,
  setStructures,
  setFromMap,
  getStructure,
  getSpan,
  getSubstations
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(MapBox);
