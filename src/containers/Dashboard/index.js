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
} from "@material-ui/core";
import { withSnackbar } from "notistack";
import { withRouter } from "react-router-dom";
import styles from "./styles";
import { compose } from "recompose";
import {
  Layout,
  SimpleBreadcrumbs,
  Panel,
  MapBoxDashboard,
} from "../../components";
import { fetchProjects } from "../../redux/actions/projectActions";
import { selectedItemMenu } from "../../redux/actions/layoutActions";
import _ from "lodash";

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
  const [filters, setFilters] = useState("");
  const { classes, loading } = props;

  useEffect(() => {
    const nameItem = "dashboard";
    const nameSubItem = "main";
    props.selectedItemMenu({ nameItem, nameSubItem });
    return () => {};
  }, []);

  function getItems(statusList, typeList, itemsList) {
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
      if (statusList.length === 0) {
        // set items map empty
        console.log("status vacio");
        return;
      }
      if (typeList.length === 0) {
        // set items map empty
        console.log("type vacio");
        return;
      }
      if (itemsList.length === 0) {
        console.log("items vacio");
        // set items map empty
        return;
      }
      console.log(statusList.join(','))
      console.log(typeList.join(','))
      console.log(itemsList.join(','))
    }, 1000);
  }
  function changeStatus(status) {
    let newList = statusList.includes(status)
      ? statusList.filter((s) => s !== status)
      : statusList.concat(status);
    setStatusList(newList);
    getItems(newList, typeList, items);
  }
  function changeType(type) {
    let newList = typeList.includes(type)
      ? typeList.filter((s) => s !== type)
      : typeList.concat(type);
    setTypeList(newList);
    getItems(statusList, newList, items);
  }
  function changeItems(newItems) {
    if (newItems.length > 0) {
      if (_.difference(newItems, items).length > 0 || newItems.length < items.length) {
        setItems(newItems);
        getItems(statusList, typeList, newItems);
      }
    } else {
      setItems([]);
      getItems(statusList, typeList, []);
    }
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
              <Grid item xs={4} style={{ borderRadius: 4 }}>
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

              <Grid item xs={4} style={{ borderRadius: 4 }}>
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
                <FormControl fullWidth margin="none">
                  <InputLabel htmlFor="select-multiple-chip" style={{fontSize: 17}}>Items</InputLabel>
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
                        <Checkbox
                          checked={!!items.find((item) => item === i)}
                        />
                        <ListItemText primary={i} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
            <MapBoxDashboard openMenu={openDrawer} projectId={0} />
          </Grid>
        </div>
      )}
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return {
    projects: state.projects.projects,
    loading: state.global.loading,
  };
};

const mapDispatchToProps = {
  fetchProjects,
  selectedItemMenu,
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(Dashboard);
