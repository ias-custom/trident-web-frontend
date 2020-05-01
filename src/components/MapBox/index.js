import React, { useEffect, useState } from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { REACT_APP_MAP_TOKEN } from "../../config/environment";
import styles from "./styles";
import {
  toggleItemMenu,
  selectedItemMenu,
} from "../../redux/actions/layoutActions";
import { setPoint, setFromMap } from "../../redux/actions/projectActions";
import { deleteInteraction } from "../../redux/actions/interactionActions";
import {
  fetchStructures,
  getStructure,
  deleteStructure,
} from "../../redux/actions/structureActions";
import {
  fetchSpans,
  setSpan,
  setStructures,
  getSpan,
  deleteSpan,
  deleteMarking,
  deleteAccess,
} from "../../redux/actions/spanActions";
import { withStyles, Grid } from "@material-ui/core";
import mapboxgl from "mapbox-gl";
import { withSnackbar } from "notistack";
import {
  getSubstations,
  deleteSubstation,
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
import { useStateAndRef } from "../../hooks/Shared";
import { ShowPhoto, ShowInfoMap, ButtonsMap, MenuMap } from "..";
import DialogAddItemMap from "../DialogAddItemMap";

let map = null;
// const reactMap = React.createRef();

const MapBox = ({ ...props }) => {
  /* const [latitude, setLatitude] = useState(-11.9890777);
  const [longitude, setLongitude] = useState(-77.0838287); */
  const [link, setLink] = useState("");
  const [itemValue, setItemValue, itemValueRef] = useStateAndRef(0);
  const [span, setSpan] = useState({
    id: "",
    name: "",
  });
  const [spanSelected, setSpanSelected] = useState("");
  const [
    structuresSelected,
    setStructuresSelected,
    structuresSelectedRef,
  ] = useStateAndRef({
    first: {
      id: "",
      name: "",
      type: "",
    },
    second: {
      id: "",
      name: "",
      type: "",
    },
  });
  const [
    addFirstStructure,
    setAddFirstStructure,
    addFirstStructureRef,
  ] = useStateAndRef(true);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [marker, setMarker] = useState(null);
  const [open, setOpen] = useState(false);
  const [openPhoto, setOpenPhoto] = useState(false);
  const [url, setUrl] = useState("");
  const [item, setItem] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(true);
  const [enabledMapFirst, setEnabledMapFirst] = useState(false);
  const {
    classes,
    projectId,
    tab,
    type,
    enabledMap,
    openMenu,
    maxDistance,
    center,
    isDashboard,
  } = props;

  if (openDrawer !== openMenu) {
    setTimeout(() => {
      if (map) {
        map.resize();
      }
    }, 190);
    setOpenDrawer(openMenu);
  }
  useEffect(() => {
    if (!enabledMapFirst && enabledMap) {
      mapboxgl.accessToken = REACT_APP_MAP_TOKEN;
      if ("geolocation" in navigator) {
        createMap();
        // FOR PAGE HTTPS
        /* navigator.geolocation.getCurrentPosition(({ coords }) => {
        setLatitude(coords.latitude)
        setLongitude(coords.longitude)
        this.createMap();
      }); */
      } else {
        createMap();
      }
      setEnabledMapFirst(enabledMap);
    }
    return () => {};
  }, []);

  function createMap() {
    const coordinates = props.structures
      .concat(props.spans)
      .concat(props.access)
      .concat(props.markings)
      .concat(props.interactions)
      .concat(
        props.substations.map(({ coordinate }) => {
          return { longitude: coordinate[0], latitude: coordinate[1] };
        })
      )
      .map(({ latitude, longitude }) => [longitude, latitude]);
    /* console.log(coordinates);
    console.log(
      coordinates.reduce((totalLat, coord) => {
        return totalLat + Number(coord[0]);
      }, 0) / coordinates.length,
      coordinates.reduce((totalLat, coord) => {
        return totalLat + Number(coord[1]);
      }, 0) / coordinates.length
    ); */
    let zoom = 0;
    if (maxDistance <= 1) {
      zoom = 15;
    }
    if (maxDistance > 1 && maxDistance < 5) {
      zoom = 13;
    }
    /* if (maxDistance > 3 && maxDistance <= 5) {
      zoom = 12;
    } */
    if (maxDistance > 5 && maxDistance <= 10) {
      zoom = 10;
    }
    if (maxDistance > 10 && maxDistance <= 50) {
      zoom = 9;
    }
    if (maxDistance > 50 && maxDistance <= 100) {
      zoom = 8;
    }
    if (maxDistance > 100 && maxDistance <= 200) {
      zoom = 7;
    }
    if (maxDistance > 200 && maxDistance <= 300) {
      zoom = 6;
    }
    if (maxDistance > 300 && maxDistance <= 700) {
      zoom = 5;
    }
    if (maxDistance > 700 && maxDistance <= 1100) {
      zoom = 4;
    }
    if (maxDistance > 1100 && maxDistance <= 2500) {
      zoom = 3;
    }
    if (maxDistance > 2500) {
      zoom = 1;
    }
    if (map) map.remove();
    map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/luiguisaenz/ck0cqa4ge03bu1cmvr30e45zs",
      center:
        coordinates.length > 0
          ? center
          : [-102.36945144162411, 41.08492193802903],
      zoom: coordinates.length > 0 ? zoom : 3,
    });
    // Add geolocate control to the map.
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
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
  // GET AND FORMATTED DATA
  async function getInfoSpan(span) {
    const response = await props.getSpan(span.project_id, span.id, false);
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
      link: `/projects/${span.project_id}/spans/${span.id}`,
      delete: props.deleteSpan,
      number: span.number,
      items: response.data.items,
      categories: response.data.inspection.categories,
      color,
    };
  }

  async function getLayers() {
    if (map.getLayer("span")) {
      map.removeLayer("span")
      map.removeSource("span")
    }
    let features = await Promise.all(
      props.spans
        .filter(({ id }) => id !== (marker ? marker.properties.id : 0)) // FOR HIDE SPAN SELECTED FOR DELETE
        .map(async (span) => {
          const info = await getInfoSpan(span);
          return {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [span.coordinates[0], span.coordinates[1]],
            },
            properties: info,
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
          features: features,
        },
      },
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": {
          type: "identity",
          property: "color",
        },
        "line-width": 5,
      },
    });

    map.on("mouseenter", "span", (e) => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "span", (e) => {
      map.getCanvas().style.cursor = "";
    });
    map.on("click", "span", async (e) => {
      const span = e.features[0];
      const spanId = span.properties.id;
      const number = span.properties.number;
      if ([3, 4].includes(itemValueRef.current)) {
        setSpan({ id: spanId, number });
      } else {
        formatterInfo(
          JSON.parse(span.properties.items),
          JSON.parse(span.properties.categories)
        );
        setMarker(span);
        setOpen(true);
      }
    });
  }

  async function getInfoStructure(structure) {
    const response = await props.getStructure(
      structure.project_id,
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
      link: `/projects/${structure.project_id}/structures/${structure.id}`,
      delete: props.deleteStructure,
      number: structure.number,
      items: response.data.items,
      categories: response.data.inspection
        ? response.data.inspection.categories
        : [],
      color,
      iconSize: [100, 60],
      type: structure.inspection
        ? structure.inspection.name === "Wood Inspection"
          ? 1
          : 2
        : "",
    };
  }

  async function getStructures() {
    const features = await Promise.all(
      props.structures.map(async (structure) => {
        const info = await getInfoStructure(structure);
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [structure.longitude, structure.latitude],
          },
          properties: info,
        };
      })
    );
    features.forEach((marker) => {
      // create a HTML element for each feature
      var el = "";
      if (marker.properties.type === "") {
        el = document.createElement("i");
        el.className = "fas fa-broadcast-tower";
        el.style.fontSize = "25px";
      } else {
        el = document.createElement("img");
        el.className = "marker";
        if (marker.properties.color === "gray") {
          el.src =
            marker.properties.type === 1
              ? woodStructureGray
              : steelStructureGray;
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
      }
      el.style.cursor = "pointer";

      //el.style.width = marker.properties.iconSize[0] + "px";
      //el.style.height = marker.properties.iconSize[1] + "px";
      // make a marker for each feature and add to the map
      new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map);

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const { id, number, items, categories } = marker.properties;
        if (itemValueRef.current === 2) {
          if (addFirstStructureRef.current) {
            setStructuresSelected({
              first: { id, number, type: "st" },
              second: { id: "", number: "", type: "" },
            });
          } else {
            if (id !== structuresSelectedRef.current.first.id) {
              setStructuresSelected({
                first: structuresSelectedRef.current.first,
                second: { id, number, type: "st" },
              });
            } else {
              props.enqueueSnackbar("Cannot select the same structure", {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "center" },
              });
            }
          }
        } else {
          formatterInfo(items, categories);
          setMarker(marker);
          setItem(el);
          setOpen(true);
        }
      });
    });
  }

  function getMarkings() {
    const features = props.markings.map((marking) => {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [marking.coordinate[0], marking.coordinate[1]],
        },
        properties: {
          number: marking.notes,
          itemName: "Crossing",
          delete: props.deleteMarking,
          id: marking.id,
          span_id: marking.span_id,
          link: `/projects/${marking.project_id || projectId}/crossings/${
            marking.id
          }`,
        },
      };
    });

    features.forEach((marker) => {
      // create a HTML element for each feature
      var el = document.createElement("i");
      el.className = `fab fa-bandcamp ${classes.marking}`;
      // make a marker for each feature and add to the map
      new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map);
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        formatterInfo([], []);
        setMarker(marker);
        setItem(el);
        setOpen(true);
      });
    });
  }

  function getAccess() {
    const features = props.access.map((a) => {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [a.coordinate[0], a.coordinate[1]],
        },
        properties: {
          number: a.notes,
          itemName: "Access",
          id: a.id,
          span_id: a.span_id,
          delete: props.deleteAccess,
          link: `/projects/${a.project_id || projectId}/access/${a.id}`,
        },
      };
    });

    features.forEach((marker) => {
      // create a HTML element for each feature
      var el = document.createElement("i");
      el.className = `fab fa-confluence ${classes.access}`;
      // make a marker for each feature and add to the map
      new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map);

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        formatterInfo([], []);
        setMarker(marker);
        setItem(el);
        setOpen(true);
      });
    });
  }

  function getSubstations() {
    const features = props.substations.map((sub) => {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: sub.coordinate,
        },
        properties: {
          number: sub.number,
          itemName: "Substation",
          delete: props.deleteSubstation,
          id: sub.id,
          link: `/substations/${sub.id}`,
          iconSize: [30, 30],
        },
      };
    });

    features.forEach((marker) => {
      // create a HTML element for each feature
      var el = document.createElement("img");
      el.src = substationImage;
      el.className = "marker";
      el.style.cursor = "pointer";
      el.style.width = marker.properties.iconSize[0] + "px";
      el.style.height = marker.properties.iconSize[1] + "px";

      // make a marker for each feature and add to the map
      new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map);
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const { id, number } = marker.properties;
        if (itemValueRef.current === 2) {
          if (addFirstStructure) {
            setStructuresSelected({
              first: { id, number, type: "sub" },
              second: { id: "", number: "", type: "" },
            });
          } else {
            if (id !== structuresSelectedRef.current.first.id) {
              setStructuresSelected({
                first: structuresSelectedRef.current.first,
                second: { id, number, type: "sub" },
              });
            } else {
              props.enqueueSnackbar("Cannot select the same substation", {
                variant: "error",
                anchorOrigin: { vertical: "top", horizontal: "center" },
              });
            }
          }
        } else {
          el.addEventListener("click", (e) => {
            e.stopPropagation();
            formatterInfo([], []);
            setMarker(marker);
            setItem(el);
            setOpen(true);
          });
        }
      });
    });
  }

  function getInteractions() {
    const features = props.interactions.map((item) => {
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [parseFloat(item.longitude), parseFloat(item.latitude)],
        },
        properties: {
          number: item.name,
          id: item.id,
          itemName: "Interaction",
          delete: props.deleteInteraction,
          link: `/projects/${item.project_id || projectId}/interactions/${
            item.id
          }`,
        },
      };
    });
    features.forEach((marker) => {
      // create a HTML element for each feature
      var el = document.createElement("i");
      el.className = `fas fa-bacon ${classes.interaction}`;
      // make a marker for each feature and add to the map
      new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map);
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        formatterInfo([], []);
        setMarker(marker);
        setItem(el);
        setOpen(true);
      });
    });
  }

  // ACTIONS
  async function deleteItem() {
    setOpenDelete(false);
    let response = "";
    if (marker.properties.itemName === "Span") {
      response = await props.deleteSpan(props.projectId, marker.properties.id);
    }
    if (
      marker.properties.itemName === "Structure" ||
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
      if (marker.properties.itemName === "Span") {
        getLayers();
      } else {
        item.remove();
      }
      setOpen(false);
      props.enqueueSnackbar(
        `¡${marker.properties.itemName} removed succesfully!`,
        {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "center" },
        }
      );
    } else {
      props.enqueueSnackbar("The request could not be processed", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
    }
  }

  function formatterInfo(items, categories) {
    const itemsFilter = items.filter(
      ({ deficiencies }) => deficiencies.length > 0
    );
    const categoriesFilter = categories.filter(({ id }) => {
      return itemsFilter.map(({ category_id }) => category_id).includes(id);
    });
    setCategories(categoriesFilter);
    setItems(itemsFilter);
  }

  function setItemSelected(value, link) {
    setItemValue(value);
    setLink(link);
    setSpan({
      id: "",
      name: "",
    });
    setSpanSelected("");
    setStructuresSelected({
      first: {
        id: "",
        name: "",
      },
      second: {
        id: "",
        name: "",
      },
    });
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

  function cancelAddMarkingOrAccess() {
    setItemValue(0);
    setLink("");
    setSpanSelected("");
    setSpan({ id: "", number: "" });
  }

  function cancelAddSpan() {
    setItemValue(0);
    setLink("");
    setStructuresSelected({
      first: { id: "", name: "", type: "" },
      second: { id: "", name: "", type: "" },
    });
    setAddFirstStructure(true);
  }

  return (
    <Grid style={{ height: "100%", width: "100%" }}>
      {openDelete && (
        <DialogDelete
          item={marker.properties.itemName.toLowerCase()}
          open={openDelete}
          closeModal={() => setOpenDelete(false)}
          remove={() => deleteItem()}
        />
      )}

      <ShowPhoto
        url={url}
        open={openPhoto}
        closeDialog={() => setOpenPhoto(false)}
      />

      <div id="map" style={{ height: "100%", width: "100%" }}>
        {/* FOR SHOW BUTTONS ACTIONS */}
        {!isDashboard && (
          <ButtonsMap
            tab={tab}
            type={type}
            itemValue={itemValue}
            addItem={(value, link) => {
              setOpen(false);
              setItemSelected(value, link);
            }}
            projectId={projectId}
          />
        )}

        {!isDashboard && (
          <DialogAddItemMap
            itemValue={itemValue}
            cancelAddItem={() => {
              setItemValue(0);
              setLink("");
              setSpanSelected("");
              setAddFirstStructure(true);
            }}
            confirmAddItem={confirmAddItem}
            cancelAddSpan={cancelAddSpan}
            cancelAddMarkingOrAccess={cancelAddMarkingOrAccess}
            setSpanSelected={(id) => setSpanSelected(id)}
            structuresSelected={structuresSelected}
            addFirstStructure={addFirstStructure}
            spanSelected={spanSelected}
            span={span}
            setAddFirstStructure={(value) => setAddFirstStructure(value)}
          />
        )}

        {/* FOR SHOW RIGHT INFO */}
        <ShowInfoMap
          open={open}
          marker={marker}
          categories={categories}
          items={items}
          closeInfo={() => setOpen(false)}
          openDelete={() => setOpenDelete(true)}
          showPhoto={(photo) => {
            setOpenPhoto(true);
            setUrl(photo);
          }}
          isDashboard={isDashboard}
        />

        {/* FOR SHOW LEFT INFO */}
        {isDashboard && <MenuMap />}
      </div>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.global.loading,
    structures: state.structures.structures,
    spans: state.spans.spans,
    markings: state.spans.markings,
    access: state.spans.access,
    interactions: state.interactions.list,
    substations: state.substations.list,
    permissions: state.auth.permissions,
    is_superuser: state.auth.is_superuser,
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
  deleteInteraction,
};

MapBox.propTypes = {
  projectId: PropTypes.number,
  tab: PropTypes.number,
  type: PropTypes.number,
};

MapBox.defaultProps = {
  projectId: 0,
  tab: 0,
  type: 0,
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(MapBox);
