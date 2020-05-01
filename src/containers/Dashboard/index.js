import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Select from "@material-ui/core/Select";
import { connect } from "react-redux";
import {
  withStyles,
  Input,
  Grid,
  FormControl,
  InputLabel,
  Chip,
  MenuItem,
  Checkbox,
  ListItemText,
  FormGroup,
  FormControlLabel,
  FormLabel,
  Button,
  Typography,
} from "@material-ui/core";
import { withSnackbar } from "notistack";
import { withRouter } from "react-router-dom";
import styles from "./styles";
import { compose } from "recompose";
import { Layout, SimpleBreadcrumbs, Panel, MapBox } from "../../components";
import {
  setEmptyMap,
  fetchInfoCustomer,
} from "../../redux/actions/globalActions";
import { selectedItemMenu } from "../../redux/actions/layoutActions";
import _ from "lodash";
import { SearchOutlined } from "@material-ui/icons";

let timeOut = null;

const Dashboard = ({ ...props }) => {
  const breadcrumbs = [
    { name: "Home", to: "/home" },
    { name: " Utility Dashboard", to: null },
  ];
  const itemsGeneral = [
    "structures",
    "spans",
    "substastions",
    "crossings",
    "access",
    "interactions",
  ];
  const [items, setItems] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [deficienciesList, setDeficienciesList] = useState(["true", "false"]);
  const [enabledMap, setEnabledMap] = useState(false);
  const [maxDistance, setMaxDistance] = useState(1200);
  const [center, setCenter] = useState([
    -102.36945144162411,
    41.08492193802903,
  ]);
  const {
    classes,
    loading,
    enqueueSnackbar,
    setEmptyMap,
    fetchInfoCustomer,
  } = props;

  useEffect(() => {
    setEmptyMap();
    setEnabledMap(true);
    const nameItem = "dashboard";
    const nameSubItem = "main";
    props.selectedItemMenu({ nameItem, nameSubItem });
    return () => {};
  }, []);

  function getItems() {
    clearTimeout(timeOut);
    timeOut = setTimeout(async () => {
      setEnabledMap(false);
      if (statusList.length === 0) {
        setEmptyMap();
        setEnabledMap(true);
        return;
      }
      if (typeList.length === 0) {
        setEmptyMap();
        setEnabledMap(true);
        return;
      }
      if (items.length === 0) {
        setEmptyMap();
        setEnabledMap(true);
        return;
      }
      const response = await fetchInfoCustomer(
        statusList.join(","),
        typeList.join(","),
        items.join(","),
        deficienciesList.join(",")
      );
      if (response.status !== 200) {
        setEmptyMap();
        enqueueSnackbar("The request could not be processed", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" },
        });
      } else {
        console.log(response.data);
        const { coordinate_center, max_distance } = response.data;
        if (coordinate_center) {
          setCenter(coordinate_center);
          setMaxDistance(max_distance);
        }
      }
      setEnabledMap(true);
    }, 500);
  }

  function changeStatus(status) {
    let newList = statusList.includes(status)
      ? statusList.filter((s) => s !== status)
      : statusList.concat(status);
    setStatusList(newList);
    //getItems(newList, typeList, items, deficienciesList);
  }

  function changeType(type) {
    let newList = typeList.includes(type)
      ? typeList.filter((s) => s !== type)
      : typeList.concat(type);
    setTypeList(newList);
    //getItems(statusList, newList, items, deficienciesList);
  }

  function changeItems(newItems) {
    if (newItems.length > 0) {
      if (
        _.difference(newItems, items).length > 0 ||
        newItems.length < items.length
      ) {
        if (newItems.includes("spans") && !newItems.includes("structures")) {
          newItems.push("structures");
        }
        setItems(newItems);
        //getItems(statusList, typeList, newItems, deficienciesList);
      }
    } else {
      setItems([]);
      //getItems(statusList, typeList, [], deficienciesList);
    }
  }

  function changeDeficiencie(newValue) {
    let newList = deficienciesList.includes(newValue)
      ? deficienciesList.filter((d) => d !== newValue)
      : deficienciesList.concat(newValue);
    if (newList.length === 0) {
      enqueueSnackbar("Opps! At least one must be selected", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
      return;
    }
    setDeficienciesList(newList);
    //getItems(statusList, typeList, items, newList);
  }

  return (
    <Layout title="Utility Dashboard">
      {(openDrawer) => (
        <div>
          <SimpleBreadcrumbs
            routes={breadcrumbs}
            classes={{ root: classes.breadcrumbs }}
          />
          <Panel>
            <Grid spacing={16} container direction="row">
              <Grid item xs={3} style={{ borderRadius: 4 }}>
                <FormControl fullWidth margin="none">
                  <FormLabel component="legend">Project Status</FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={statusList.includes("active")}
                          onChange={() => changeStatus("active")}
                          value="active"
                        />
                      }
                      label="Active"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={statusList.includes("planned")}
                          onChange={() => changeStatus("planned")}
                          value="planned"
                        />
                      }
                      label="Planned"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={statusList.includes("completed")}
                          onChange={() => changeStatus("completed")}
                          value="completed"
                        />
                      }
                      label="Completed"
                    />
                  </FormGroup>
                </FormControl>
              </Grid>

              <Grid item xs={3} style={{ borderRadius: 4 }}>
                <FormControl fullWidth margin="none">
                  <FormLabel component="legend">Project Type</FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={typeList.includes("constructability")}
                          onChange={() => changeType("constructability")}
                          value="constructability"
                        />
                      }
                      label="Constructability"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={typeList.includes("construction")}
                          onChange={() => changeType("construction")}
                          value="construction"
                        />
                      }
                      label="Construction"
                    />
                  </FormGroup>
                </FormControl>
              </Grid>

              <Grid item xs={4} style={{ borderRadius: 4 }}>
                <InputLabel
                  htmlFor="select-multiple-chip"
                  style={{ fontSize: 17 }}
                >
                  Items
                </InputLabel>
                <Select
                  multiple
                  name="items"
                  value={items}
                  onChange={(e) => changeItems(e.target.value)}
                  input={<Input id="select-multiple-chip" />}
                  renderValue={(selected) => (
                    <div className={classes.chips}>
                      {selected.map((name) => (
                        <Chip
                          key={`${name}-chip`}
                          label={name}
                          className={classes.chip}
                        />
                      ))}
                    </div>
                  )}
                  fullWidth
                >
                  {itemsGeneral.map((i) => (
                    <MenuItem key={i} value={i}>
                      <Checkbox checked={!!items.find((item) => item === i)} />
                      <ListItemText primary={i} />
                    </MenuItem>
                  ))}
                </Select>
                {(items.includes("structures") || items.includes("spans")) && (
                  <FormControl
                    fullWidth
                    margin="none"
                    style={{ marginTop: 30 }}
                  >
                    <FormLabel component="legend">Spans/Structures</FormLabel>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={deficienciesList.includes("true")}
                            onChange={() => changeDeficiencie("true")}
                            value="true"
                          />
                        }
                        label="With deficiencies"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={deficienciesList.includes("false")}
                            onChange={() => changeDeficiencie("false")}
                            value="false"
                          />
                        }
                        label="Without deficiencies"
                      />
                    </FormGroup>
                  </FormControl>
                )}
              </Grid>
              <Grid container item xs={2} alignItems="center" justify="center">
                <Button
                  className={classes.buttonSearch}
                  onClick={() => getItems()}
                  disabled={loading}
                >
                  SEARCH <SearchOutlined />
                </Button>
              </Grid>
            </Grid>
          </Panel>
          <Grid
            style={{
              height: "calc(100vh - 380px)",
              marginTop: 20,
              minHeight: 500,
            }}
          >
            {loading && !enabledMap && (
              <Grid
                container
                justify="center"
                alignItems="center"
                className={classes.divEmpty}
              >
                <Typography
                  variant="display1"
                  align="center"
                  style={{ color: "#aba5a5" }}
                >
                  LOADING THE MAP DATA...
                </Typography>
              </Grid>
            )}
            {enabledMap && (
              <MapBox
                openMenu={openDrawer}
                enabledMap={enabledMap}
                maxDistance={maxDistance}
                center={center}
                isDashboard
              />
            )}
          </Grid>
        </div>
      )}
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.global.loading,
  };
};

const mapDispatchToProps = {
  setEmptyMap,
  fetchInfoCustomer,
  selectedItemMenu,
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(Dashboard);
