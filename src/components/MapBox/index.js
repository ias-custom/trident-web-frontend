import React, { useEffect, useState } from "react";
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
import { deleteInteraction } from "../../redux/actions/interactionActions";
import {
  fetchStructures,
  getStructure,
  deleteStructure
} from "../../redux/actions/structureActions";
import {
  fetchSpans,
  setSpan,
  setStructures,
  getSpan,
  deleteSpan,
  deleteMarking,
  deleteAccess
} from "../../redux/actions/spanActions";
import {
  withStyles,
  Grid,
  Button,
  Avatar,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton
} from "@material-ui/core";
import mapboxgl from "mapbox-gl";
import {
  CheckCircle,
  CancelOutlined,
  //Edit,
  //Cancel,
  Delete
} from "@material-ui/icons";
import { withSnackbar } from "notistack";
import {
  getSubstations,
  deleteSubstation
} from "../../redux/actions/substationActions";
import substationImage from "../../img/substation.png";
import woodStructureGray from "../../img/wood_structure_gray.png";
import steelStructureGray from "../../img/steel_structure_gray.png";
import woodStructureOrange from "../../img/wood_structure_orange.png";
import steelStructureOrange from "../../img/steel_structure_orange.png";
import woodStructureRed from "../../img/wood_structure_red.png";
import steelStructureRed from "../../img/steel_structure_red.png";
import woodStructureGreen from "../../img/wood_structure_green.png";
import steelStructureGreen from "../../img/steel_structure_green.png";
//import { CAN_ADD_STRUCTURE, CAN_ADD_SPAM } from "../../redux/permissions";
import DialogDelete from "../DialogDelete";

let map = null;
// const reactMap = React.createRef();

const MapBox = ({...props}) => {
  const [latitude, setLatitude] = useState(-11.9890777)
  const [longitude, setLongitude] = useState(-77.0838287)
  const [link, setLink] = useState("")
  const [itemValue, setItemValue] = useState(0)
  const [span, setSpan] = useState({
    id: "",
    name: ""
  })
  const [spanSelected, setSpanSelected] = useState("")
  const [structuresSelected, setStructuresSelected] = useState({
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
  })
  const [addFirstStructure, setAddFirstStructure] = useState(true)
  const [confirmStructures, setConfirmStructures] = useState(false)
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [marker, setMarker] = useState(null)
  const [open, setOpen] = useState(false)
  const [openPhoto, setOpenPhoto] = useState(false)
  const [url, setUrl] = useState("")
  const [item, setItem] = useState(null)
  const [openDelete, setOpenDelete] = useState(false)
  const [openDrawer, setOpenDrawer] = useState(true)
  const [enabledMapFirst, setEnabledMapFirst] = useState(false)
  const { classes, projectId, tab, type, enabledMap, openMenu } = props;

  if (openDrawer !== openMenu) {
    setTimeout(() => {
      if (map) {
        map.resize();
      }
    }, 190);
    setOpenDrawer(openMenu)
  }

  useEffect(() => {
    if (!enabledMapFirst && enabledMap) {
      props.getSubstations(false);
      mapboxgl.accessToken = REACT_APP_MAP_TOKEN;
      if ("geolocation" in navigator) {
        createMap()
        // FOR PAGE HTTPS
        /* navigator.geolocation.getCurrentPosition(({ coords }) => {
          setLatitude(coords.latitude)
          setLongitude(coords.longitude)
          this.createMap();
        }); */
      } else {
        createMap()
      }
      setEnabledMapFirst(enabledMap)
    }
    return () => {};
  }, []);

  function createMap() {
    map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/luiguisaenz/ck0cqa4ge03bu1cmvr30e45zs",
      center: [longitude, latitude],
      zoom: 13
    });
    // Add geolocate control to the map.
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      })
    );
    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    map.on("load", () => {
      getStructures();
      getLayers();
      getMarkings();
      getAccess();
      getInteractions();
      getSubstations();
      map.on("click", ({ lngLat }) => {
        map.flyTo({ center: [lngLat.lng, lngLat.lat] });
      });
    });
  }

  function formatterInfo(items, categories) {
    const itemsFilter = items.filter(
      ({ deficiencies }) => deficiencies.length > 0
    );
    const categoriesFilter = categories.filter(({ id }) => {
      return itemsFilter.map(({ category_id }) => category_id).includes(id);
    });
    setCategories(categoriesFilter)
    setItems(itemsFilter)
  }

  async function deleteItem(){
    setOpenDelete(false)
    let response = "";
    if (
      marker.properties.itemName === "Structure" ||
      marker.properties.itemName === "Span" ||
      marker.properties.itemName === "Interaction"
    ) {
      response = await marker.properties.delete(
        props.projectId,
        marker.properties.id
      );
    }
    if (
      marker.properties.itemName === "Crossing" ||
      marker.properties.itemName === "Access"
    ) {
      response = await marker.properties.delete(
        marker.properties.span_id,
        marker.properties.id
      );
    }
    if (marker.properties.itemName === "Substation") {
      response = await marker.properties.delete(marker.properties.id);
    }
    if (response.status === 204) {
      item.remove();
      setOpen(false)
      props.enqueueSnackbar(
        `¡${marker.properties.itemName} removed succesfully!`,
        {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "center" }
        }
      );
    } else {
      props.enqueueSnackbar("The request could not be processed",
        {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" }
        }
      );
    }
  };

  function getInfo(marker) {
    return (
      <div className={classes.divInfo}>
        <a
          href={marker.properties.link}
          className={classes.link}
          target={"_blank"}
        >
          <h3>{marker.properties.number}</h3>
        </a>
        <Grid container justify="center">
          <IconButton
            aria-label="Delete"
            className={classes.iconDelete}
            onClick={() => setOpenDelete(true)}
          >
            <Delete />
          </IconButton>
        </Grid>
        { (marker.properties.itemName === "Structure" || marker.properties.itemName === "Span") ? (
          items.length > 0 ? (
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
                            <div key={d.id}>
                              <p>
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
                                {d.photos.map(p => (
                                  <Avatar
                                    alt="photo"
                                    src={p.thumbnail}
                                    key={p.id}
                                    className={classes.avatar}
                                    onClick={() => {
                                      setOpenPhoto(true)
                                      setUrl(p.photo)
                                    }}
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
          )
        ) : null}
      </div>
    );
  }

  async function getInfoSpan(span){
    const response = await props.getSpan(
      projectId,
      span.id,
      false
    );
    let color = "";
    if (span.state_id !== 1) color = "#a9aaae";
    else {
      const items = response.data.items.filter(
        ({ deficiencies }) => deficiencies.length > 0
      );
      if (items.length > 0) {
        const deficienciesEmergency = items.filter(({ deficiencies }) => {
          return deficiencies.find(({ emergency }) => emergency) !== undefined;
        });
        color = deficienciesEmergency.length === 0 ? "#f28534" : "#ed4f36";
      } else color = "#5db454";
    }
    return {
      id: span.id,
      itemName: "Span",
      link: `/projects/${projectId}/spans/${span.id}`,
      delete: props.deleteSpan,
      number: span.number,
      items: response.data.items,
      categories: response.data.inspection.categories,
      color
    };
  };

  async function getLayers(){
    let features = await Promise.all(
      props.spans.map(async span => {
        const info = await getInfoSpan(span);
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
    map.addLayer({
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

    map.on("mouseenter", "span", e => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "span", e => {
      map.getCanvas().style.cursor = "";
    });
    map.on("click", "span", async e => {
      const span = e.features[0];
      const spanId = span.properties.id;
      const number = span.properties.number;
      if ([3, 4].includes(itemValue)) {
        setSpan({ id: spanId, number })
      } else {
        formatterInfo(
          JSON.parse(span.properties.items),
          JSON.parse(span.properties.categories)
        );
        setMarker(span)
        setOpen(true)
      }
    });
  };

  async function getInfoStructure(structure) {
    const response = await props.getStructure(
      projectId,
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
      itemName: "Structure",
      link: `/projects/${projectId}/structures/${structure.id}`,
      delete: props.deleteStructure,
      number: structure.number,
      items: response.data.items,
      categories: response.data.inspection.categories,
      color,
      iconSize: [100, 60],
      type: structure.inspection.name === "Wood Inspection" ? 1 : 2
    };
  };

  async function getStructures(){
    const features = await Promise.all(
      props.structures.map(async structure => {
        const info = await getInfoStructure(structure);
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
      //el.style.width = marker.properties.iconSize[0] + "px";
      //el.style.height = marker.properties.iconSize[1] + "px";
      // make a marker for each feature and add to the map
      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);
      el.addEventListener("click", e => {
        e.stopPropagation();
        const { id, number, items, categories } = marker.properties;
        if (itemValue === 2) {
          if (addFirstStructure) {
            setStructuresSelected({
              first: { id, number, type: "st" },
              second: { id: "", number: "", type: ""}
            })
          } else {
            if (id !== structuresSelected.first.id) {
              setStructuresSelected({
                first: structuresSelected.first,
                second: { id, number, type: "st" }
              })
            } else {
              props.enqueueSnackbar("Cannot select the same structure", {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "center" }
              });
            }
          }
        } else {
          formatterInfo(items, categories);
          setMarker(marker)
          setItem(el)
          setOpen(true)
        }
      });
    });
  };

  function getMarkings() {
    const features = props.markings.map(marking => {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [marking.coordinate[0], marking.coordinate[1]]
        },
        properties: {
          number: marking.notes,
          itemName: "Crossing",
          delete: props.deleteMarking,
          id: marking.id,
          span_id: marking.span_id,
          link: `/projects/${projectId}/spans/${marking.span_id}?marking=true&id=${marking.id}`
        }
      };
    });

    features.forEach(marker => {
      // create a HTML element for each feature
      var el = document.createElement("i");
      el.className = `fab fa-bandcamp ${classes.marking}`;
      // make a marker for each feature and add to the map
      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);
        el.addEventListener("click", e => {
          e.stopPropagation();
          formatterInfo([], []);
          setMarker(marker)
          setItem(el)
          setOpen(true)
        });
    });
  }

  function getAccess() {
    const features = props.access.map(a => {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [a.coordinate[0], a.coordinate[1]]
        },
        properties: {
          number: a.notes,
          itemName: "Access",
          id: a.id,
          span_id: a.span_id,
          delete: props.deleteAccess,
          link: `/projects/${projectId}/spans/${a.span_id}?access=true&id=${a.id}`
        }
      };
    });

    features.forEach(marker => {
      // create a HTML element for each feature
      var el = document.createElement("i");
      el.className = `fab fa-confluence ${classes.access}`;
      // make a marker for each feature and add to the map
      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);

      el.addEventListener("click", e => {
        e.stopPropagation();
        formatterInfo([], []);
        setMarker(marker)
        setItem(el)
        setOpen(true)
      });
    });
  }

  function getSubstations() {
    const features = props.substations
      .filter(({ project_ids }) =>
        project_ids.includes(parseInt(projectId))
      )
      .map(sub => {
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [parseFloat(sub.longitude), parseFloat(sub.latitude)]
          },
          properties: {
            number: sub.number,
            itemName: "Substation",
            delete: props.deleteSubstation,
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
        .addTo(map);
      el.addEventListener("click", e => {
        e.stopPropagation();
        const { id, number } = marker.properties;
        const { itemValue, structuresSelected, addFirstStructure } = this.state;
        if (itemValue === 2) {
          if (addFirstStructure) {
            setStructuresSelected({
              first: { id, number, type: "sub" },
              second: { id: "", number: "", type: ""}
            })
          } else {
            if (id !== structuresSelected.first.id) {
              setStructuresSelected({
                first: structuresSelected.first,
                second: { id, number, type: "sub" }
              })
            } else {
              props.enqueueSnackbar("Cannot select the same substation", {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "center" }
              });
            }
          }
        } else {
          el.addEventListener("click", e => {
            e.stopPropagation();
            formatterInfo([], []);
            setMarker(marker)
            setItem(el)
            setOpen(true)
          });
        }
      });
    });
  }

  function getInteractions() {
    const features = props.interactions.map(item => {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [parseFloat(item.longitude), parseFloat(item.latitude)]
        },
        properties: {
          number: item.name,
          id: item.id,
          itemName: "Interaction",
          delete: props.deleteInteraction,
          link: `/projects/${projectId}/interactions/${item.id}`
        }
      };
    });
    features.forEach(marker => {
      // create a HTML element for each feature
      var el = document.createElement("i");
      el.className = `fas fa-bacon ${classes.interaction}`;
      // make a marker for each feature and add to the map
      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);
      el.addEventListener("click", e => {
        e.stopPropagation();
        formatterInfo([], []);
        setMarker(marker)
        setItem(el)
        setOpen(true)
      });
    });
  }

  function setItemSelected(value, link) {
    setItemValue(value)
    setLink(link)
    setSpan({
      id: "",
      name: ""
    })
    setSpanSelected("")
    setStructuresSelected({
      first: {
        id: "",
        name: ""
      },
      second: {
        id: "",
        name: ""
      }
    })
  }

  function confirmAddItem() {
    // CALL TO DISPATCH TO SET LAT AND LNG
    props.setFromMap(true);
    if (itemValue === 2) {
      props.setStructures(
        structuresSelected.first.id + "-" + structuresSelected.first.type,
        structuresSelected.second.id + "-" + structuresSelected.second.type
      );
    } else {
      const { lng, lat } = map.getCenter();
      props.setPoint(lat, lng);
      if ([3, 4].includes(itemValue)) props.setSpan(spanSelected);
    }
    props.history.push(link);
  }

  function getDialogConfirm() {
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
                - Selected str/sub start: {structuresSelected.first.number}
              </p>
            ) : null}
            {structuresSelected.second.id ? (
              <p className={classes.paragraph}>
                {" "}
                - Selected str/sub end: {structuresSelected.second.number}
              </p>
            ) : null}
            <div>
              <Button
                variant="outlined"
                className={classes.buttonCancel}
                onClick={() =>{
                  setItemValue(0)
                  setLink("")
                  setSpanSelected("")
                  setAddFirstStructure(true)
                }
                }
              >
                Cancel
              </Button>
              <Button
                style={{ marginLeft: 10 }}
                variant="outlined"
                className={classes.buttonAccept}
                onClick={() => confirmAddItem()}
              >
                Yes, I sure
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function cancelAddMarkingOrAccess() {
    setItemValue(0)
    setLink("")
    setSpanSelected("")
    setSpan({ id: "", number: "" })
  }

  function cancelAddSpan() {
    setItemValue(0)
    setLink("")
    setStructuresSelected({
      first: { id: "", name: "", type: "" },
      second: { id: "", name: "", type: "" }
    })
    setAddFirstStructure(true)
  }

  return (
    <Grid style={{ height: "100%", width: "100%" }}>
      {openDelete && (
        <DialogDelete
          item={marker.properties.itemName.toLowerCase()}
          open={openDelete}
          closeModal={() => setOpenDelete(false)}
          remove={deleteItem}
        />
      )}
      <Dialog
        open={openPhoto}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onEscapeKeyDown={() => setOpenPhoto(false)}
        onBackdropClick={() => setOpenPhoto(false)}
      >
        <DialogTitle>{""}</DialogTitle>
        <DialogContent>
          <img src={url} alt="deficiency" style={{ height: 400 }} />
        </DialogContent>
      </Dialog>
      <div id="map" style={{ height: "100%", width: "100%" }}>
        {((tab === 5 && type === 1) || (tab === 4 && type === 2)) && (
          <div className={classes.divMenu}>
            <Button
              variant="outlined"
              className={classes.buttonMenu}
              onClick={() =>
                setItemSelected(1, `/projects/${projectId}/structures/create`)
              }
            >
              Add structure
              {itemValue === 1 ? (
                <CheckCircle className={classes.iconButtonMenu}></CheckCircle>
              ) : null}
            </Button>
            {type === 1 && (
              <Button
                variant="outlined"
                className={classes.buttonMenu}
                onClick={() =>
                  setItemSelected(2, `/projects/${projectId}/spans/create`)
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
            {type === 1 && (
              <Button
                variant="outlined"
                className={classes.buttonMenu}
                onClick={() => {
                  setItemSelected(3, `/projects/${projectId}/markings/create`);
                }}
              >
                Add marking
                {itemValue === 3 ? (
                  <CheckCircle
                    className={classes.iconButtonMenu}
                  ></CheckCircle>
                ) : null}
              </Button>
            )}
            {type === 1 && (
              <Button
                variant="outlined"
                className={classes.buttonMenu}
                onClick={() =>
                  setItemSelected(4, `/projects/${projectId}/access/create`)
                }
              >
                Add access
                {itemValue === 4 ? (
                  <CheckCircle
                    className={classes.iconButtonMenu}
                  ></CheckCircle>
                ) : null}
              </Button>
            )}
            <Button
              variant="outlined"
              className={classes.buttonMenu}
              onClick={() =>
                setItemSelected(5, `/projects/${projectId}/interactions/create`)
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
              getDialogConfirm()
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
                          ? structuresSelected.first.number
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
                          ? structuresSelected.second.number
                          : "Not selected"}
                      </p>
                    </div>
                  )}
                  <div>
                    <Button
                      variant="outlined"
                      className={classes.buttonCancel}
                      onClick={() => cancelAddSpan()}
                    >
                      Cancel
                    </Button>
                    <Button
                      style={{ marginLeft: 10 }}
                      variant="outlined"
                      className={classes.buttonAccept}
                      onClick={() => {
                        if (addFirstStructure) {
                          setAddFirstStructure(false)
                        } else {
                          setConfirmStructures(true)
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
              getDialogConfirm()
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
                      onClick={() => cancelAddMarkingOrAccess()}
                    >
                      Cancel
                    </Button>
                    <Button
                      style={{ marginLeft: 10 }}
                      variant="outlined"
                      className={classes.buttonAccept}
                      onClick={() => {
                        setSpanSelected(span.id)
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
        {itemValue === 1 || itemValue === 5 ? getDialogConfirm() : null}
        {open && (
          <div className={classes.drawer}>
            <CancelOutlined
              className={classes.close}
              onClick={() => setOpen(false)}
            />
            {marker && getInfo(marker)}
          </div>
        )}
      </div>
    </Grid>
  );
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
  getSubstations,
  deleteStructure,
  deleteSpan,
  deleteMarking,
  deleteSubstation,
  deleteAccess,
  deleteInteraction
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(MapBox);
