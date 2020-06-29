import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
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
  Typography, List
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
import  {
  fetchProjects,
} from "../../redux/actions/projectActions";
import  {
  fetchStructures,
} from "../../redux/actions/structureActions"
import { selectedItemMenu } from "../../redux/actions/layoutActions";
import _ from "lodash";
import {SearchOutlined, SettingsApplications} from "@material-ui/icons";

let timeOut = null;

const Dashboard = ({ ...props }) => {
  const breadcrumbs = [
    { name: "Home", to: "/home" },
    { name: " Utility Dashboard", to: null },
  ];
  const statusGeneral = [
    "active",
    "planned",
    "completed"
  ];
  const typesGeneral = [
    "constructability",
    "construction"
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
  const [projectGeneral, setProjectGeneral] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [deficienciesList, setDeficienciesList] = useState(["true", "false"]);
  const [enabledMap, setEnabledMap] = useState(false);
  const [maxDistance, setMaxDistance] = useState(1200);
  const [center, setCenter] = useState([
    -102.36945144162411,
    41.08492193802903,
  ]);
  const selectAll = "select all";
  const deselectAll = "deselect all"
  const [itemSelect,setItemSelect] = useState([selectAll,selectAll,selectAll,selectAll]);
  const [openFilters,setOpenFilters] = useState(false);
  const [buttonDisabled,setButtonDisabled] = useState([false, true]);
  const {
    classes,
    loading,
    enqueueSnackbar,
    setEmptyMap,
    projects,
    fetchProjects,
    structures,
    fetchStructures,
    fetchInfoCustomer,
  } = props;

  useEffect(() => {
    setEmptyMap();
    setEnabledMap(true);
    fetchProjects();
    const nameItem = "dashboard";
    const nameSubItem = "main";
    props.selectedItemMenu({ nameItem, nameSubItem });
    return () => {};
  }, []);

  function alterDataStatisticsMap(statistics) {
    let aux = _.difference(statusGeneral, statusList);
    for (const status in aux){
      statistics.projects[aux[status]] = undefined;
    }
    if (!items.includes("structures")){
      statistics.structures = undefined;
      statistics.deficiencies = undefined;
    } else {
      if (!deficienciesList.includes("true")) {
        statistics.structures.with_deficiencies = undefined;
      }
      if (!deficienciesList.includes("false")) {
        statistics.structures.with_out_deficiencies = undefined;
      }
      if (!items.includes("spans")) {
        statistics.deficiencies.total_recorded_for_spans = undefined;
      }
    }
    if (!items.includes("interactions")) {
      statistics.interactions = undefined;
    }
    return statistics;
  }

  function getProject(status,type) {
    itemSelect[3] = selectAll;
    setProjectList([]);
    let projectRpta = projects.filter((p) => {
      if (p.state == undefined) return;
      return status.includes(p.state.name.toLowerCase()) && type.includes(p.inspection_name.toLowerCase());
    });
    let names = [];
    projectRpta.map((p)=>{
      names.push({id:p.id,name:p.name});
    })
    setProjectGeneral(names);
  }
  
  function getItems2() {

    setOpenFilters(false);
    buttonDisabled[0] = true;
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
      if (projectList.length === 0) {
        setEmptyMap();
        setEnabledMap(true);
        return;
      }
      //console.log("project");
      //console.log(structures);
      for (var i = 0; i < projectList.length; i++) {
        let aaa = await fetchStructures(i.id);
        console.log(aaa);
      }

      setEnabledMap(true);
    }, 500);
  }
  
  function getItems() {
    setOpenFilters(false);
    buttonDisabled[0] = true;
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
        statusList.filter((s)=> s != selectAll).join(","),
        typeList.filter((s)=> s != selectAll).join(","),
        projectList.map((p)=>p.id).filter((id)=>id != -1).join(","),
        items.filter((s)=> s != selectAll).join(","),
        deficienciesList.filter((s)=> s != selectAll).join(",")
      );
      //console.log("response");
      //console.log(response);
      if (response.status !== 200) {
        setEmptyMap();
        enqueueSnackbar("The request could not be processed", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" },
        });
      } else {
        response.data.statistics = alterDataStatisticsMap(response.data.statistics);
        const { coordinate_center, max_distance } = response.data;
        if (coordinate_center) {
          setCenter(coordinate_center);
          setMaxDistance(max_distance);
        }
      }
      setEnabledMap(true);
    }, 500);
  }

  function isClearItems(status,type,item) {
    return status.toString() == "" && type.toString() == "" && item.toString() == "";
  }

  function capString(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function clearItems() {
    setStatusList([]);
    setTypeList([]);
    setItems([]);
    setProjectGeneral([]);
    setProjectList([]);
    setButtonDisabled([false,true]);
    setItemSelect([selectAll,selectAll,selectAll,selectAll])
  }

  function changeStatus(status) {
    let newList = [];
    if (status === selectAll) {
      if (statusList.length == statusGeneral.length) {
        itemSelect[0] = selectAll;
        newList = [];
      } else {
        itemSelect[0] = deselectAll;
        newList = statusGeneral;
      }
    } else {
      if (statusList.includes(status)) {
        newList = statusList.filter((s) => s !== status);
        itemSelect[0] = selectAll;
      } else {
        newList = statusList.concat(status);
        if (newList.length == statusGeneral.length) {
          itemSelect[0] = deselectAll;
        }
      }
    }
    setStatusList(newList);
    getProject(newList,typeList);
    setButtonDisabled([false,isClearItems(newList,typeList,items)]);
    //getItems(newList, typeList, items, deficienciesList);
  }

  function changeType(type) {
    let newList = [];
    if (type == selectAll) {
      if (typeList.length == typesGeneral.length) {
        itemSelect[1] = selectAll;
        newList = [];
      } else {
        itemSelect[1] = deselectAll;
        newList = typesGeneral;
      }
    } else {
      if (typeList.includes(type)) {
        newList = typeList.filter((s) => s !== type);
        itemSelect[1] = selectAll;
      } else {
        newList = typeList.concat(type);
        if (newList.length == typesGeneral.length) {
          itemSelect[1] = deselectAll;
        }
      }
    }
    setTypeList(newList);
    getProject(statusList,newList);
    setButtonDisabled([false,isClearItems(statusList,newList,items)]);
    //getItems(statusList, newList, items, deficienciesList);
  }

  function changeProject(newProject) {
    let aunIDProject = projectList.map((p)=>p.id);
    let aux = (newProject.length > aunIDProject.length)?_.difference(newProject, aunIDProject)[0]:_.difference(aunIDProject, newProject)[0];
    if (newProject.length > 0) {
      if (aux == -1){
        if(itemSelect[3] != deselectAll) {
          itemSelect[3] = deselectAll;
          newProject = projectGeneral.slice();
          newProject.push({id:-1,name:selectAll});
        } else {
          itemSelect[3] = selectAll;
          newProject = [];
        }
      } else {
        if(newProject.length == projectGeneral.length && !newProject.includes(-1)){
          itemSelect[3] = deselectAll
          newProject = projectGeneral.slice();
          newProject.push({id:-1,name:selectAll});
        } else {
          itemSelect[3] = selectAll;
          newProject = projectGeneral.filter((s) => newProject.includes(s.id));
        }
      }
      setProjectList(newProject);
    } else  {
      setProjectList([]);
    }
    setButtonDisabled([false,isClearItems(statusList,typeList,items)]);
  }

  function changeItems(newItems) {
    let aux = (newItems.length > items.length)?_.difference(newItems, items)[0]:_.difference(items, newItems)[0];
    if (newItems.length > 0) {
      if (newItems.includes("spans") && !newItems.includes("structures")) {
        newItems.push("structures");
      }
      if (aux == selectAll){
        if(itemSelect[2] != deselectAll) {
          itemSelect[2] = deselectAll;
          newItems = itemsGeneral;
          newItems.push(selectAll);
        } else {
          itemSelect[2] = selectAll;
          newItems = [];
        }
      } else {
          if (newItems.length < items.length){
            itemSelect[2] = selectAll;
            newItems = newItems.filter((s) => s !== selectAll);
          } else if(newItems.length == itemsGeneral.length){
            itemSelect[2] = deselectAll
            newItems = itemsGeneral;
            newItems.push(selectAll)
          }
      }
      setItems(newItems);
    } else {
      setItems([]);
      //getItems(statusList, typeList, [], deficienciesList);
    }

    setButtonDisabled([false,isClearItems(statusList,typeList,newItems)]);
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
    setButtonDisabled([false,isClearItems(statusList,typeList,items)]);
  }

  return (
    <Layout title="Utility Dashboard">
      {(openDrawer) => (
        <div>
          <SimpleBreadcrumbs
            routes={breadcrumbs}
            classes={{ root: classes.breadcrumbs }}
          />
          <Paper>
            <ListItem button onClick={()=>{setOpenFilters(!openFilters)}} className={classes.listItem}>
              <FormLabel component="legend">Filters: </FormLabel>
              <div className={classes.chips}>
                {statusList.filter((s) => s !== selectAll).map((name) => (
                    <Chip
                        key={`${name}-chip`}
                        label={capString(name)}
                        className={classes.chip}
                    />
                ))}
                {typeList.filter((s) => s !== selectAll).map((name) => (
                    <Chip
                        key={`${name}-chip`}
                        label={capString(name)}
                        className={classes.chip}
                    />
                ))}
                {projectList.filter((s) => s.name !== selectAll).map((p) => (
                    <Chip
                        key={`${p.name}-chip`}
                        label={capString(p.name)}
                        className={classes.chip}
                    />
                ))}
                {items.filter((s) => s !== selectAll).map((name) => (
                    <Chip
                        key={`${name}-chip`}
                        label={capString(name)}
                        className={classes.chip}
                    />
                ))}
              </div>
              <ListItemText primary="" />
              {openFilters ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            {openFilters == true ? (
                <Panel>
                  <Grid spacing={16} container direction="row">
                    <Grid item xs={2} style={{ borderRadius: 4 }}>
                      <FormControl fullWidth margin="none">
                        <FormLabel component="legend">Project Status</FormLabel>
                        <FormGroup>
                          <FormControlLabel
                              control={
                                <Checkbox
                                    checked={statusList.length === statusGeneral.length}
                                    onChange={() => changeStatus(selectAll)}
                                    value={selectAll}
                                />
                              }
                              label={capString(itemSelect[0])}
                          />
                          {statusGeneral.map((i) => (
                              <FormControlLabel
                                  control={
                                    <Checkbox
                                        checked={statusList.includes(i)}
                                        onChange={() => changeStatus(i)}
                                        value={i}
                                    />
                                  }
                                  label={capString(i)}
                              />
                          ))}
                        </FormGroup>
                      </FormControl>
                    </Grid>
                    <Grid item xs={2} style={{ borderRadius: 4 }}>
                      <FormControl fullWidth margin="none">
                        <FormLabel component="legend">Project Type</FormLabel>
                        <FormGroup>
                          <FormControlLabel
                              control={
                                <Checkbox
                                    checked={typeList.length == typesGeneral.length}
                                    onChange={() => changeType(selectAll)}
                                    value={selectAll}
                                />
                              }
                              label={capString(itemSelect[1])}
                          />
                          {typesGeneral.map((i) => (
                              <FormControlLabel
                                  control={
                                    <Checkbox
                                        checked={typeList.includes(i)}
                                        onChange={() => changeType(i)}
                                        value={i}
                                    />
                                  }
                                  label={capString(i)}
                              />
                          ))}
                        </FormGroup>
                      </FormControl>
                    </Grid>
                    <Grid item xs={2} style={{ borderRadius: 4 }}>
                      <InputLabel
                          htmlFor="select-multiple-chip"
                          style={{ fontSize: 17 }}
                      >
                        Project
                      </InputLabel>
                      <Select
                          multiple
                          name="items"
                          value={projectList.map((p)=>p.id)}
                          onChange={(e) => changeProject(e.target.value)}
                          input={<Input id="select-multiple-chip" />}
                          renderValue={(selected) => (
                              <div className={classes.chips}>
                                {projectList.filter((s) => s.name !== selectAll).map((p) => (
                                    <Chip
                                        key={`${p.name}-chip`}
                                        label={p.name}
                                        className={classes.chip}
                                    />
                                ))}
                              </div>
                          )}
                          fullWidth
                      >
                        <MenuItem key={selectAll} value={-1}>
                          <Checkbox checked={projectList.length == projectGeneral.length + 1} />
                          <ListItemText primary={capString(itemSelect[3])} />
                        </MenuItem>
                        {projectGeneral.map((i) => (
                            <MenuItem key={i.name} value={i.id}>
                              <Checkbox checked={!!projectList.find((item) => item.name === i.name)} />
                              <ListItemText primary={capString(i.name)} />
                            </MenuItem>
                        ))}
                      </Select>
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
                                {selected.filter((s) => s !== selectAll).map((name) => (
                                    <Chip
                                        key={`${name}-chip`}
                                        label={capString(name)}
                                        className={classes.chip}
                                    />
                                ))}
                              </div>
                          )}
                          fullWidth
                      >
                        <MenuItem key={selectAll} value={selectAll}>
                          <Checkbox checked={items.length == itemsGeneral.length + 1} />
                          <ListItemText primary={capString(itemSelect[2])} />
                        </MenuItem>
                        {itemsGeneral.map((i) => (
                            <MenuItem key={i} value={i}>
                              <Checkbox checked={!!items.find((item) => item === i)} />
                              <ListItemText primary={capString(i)} />
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
                          className={classes.buttonForm}
                          onClick={() => getItems()}
                          disabled={buttonDisabled[0] || loading}
                      >
                        APPLY
                      </Button>
                      <Button
                          className={classes.buttonForm}
                          onClick={() => clearItems()}
                          disabled={buttonDisabled[1]}
                      >
                        Clear all
                      </Button>
                    </Grid>
                  </Grid>
                </Panel>
            ):(null)}
          </Paper>
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
  console.log("state");
  console.log(state);
  return {
    loading: state.global.loading,
    projects: state.projects.projects,
    structures: state.structures.structures,
  };
};

const mapDispatchToProps = {
  setEmptyMap,
  fetchProjects,
  fetchStructures,
  fetchInfoCustomer,
  selectedItemMenu,
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(Dashboard);
