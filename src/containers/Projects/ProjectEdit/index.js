import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { Link as RouterLink, withRouter, Prompt } from "react-router-dom";
import { withSnackbar } from "notistack";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Input,
  IconButton,
  Link,
  withStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Typography,
  TextField,
  MenuItem
} from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Edit, Delete, Save, Cancel } from "@material-ui/icons";
import {
  toggleItemMenu,
  selectedItemMenu
} from "../../../redux/actions/layoutActions";
import {
  fetchStructures,
  fetchSpans,
  deleteSpan,
  deleteUser,
  deleteStructure,
  getUsersProject,
  getProject,
  updateProject,
  addUser,
  addStructure
} from "../../../redux/actions/projectActions";
import { getUsers } from "../../../redux/actions/userActions";
import { fetchStates, fetchStuctureTypes, setLoading } from "../../../redux/actions/globalActions";
import Layout from "../../../components/Layout/index";
import SimpleBreadcrumbs from "../../../components/SimpleBreadcrumbs";
import Panel from "../../../components/Panel";
import styles from "./styles";
import SwipeableViews from "react-swipeable-views";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const breadcrumbs = [
  { name: "Home", to: "/home" },
  { name: "Projects", to: "/projects" },
  { name: "Project detail", to: null }
];

class ProjectEdit extends React.Component {
  state = {
    search: "",
    open: false,
    openUser: false,
    openStructure: false,
    itemId: null,
    value: 0,
    projectName: "",
    inputProjectName: "",
    editName: false,
    userSelected: ""
  };
  formStructure = {
    name: "",
    stateId: "",
    structureTypeId: "",
    latitude: "",
    longitude: ""
  };
  projectId = null;
  componentDidMount = async () => {
    try {
      this.projectId = this.props.match.params.id;
      const response = await this.props.getProject(this.projectId);
      if (response.status === 200) {
        this.setState({
          projectName: response.data.name,
          inputProjectName: response.data.name
        });
        this.props.getUsersProject(this.projectId);
        const nameItem = "projects";
        const open = true;
        this.props.toggleItemMenu({ nameItem, open });
        this.props.selectedItemMenu({ nameItem, nameSubItem: "detail" });
      } else {
        this.props.history.push("/404");
      }
    } catch (error) {}
  };

  handleSearch = event => {
    this.setState({ search: event.target.value });
  };

  filter = (list, keyword) => {
    if (keyword === "") return list;

    const fields = ["name"];
    const regex = new RegExp(keyword, "i");

    return list.filter(data => {
      const obj = { ...data };

      return (
        fields.filter(field => {
          return typeof obj[field] === "string" && obj[field].match(regex);
        }).length > 0
      );
    });
  };

  handleDelete = async () => {
    this.setState({ open: false });
    let response = "";
    let itemName = "";
    if (this.state.value === 0) {
      itemName = "User";
      response = await this.props.deleteUser(this.projectId, this.state.itemId);
    }
    if (this.state.value === 1) {
      itemName = "Structure";
      response = await this.props.deleteStructure(
        this.projectId,
        this.state.itemId
      );
    }
    if (this.state.value === 2) {
      itemName = "Span";
      response = await this.props.deleteSpan(this.projectId, this.state.itemId);
    }
    if (response.status === 200 || response.status === 204) {
      // SHOW NOTIFICACION SUCCCESS
      const text = `${itemName} successfully removed!`;
      this.props.enqueueSnackbar(text, {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    }
  };

  showModal(itemId, item) {
    if (item === "openUser") this.props.getUsers();
    if (item === "openStructure") {
      this.props.fetchStuctureTypes();
      this.props.fetchStates();
    }
    this.setState({ [item]: true, itemId });
  }

  closeModal(item) {
    this.setState({ [item]: !this.state[item], userSelected: "" });
  }

  handleChange(event, newValue) {
    this.setState({ value: newValue, search: "" });
    if (newValue === 0) {
      this.props.getUsersProject(this.projectId);
    }
    if (newValue === 1) {
      this.props.fetchStructures(this.projectId);
      return;
    }
    if (newValue === 2) {
      this.props.fetchSpans(this.projectId);
      return;
    }
  }

  handleChangeIndex(index) {
    this.setState({ value: index });
  }

  showInputEdit() {
    this.setState({ editName: true });
  }

  saveName = async () => {
    const form = { name: this.state.inputProjectName };
    const response = await this.props.updateProject(this.projectId, form);
    if (response.status === 200 || response.status === 204) {
      this.setState({
        editName: false,
        projectName: this.state.inputProjectName
      });
      // SHOW NOTIFICACION SUCCCESS
      this.props.enqueueSnackbar("¡ Projecto renombrado exitosamente!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    }
  };

  addUser = async () => {
    const form = { user_id: this.state.userSelected };
    this.closeModal("openUser");
    const response = await this.props.addUser(this.projectId, form);
    if (response.status === 200 || response.status === 201) {
      // SHOW NOTIFICACION SUCCCESS
      this.props.enqueueSnackbar("¡The user was added successfully!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    }
  };

  addStructure = async (values, formikActions) => {
    this.closeModal("openStructure");
    const { setSubmitting, resetForm } = formikActions;
    this.props.setLoading(true);
    const { name, stateId, latitude, longitude, structureTypeId } = values;
    const form = { name, state_id: stateId, latitude, longitude, type_structure_id: structureTypeId };

    try {
      const response = await this.props.addStructure(this.projectId, form);

      if (response.status === 201) {
        resetForm();
        this.props.enqueueSnackbar("The structure was added successfully!", {
          variant: "success"
        });
      } else {
        this.props.enqueueSnackbar("The request could not be processed!", {
          variant: "error"
        });
      }
    } catch (error) {
      this.props.enqueueSnackbar(error.message, { variant: "error" });
    }
    setSubmitting(false);
    this.props.setLoading(false);
  };

  render() {
    const {
      classes,
      loading,
      structures,
      spans,
      users,
      users_customer,
      states,
      structureTypes
    } = this.props;
    const {
      search,
      open,
      openUser,
      openStructure,
      value,
      projectName,
      editName,
      inputProjectName,
      userSelected
    } = this.state;
    const usersAvailable = users_customer.filter(({ id }) => {
      return !!!users.find(user => id === user.id);
    });
    
    return (
      <Layout title="Projects">
        <Dialog
          open={open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onBackdropClick={() => this.closeModal("open")}
          onEscapeKeyDown={() => this.closeModal("open")}
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure you want to delete?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              If you delete the role it will be permanently.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              className={classes.buttonCancel}
              onClick={() => this.closeModal("open")}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              color="primary"
              className={classes.buttonAccept}
              onClick={this.handleDelete}
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openUser}
          classes={{ paper: classes.dialog }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onBackdropClick={() => this.closeModal("openUser")}
          onEscapeKeyDown={() => this.closeModal("openUser")}
        >
          <DialogTitle id="alert-dialog-title">{"Add user"}</DialogTitle>
          <DialogContent>
            <TextField
              name="user_selected"
              select
              label="Users"
              value={userSelected}
              margin="normal"
              onChange={e => this.setState({ userSelected: e.target.value })}
              fullWidth
            >
              {usersAvailable.map(user => {
                return (
                  <MenuItem key={user.id} value={user.id}>
                    {user.first_name} {user.last_name}
                  </MenuItem>
                );
              })}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              className={classes.buttonCancel}
              onClick={() => this.closeModal("openUser")}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              color="primary"
              className={classes.buttonAccept}
              onClick={this.addUser}
              disabled={loading || userSelected === "" || userSelected === null}
            >
              Add User
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openStructure}
          classes={{ paper: classes.dialogStructure }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onBackdropClick={() => this.closeModal("openStructure")}
          onEscapeKeyDown={() => this.closeModal("openStructure")}
        >
          <DialogTitle id="alert-dialog-title">{"Add structure"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the required information
            </DialogContentText>
            <Formik
              onSubmit={this.addStructure}
              validateOnChange
              initialValues={{
                ...this.formStructure
              }}
              validationSchema={Yup.object().shape({
                name: Yup.string().required("Name is required"),
                stateId: Yup.mixed().required("State is required"),
                latitude: Yup.string().required("Latitude is required"),
                longitude: Yup.string().required("Longitude is required")
              })}
            >
              {props => {
                const {
                  isSubmitting,
                  values,
                  isValid,
                  dirty,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit
                } = props;

                return (
                  <Form onSubmit={this.handleSubmit}>
                    <Prompt
                      when={dirty}
                      message="Are you sure you want to leave?, You will lose your changes"
                    />
                    <Grid container>
                      <Grid item sm={12} md={12}>
                          <Grid container spacing={16}>
                            <Grid item xs>
                              <TextField
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                  !!touched.name && !!errors.name
                                }
                                helperText={
                                  !!touched.name &&
                                  !!errors.name &&
                                  errors.name
                                }
                                label="Name"
                                fullWidth
                                margin="normal"
                                required
                              />
                            </Grid>
                          </Grid>

                          <Grid container spacing={16}>
                            <Grid item xs>
                              <TextField
                                label="Latitude"
                                name="latitude"
                                value={values.latitude}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!touched.latitude && !!errors.latitude}
                                helperText={
                                  !!touched.latitude &&
                                  !!errors.latitude &&
                                  errors.latitude
                                }
                                fullWidth
                                margin="normal"
                                required
                                type="number"
                              />
                            </Grid>
                            <Grid item xs>
                              <TextField
                                label="Longitude"
                                name="longitude"
                                value={values.longitude}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!touched.longitude && !!errors.longitude}
                                helperText={
                                  !!touched.longitude &&
                                  !!errors.longitude &&
                                  errors.longitude
                                }
                                fullWidth
                                margin="normal"
                                required
                                type="number"
                              />
                            </Grid>
                          </Grid>
                          <Grid container spacing={16}>
                            <Grid item xs>
                              <TextField
                                name="stateId"
                                select
                                label="State"
                                value={values.stateId}
                                margin="normal"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                  !!touched.stateId && !!errors.stateId
                                }
                                helperText={
                                  !!touched.stateId &&
                                  !!errors.stateId &&
                                  errors.stateId
                                }
                                fullWidth
                                required
                              >
                                {states.map(state => {
                                  return (
                                    <MenuItem key={state.id} value={state.id}>
                                      {state.name}
                                    </MenuItem>
                                  );
                                })}
                              </TextField>
                            </Grid>
                            <Grid item xs>
                              <TextField
                                name="structureTypeId"
                                select
                                label="Stucture type"
                                value={values.structureTypeId}
                                margin="normal"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                  !!touched.structureTypeId && !!errors.structureTypeId
                                }
                                helperText={
                                  !!touched.structureTypeId &&
                                  !!errors.structureTypeId &&
                                  errors.structureTypeId
                                }
                                fullWidth
                              >
                                {structureTypes.map(type => {
                                  return (
                                    <MenuItem key={type.id} value={type.id}>
                                      {type.name}
                                    </MenuItem>
                                  );
                                })}
                              </TextField>
                            </Grid>
                          </Grid>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid container justify="flex-end">
                      <Button
                        variant="outlined"
                        className={classes.buttonCancel}
                        onClick={() => this.closeModal("openStructure")}
                      >
                        Cancel
                      </Button>
                      <Button
                        style={{marginLeft: 10}}
                        disabled={loading || isSubmitting || !isValid || !dirty}
                        onClick={(e) => handleSubmit(e)}
                        variant="outlined"
                        className={classes.buttonAccept}
                      >
                        Add Structure
                      </Button>
                    </Grid>
                  </Form>
                );
              }}
            </Formik>
          </DialogContent>
        </Dialog>
        <div className={classes.root}>
          <SimpleBreadcrumbs routes={breadcrumbs} />
          {editName ? (
            <Grid item xs={6}>
              <TextField
                name="name"
                value={inputProjectName}
                label=""
                required
                autoFocus={editName}
                inputProps={{ className: classes.inputName }}
                onChange={e =>
                  this.setState({ inputProjectName: e.target.value })
                }
              />
              <IconButton
                className={classes.buttonSave}
                aria-label="Save"
                color="primary"
                onClick={() => this.saveName()}
                disabled={loading || inputProjectName.length === 0}
              >
                <Save />
              </IconButton>
              <IconButton
                className={classes.iconDelete}
                aria-label="Cancel"
                onClick={() => {
                  this.setState({
                    inputProjectName: projectName,
                    editName: false
                  });
                }}
                disabled={loading}
              >
                <Cancel />
              </IconButton>
            </Grid>
          ) : (
            <Typography component="h1" variant="h5">
              {projectName}
              <IconButton
                aria-label="Edit"
                color="primary"
                onClick={() => this.showInputEdit()}
                disabled={loading}
              >
                <Edit />
              </IconButton>
            </Typography>
          )}

          <Grid className={classes.divTabs}>
            <Tabs
              value={value}
              onChange={(e, newValue) => {
                this.handleChange(e, newValue);
              }}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Users" />
              <Tab label="Structures" />
              <Tab label="Spams" />
            </Tabs>
          </Grid>
          <Panel>
            <SwipeableViews
              index={value}
              onChangeIndex={this.handleChangeIndex}
            >
              <Grid>
                <div className={classes.header}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => this.showModal(null, "openUser")}
                  >
                    Add User
                  </Button>
                  <Input
                    style={{ width: 300 }}
                    defaultValue=""
                    className={classes.search}
                    inputProps={{
                      placeholder: "Search...",
                      onChange: this.handleSearch
                    }}
                  />
                </div>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Username</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell colSpan={1}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.filter(users, search).map(user => (
                      <TableRow key={user.id}>
                        <TableCell component="td">
                          {user.first_name} {user.last_name}
                        </TableCell>
                        <TableCell component="td">{user.username}</TableCell>
                        <TableCell component="td">{user.email}</TableCell>
                        <TableCell>
                          <div style={{ display: "flex" }}>
                            {/* <Link
                              component={RouterLink}
                              to={`/users/${user.id}`}
                            >
                              <IconButton
                                aria-label="Edit"
                                color="primary"
                                disabled={loading}
                              >
                                <Edit />
                              </IconButton>
                            </Link> */}

                            <IconButton
                              aria-label="Delete"
                              className={classes.iconDelete}
                              disabled={loading}
                              onClick={() =>
                                this.showModal(user.relation_id, "open")
                              }
                            >
                              <Delete />
                            </IconButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {users.length === 0 ? (
                  <Typography
                    variant="display1"
                    align="center"
                    className={classes.emptyText}
                  >
                    THERE AREN'T USERS
                  </Typography>
                ) : null}
              </Grid>
              <Grid>
                <div className={classes.header}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => this.showModal(null, "openStructure")}
                  >
                    Add Structure
                  </Button>
                  <Input
                    style={{ width: 300 }}
                    defaultValue=""
                    className={classes.search}
                    inputProps={{
                      placeholder: "Search...",
                      onChange: this.handleSearch
                    }}
                  />
                </div>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>State</TableCell>
                      <TableCell colSpan={1}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.filter(structures, search).map(structure => (
                      <TableRow key={structure.id}>
                        <TableCell component="td">{structure.name}</TableCell>
                        <TableCell component="td">
                          {structure.state.name === "Collected" ? (
                            <Typography color="primary">
                              {structure.state.name}
                            </Typography>
                          ) : (
                            <Typography style={{ color: "#e44f4f" }}>
                              {structure.state.name}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <div style={{ display: "flex" }}>
                            <Link
                              component={RouterLink}
                              to={`/projects/${this.projectId}/structures/${structure.id}`}
                            >
                              <IconButton
                                aria-label="Edit"
                                color="primary"
                                disabled={loading}
                              >
                                <Edit />
                              </IconButton>
                            </Link>

                            <IconButton
                              aria-label="Delete"
                              className={classes.iconDelete}
                              disabled={loading}
                              onClick={() =>
                                this.showModal(structure.id, "open")
                              }
                            >
                              <Delete />
                            </IconButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {structures.length === 0 ? (
                  <Typography
                    variant="display1"
                    align="center"
                    className={classes.emptyText}
                  >
                    THERE AREN'T STRUCTURES
                  </Typography>
                ) : null}
              </Grid>
              <Grid>
                <div className={classes.header}>
                  <Link
                    component={RouterLink}
                    color="inherit"
                    to="/spams/create"
                  >
                    <Button variant="outlined" color="primary">
                      Add Spam
                    </Button>
                  </Link>
                  <Input
                    style={{ width: 300 }}
                    defaultValue=""
                    className={classes.search}
                    inputProps={{
                      placeholder: "Search...",
                      onChange: this.handleSearch
                    }}
                  />
                </div>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: "80%" }}>ID</TableCell>
                      <TableCell colSpan={1}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.filter(spans, search).map(span => (
                      <TableRow key={span.id}>
                        <TableCell component="td" style={{ width: "80%" }}>
                          <Link
                            component={RouterLink}
                            to={`/projects/${this.projectId}/spans/${span.id}`}
                          >
                            {span.id}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div style={{ display: "flex" }}>
                            <Link
                              component={RouterLink}
                              to={`/projects/${this.projectId}/spans/${span.id}`}
                            >
                              <IconButton
                                aria-label="Edit"
                                color="primary"
                                disabled={loading}
                              >
                                <Edit />
                              </IconButton>
                            </Link>
                            <IconButton
                              aria-label="Delete"
                              className={classes.iconDelete}
                              disabled={loading}
                              onClick={() => this.showModal(span.id, "open")}
                            >
                              <Delete />
                            </IconButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {spans.length === 0 ? (
                  <Typography
                    variant="display1"
                    align="center"
                    className={classes.emptyText}
                  >
                    THERE AREN'T SPANS
                  </Typography>
                ) : null}
              </Grid>
            </SwipeableViews>
          </Panel>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.global.loading,
    structures: state.projects.structures,
    spans: state.projects.spans,
    permissions: state.auth.permissions,
    is_superuser: state.auth.is_superuser,
    users: state.projects.users,
    users_customer: state.users.list,
    states: state.global.states,
    structureTypes: state.global.structureTypes
  };
};

const mapDispatchToProps = {
  fetchStuctureTypes,
  fetchStates,
  fetchSpans,
  fetchStructures,
  getUsersProject,
  getProject,
  updateProject,
  getUsers,
  addUser,
  addStructure,
  deleteUser,
  deleteSpan,
  deleteStructure,
  toggleItemMenu,
  selectedItemMenu,
  setLoading
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "ProjectEdit" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ProjectEdit);
