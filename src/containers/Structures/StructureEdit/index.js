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
  addSpan,
  addStructure
} from "../../../redux/actions/projectActions";
import { getUsers } from "../../../redux/actions/userActions";
import { fetchStates, setLoading } from "../../../redux/actions/globalActions";
import {
  fetchStuctureTypes,
  fetchSpanTypes
} from "../../../redux/actions/projectActions";
import Layout from "../../../components/Layout/index";
import SimpleBreadcrumbs from "../../../components/SimpleBreadcrumbs";
import Panel from "../../../components/Panel";
import styles from "./styles";
import SwipeableViews from "react-swipeable-views";
import { Formik, Form } from "formik";
import * as Yup from "yup";

class StructureEdit extends React.Component {
  state = {
    search: "",
    open: false,
    openUser: false,
    openStructure: false,
    openSpan: false,
    itemId: null,
    value: 0,
    projectName: "",
    inputProjectName: "",
    editName: false,
    userSelected: ""
  };

  breadcrumbs = [
    { name: "Home", to: "/home" },
    { name: "Projects", to: "/projects" },
    { name: "Project edit", to: `/projects/${this.props.match.params.projectId}` },
    { name: "Structure edit", to: null }
  ];

  formStructure = {
    name: "",
    address: "",
    stateId: "",
    latitude: "",
    longitude: "",
    structureTypeId: ""
  };

  formSpan = {
    number: "",
    structureStart: "",
    structureEnd: "",
    stateId: "",
    spanType: ""
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

  filter = (list, keyword, tab) => {
    if (keyword === "") return list;
    let fields = "";
    if (tab === "users") {
      fields = ["first_name", "last_name", "username", "email"];
    }
    if (tab === "structures") {
      fields = ["name"];
    }
    if (tab === "spans") {
      fields = ["id"];
    }
    const regex = new RegExp(keyword, "i");

    return list.filter(data => {
      const obj = { ...data };

      return (
        fields.filter(field => {
          return String(obj[field]).match(regex);
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
    } else {
      this.props.enqueueSnackbar("The request could not be processed!", {
        variant: "error"
      });
    }
  };

  showModal(itemId, item) {
    if (item === "openUser") this.props.getUsers();
    if (item === "openStructure") {
      this.props.fetchStuctureTypes(this.projectId);
      this.props.fetchStates();
    }
    if (item === "openSpan") {
      this.props.fetchStructures(this.projectId);
      this.props.fetchSpanTypes(this.projectId);
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
      this.props.enqueueSnackbar("¡Project updated successfully!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    } else {
      this.props.enqueueSnackbar("The request could not be processed!", {
        variant: "error"
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
    } else {
      this.props.enqueueSnackbar("The request could not be processed!", {
        variant: "error"
      });
    }
  };

  addStructure = async (values, formikActions) => {
    this.closeModal("openStructure");
    const { setSubmitting, resetForm } = formikActions;
    this.props.setLoading(true);
    const {
      name,
      stateId,
      latitude,
      longitude,
      structureTypeId,
      address
    } = values;
    const form = {
      name,
      state_id: stateId,
      latitude,
      longitude,
      type_structure_id: structureTypeId,
      address
    };

    try {
      const response = await this.props.addStructure(this.projectId, form);

      if (response.status === 201) {
        resetForm();
        this.props.enqueueSnackbar("The structure was added successfully!", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "center" }
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

  addSpan = async (values, formikActions) => {
    this.closeModal("openSpan");
    const { setSubmitting, resetForm } = formikActions;
    this.props.setLoading(true);
    const { number, stateId, structureStart, structureEnd, spanType } = values;
    const form = {
      number,
      state_id: stateId,
      start_structure: structureStart,
      end_structure: structureEnd,
      type_id: spanType
    };

    try {
      const response = await this.props.addSpan(this.projectId, form);

      if (response.status === 201) {
        resetForm();
        this.props.enqueueSnackbar("The span was added successfully!", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "center" }
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
      structureTypes,
      spansTypes
    } = this.props;
    const {
      search,
      open,
      openUser,
      openSpan,
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
                              error={!!touched.name && !!errors.name}
                              helperText={
                                !!touched.name && !!errors.name && errors.name
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
                              name="address"
                              value={values.address}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              label="Address"
                              fullWidth
                              margin="normal"
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
                              error={!!touched.stateId && !!errors.stateId}
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
                                !!touched.structureTypeId &&
                                !!errors.structureTypeId
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
                        style={{ marginLeft: 10 }}
                        disabled={loading || isSubmitting || !isValid || !dirty}
                        onClick={e => handleSubmit(e)}
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
        <Dialog
          open={openSpan}
          classes={{ paper: classes.dialogStructure }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onBackdropClick={() => this.closeModal("openSpan")}
          onEscapeKeyDown={() => this.closeModal("openSpan")}
        >
          <DialogTitle id="alert-dialog-title">{"Add span"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the required information
            </DialogContentText>
            <Formik
              onSubmit={this.addSpan}
              validateOnChange
              initialValues={{
                ...this.formSpan
              }}
              validationSchema={Yup.object().shape({
                stateId: Yup.mixed().required("State is required"),
                spanType: Yup.string().required("Span type is required"),
                structureStart: Yup.string().required(
                  "Structure start is required"
                ),
                structureEnd: Yup.string().required("Structure end is required")
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
                              name="structureStart"
                              select
                              label="Start structure"
                              value={values.structureStart}
                              margin="normal"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                !!touched.structureStart &&
                                !!errors.structureStart
                              }
                              helperText={
                                !!touched.structureStart &&
                                !!errors.structureStart &&
                                errors.structureStart
                              }
                              fullWidth
                              required
                            >
                              {structures
                                .filter(({ id }) => id !== values.structureEnd)
                                .map(structure => {
                                  return (
                                    <MenuItem
                                      key={structure.id}
                                      value={structure.id}
                                    >
                                      {structure.name}
                                    </MenuItem>
                                  );
                                })}
                            </TextField>
                          </Grid>
                          <Grid item xs>
                            <TextField
                              name="structureEnd"
                              select
                              label="End structure"
                              value={values.structureEnd}
                              margin="normal"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={
                                !!touched.structureEnd && !!errors.structureEnd
                              }
                              helperText={
                                !!touched.structureEnd &&
                                !!errors.structureEnd &&
                                errors.structureEnd
                              }
                              fullWidth
                              required
                            >
                              {structures
                                .filter(
                                  ({ id }) => id !== values.structureStart
                                )
                                .map(structure => {
                                  return (
                                    <MenuItem
                                      key={structure.id}
                                      value={structure.id}
                                    >
                                      {structure.name}
                                    </MenuItem>
                                  );
                                })}
                            </TextField>
                          </Grid>
                        </Grid>
                        <Grid container spacing={16}>
                          <Grid item xs>
                            <TextField
                              name="spanType"
                              select
                              label="Span type"
                              value={values.spanType}
                              margin="normal"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={!!touched.spanType && !!errors.spanType}
                              helperText={
                                !!touched.spanType &&
                                !!errors.spanType &&
                                errors.spanType
                              }
                              fullWidth
                              required
                            >
                              {spansTypes.map(type => {
                                return (
                                  <MenuItem key={type.id} value={type.id}>
                                    {type.name}
                                  </MenuItem>
                                );
                              })}
                            </TextField>
                          </Grid>
                          <Grid item xs>
                            <TextField
                              name="stateId"
                              select
                              label="State"
                              value={values.stateId}
                              margin="normal"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={!!touched.stateId && !!errors.stateId}
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
                        </Grid>
                        <Grid container spacing={16}>
                          <Grid item xs>
                            <TextField
                              name="number"
                              value={values.number}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              label="Number"
                              fullWidth
                              margin="normal"
                            />
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
                        style={{ marginLeft: 10 }}
                        disabled={loading || isSubmitting || !isValid || !dirty}
                        onClick={e => handleSubmit(e)}
                        variant="outlined"
                        className={classes.buttonAccept}
                      >
                        Add Span
                      </Button>
                    </Grid>
                  </Form>
                );
              }}
            </Formik>
          </DialogContent>
        </Dialog>
        <div className={classes.root}>
          <SimpleBreadcrumbs routes={this.breadcrumbs} />
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
              <Tab label="General" />
              <Tab label="Equipment" />
              <Tab label="Photos" />
              <Tab label="Interactions" />
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
                    {this.filter(users, search, "users").map(user => (
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
                    {this.filter(structures, search, "structures").map(
                      structure => (
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
                      )
                    )}
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
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => this.showModal(null, "openSpan")}
                  >
                    Add Span
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
                      <TableCell>ID</TableCell>
                      <TableCell>State</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.filter(spans, search, "spans").map(span => (
                      <TableRow key={span.id}>
                        <TableCell component="td">
                          <Link
                            component={RouterLink}
                            to={`/projects/${this.projectId}/spans/${span.id}`}
                          >
                            {span.id}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {span.state ? (
                            span.state.name === "Collected" ? (
                              <Typography color="primary">
                                {span.state.name}
                              </Typography>
                            ) : (
                              <Typography style={{ color: "#e44f4f" }}>
                                {span.state.name}
                              </Typography>
                            )
                          ) : (
                            "-"
                          )}
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
    structureTypes: state.projects.structureTypes,
    spansTypes: state.projects.spanTypes
  };
};

const mapDispatchToProps = {
  fetchStuctureTypes,
  fetchSpanTypes,
  fetchStates,
  fetchSpans,
  fetchStructures,
  getUsersProject,
  getProject,
  updateProject,
  getUsers,
  addUser,
  addStructure,
  addSpan,
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
  withStyles(styles, { name: "StructureEdit" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(StructureEdit);
