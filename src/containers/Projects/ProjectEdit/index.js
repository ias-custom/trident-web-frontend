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
  MenuItem,
  Tooltip,
  List,
  ListItem,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Edit, Delete, Save, Cancel, AddCircle, ArrowBack, ExpandMore } from "@material-ui/icons";
import {
  toggleItemMenu,
  selectedItemMenu
} from "../../../redux/actions/layoutActions";
import {
  deleteUser,
  getUsersProject,
  getProject,
  updateProject,
  addUser,
  getInspectionsProject,
  updateCategoryInspection,
  updateItemCategory
} from "../../../redux/actions/projectActions";
import {
  fetchStructures,
  deleteStructure,
  addStructure,
  fetchStructureTypes,
  addStructureType
} from "../../../redux/actions/structureActions";
import {
  fetchSpans,
  deleteSpan,
  addSpan,
  addSpanType,
  fetchSpanTypes
} from "../../../redux/actions/spanActions";
import { getUsers } from "../../../redux/actions/userActions";
import { fetchStates, setLoading } from "../../../redux/actions/globalActions";
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
  { name: "Project edit", to: null }
];

class ProjectEdit extends React.Component {
  state = {
    search: "",
    openId: 0,
    open: false,
    openUser: false,
    openStructure: false,
    openSpan: false,
    openAddStructureType: false,
    openAddSpanType: false,
    itemId: null,
    value: 0,
    projectName: "",
    inputProjectName: "",
    editName: false,
    userSelected: "",
    formStructure: {
      name: "",
      address: "",
      stateId: "",
      latitude: "",
      longitude: "",
      structureTypeId: ""
    },
    formSpan: {
      number: "",
      structureStart: "",
      structureEnd: "",
      stateId: "",
      spanType: ""
    },
    formStructureOrSpanType: {
      name: "",
      description: ""
    }
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
        this.props.getInspectionsProject(this.projectId);
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

  showModal = async(itemId, item) => {
    let form = { [item]: true, itemId }
    if (item === "openUser") this.props.getUsers();
    if (item === "openStructure") {
      this.props.fetchStructureTypes(this.projectId);
      this.props.fetchStates();
    }
    if (item === "openSpan") {
      const response = await this.props.fetchStructures(this.projectId);
      if (response.data.length >= 2){
        this.props.fetchSpanTypes(this.projectId);
        this.props.fetchStates();
      } else {
        this.props.enqueueSnackbar("¡The project must have a minimum of 2 structures!", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" }
        });
        return
      }
    }
    if (item === "openAddStructureType") form["openStructure"] = false
    if (item === "openAddSpanType") form["openSpan"] = false
    this.setState(form);
  }

  closeModal(item, resetForm) {
    let form = { [item]: !this.state[item], userSelected: "" }
    if (item === 'openStructure' || item === 'openSpan'){
      resetForm()
      form['formStructureOrSpanType'] = { name: "", description: "" }
    }
    if (item === 'openAddStructureType') form['openStructure'] = true
    if (item === 'openAddSpanType') form['openSpan'] = true
    this.setState(form);
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
    const form = {user_id: this.state.userSelected}
    const response = await this.props.addUser(this.projectId, form);
    if (response.status === 200 || response.status === 201) {
      this.closeModal("openUser", null);
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

  addStructureType = async () => {
    const response = await this.props.addStructureType(this.projectId, this.state.formStructureOrSpanType);
    if (response.status === 200 || response.status === 201) {
      this.closeModal("openAddStructureType", null);
      this.setState({formStructureOrSpanType: {name: "", description: ""}})
      // SHOW NOTIFICACION SUCCCESS
      this.props.enqueueSnackbar("¡The structure type was added successfully!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    } else {
      this.props.enqueueSnackbar("The request could not be processed!", {
        variant: "error"
      });
    }
  }

  addSpanType = async () => {
    const response = await this.props.addSpanType(this.projectId, this.state.formStructureOrSpanType);
    if (response.status === 200 || response.status === 201) {
      this.closeModal("openAddSpanType", null);
      this.setState({formStructureOrSpanType: {name: "", description: ""}})
      // SHOW NOTIFICACION SUCCCESS
      this.props.enqueueSnackbar("¡The span type was added successfully!", {
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
        this.closeModal("openStructure", resetForm);
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
        this.closeModal("openSpan", resetForm);
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

  openCollapse (openId, category) {
    category.newName = ""
    this.props.categories.map( category => {
      category.items.map(item => {
        item.edit = false
        return item
      })
      return category
    })
    if (openId === category.id) this.setState({openId: 0})
    else this.setState({openId: category.id})
  };

  changeNameItem = async(item, categoryId) => {
    const form = { name: item.newName }
    const response = await this.props.updateItemCategory(categoryId, item.id, form);
    if (response.status === 200 || response.status === 204) {
      // SHOW NOTIFICACION SUCCCESS
      Object.assign(item, {name: item.newName, newName: "", edit: false})
      this.setState({})
      this.props.enqueueSnackbar("Item updated successfully!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    } else {
      this.props.enqueueSnackbar("The request could not be processed!", {
        variant: "error"
      });
    }
  }

  changeNameCategory = async(category, inspectionId) => {
    const form = { name: category.newName }
    const response = await this.props.updateCategoryInspection(category.id, inspectionId, form);
    if (response.status === 200 || response.status === 204) {
      // SHOW NOTIFICACION SUCCCESS
      Object.assign(category, {name: category.newName, newName: ""})
      this.setState({})
      this.props.enqueueSnackbar("Inspection updated successfully!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    } else {
      this.props.enqueueSnackbar("The request could not be processed!", {
        variant: "error"
      });
    }
  }

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
      spansTypes,
      inspections,
      categories
    } = this.props;
    const {
      search,
      open,
      openUser,
      openSpan,
      openStructure,
      openAddStructureType,
      openAddSpanType,
      value,
      projectName,
      editName,
      inputProjectName,
      userSelected,
      formSpan,
      formStructure,
      formStructureOrSpanType,
      openId
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
          onBackdropClick={() => !loading ? this.closeModal("open", null) : false}
          onEscapeKeyDown={() => !loading ? this.closeModal("open", null) : false}
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure you want to delete?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              If you delete it will be permanently.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              className={classes.buttonCancel}
              onClick={() => this.closeModal("open", null)}
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
          open={openAddStructureType || openAddSpanType}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {openAddStructureType ? "Add structure type" : "Add span type"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Enter the required information
            </DialogContentText>
            <Grid container spacing={16}>
              <Grid container>
                <TextField
                  name="name"
                  label="Name"
                  value={formStructureOrSpanType.name}
                  onChange={(e) => {
                    const value = e.target.value
                    this.setState((prevState)=> { 
                      return { formStructureOrSpanType: {...prevState.formStructureOrSpanType, name: value} }
                    })
                  }}
                  margin="normal"
                  fullWidth
                  required
                />
              </Grid>
              <Grid container>
                <TextField
                  name="description"
                  multiline
                  rowsMax="4"
                  rows="4"
                  label="Description"
                  value={formStructureOrSpanType.description}
                  onChange={(e) => {
                    const value = e.target.value
                    this.setState((prevState)=> { 
                      return { formStructureOrSpanType: {...prevState.formStructureOrSpanType, description: value} }
                    })
                  }}
                  margin="normal"
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              component="span"
              className={classes.buttonCancel}
              onClick={() => openAddStructureType ? this.closeModal("openAddStructureType", null): this.closeModal("openAddSpanType", null)}
            >
              <ArrowBack/> Volver
            </Button>
            <Button
              variant="outlined"
              color="primary"
              disabled={formStructureOrSpanType.name.length === 0 || loading}
              className={classes.buttonAccept}
              onClick={openAddStructureType ? this.addStructureType: this.addSpanType}
            >
              {openAddStructureType ? "Add structure type": "Add span type"}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openUser}
          classes={{ paper: classes.dialog }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onBackdropClick={() => !loading ? this.closeModal("openUser", null) : false}
          onEscapeKeyDown={() => !loading ? this.closeModal("openUser", null) : false}
        >
          <DialogTitle id="alert-dialog-title">{"Add user"}</DialogTitle>
          <DialogContent>
            <TextField
              name="user_selected"
              select
              label="Users"
              value={userSelected}
              margin="normal"
              disabled={loading}
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
              onClick={() => this.closeModal("openUser", null)}
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
        <Formik
          onSubmit={this.addStructure}
          validateOnChange
          enableReinitialize
          initialValues={{
            ...formStructure
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
              resetForm,
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
              <Dialog
                open={openStructure}
                classes={{ paper: classes.dialogStructure }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                onBackdropClick={() => !loading ? this.closeModal("openStructure", resetForm) : null}
                onEscapeKeyDown={() => !loading ? this.closeModal("openStructure", resetForm) : null}
              >
                <DialogTitle id="alert-dialog-title">
                  {"Add structure"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Enter the required information
                  </DialogContentText>
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
                              disabled={loading}
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
                            <div style={{display: "flex"}}>
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
                                disabled={loading}
                              >
                                {structureTypes.map(type => {
                                  return (
                                    <MenuItem key={type.id} value={type.id}>
                                      {type.name}
                                    </MenuItem>
                                  );
                                })}
                              </TextField>
                              <div>
                                <Tooltip title="Add structure type" aria-label="Add" placement="top-start">
                                  <IconButton className={classes.iconAdd} onClick={ ()=> this.showModal(null, "openAddStructureType")}>
                                    <AddCircle/>
                                  </IconButton> 
                                </Tooltip>
                              </div>
                            </div>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid container justify="flex-end">
                      <Button
                        variant="outlined"
                        disabled={loading}
                        className={classes.buttonCancel}
                        onClick={() => this.closeModal("openStructure", resetForm)}
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
                </DialogContent>
              </Dialog>
            );
          }}
        </Formik>
        <Formik
          onSubmit={this.addSpan}
          validateOnChange
          initialValues={{
            ...formSpan
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
              resetForm,
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
              <Dialog
                open={openSpan}
                classes={{ paper: classes.dialogStructure }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                onBackdropClick={() => !loading ? this.closeModal("openSpan", resetForm) : false}
                onEscapeKeyDown={() => !loading ? this.closeModal("openSpan", resetForm) : false}
              >
                <DialogTitle id="alert-dialog-title">{"Add span"}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Enter the required information
                  </DialogContentText>
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
                              disabled={loading}
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
                              disabled={loading}
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
                              disabled={loading}
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
                            <div style={{display: "flex"}}>
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
                                disabled={loading}
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
                              <div>
                                <Tooltip title="Add span type" aria-label="Add" placement="top-start">
                                  <IconButton className={classes.iconAdd} onClick={ ()=> this.showModal(null, "openAddSpanType")}>
                                    <AddCircle/>
                                  </IconButton> 
                                </Tooltip>
                              </div>
                            </div>
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
                        onClick={() => this.closeModal("openSpan", resetForm)}
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
                </DialogContent>
              </Dialog>
            );
          }}
        </Formik>
          

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
              <Tab label="Spans" />
              <Tab label="Inspections" />
            </Tabs>
          </Grid>
          <Panel>
            <SwipeableViews
              index={value}
              onChangeIndex={this.handleChangeIndex}
              slideStyle={{ overflowX: "hidden", overflowY: "hidden", padding: "0 2px" }}
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
              <Grid container spacing={16}>
                {inspections.map(({id, name}) => (
                  <Grid item xs={6} key={id}>
                    <Typography variant="h6" align="center" classes={{h6: classes.categoryName}}>{name}</Typography>
                    {categories.filter( ({inspection_id}) => inspection_id === id).map( category => (
                      <div key={category.id}>
                        
                        <ExpansionPanel expanded={openId === category.id} onChange={() => {
                          this.openCollapse(openId, category)
                        }} classes={{root: classes.collapse}} >
                          <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                            {category.name}
                          </ExpansionPanelSummary>
                          <ExpansionPanelDetails classes={{root: classes.collapseDetails}}>
                            <Grid>
                              <TextField
                                name="name"
                                value={category.newName || ""}
                                placeholder="Change category name"
                                label=""
                                required
                                disabled={loading}
                                inputProps={{ className: classes.inputCategory }}
                                onChange={(e) => {
                                  category.newName = e.target.value
                                  this.setState({})
                                }} 
                              />
                              <IconButton
                                className={classes.buttonSave}
                                aria-label="Save"
                                color="primary"
                                onClick={() => this.changeNameCategory(category, id)}
                                disabled={loading || !(category.newName && category.newName.length > 0)}
                              >
                                <Save />
                              </IconButton>
                            </Grid>
                            <Grid>
                              <Typography variant="subtitle1" classes={{subtitle1: classes.itemsText}}>ITEMS</Typography>
                            </Grid>
                            {category.items.map(item => (
                              <div key={item.id}>
                                {item.edit ? (
                                  <Grid>
                                    <TextField
                                      name="name"
                                      value={item.newName}
                                      label=""
                                      required
                                      disabled={loading}
                                      autoFocus={item.edit}
                                      inputProps={{ className: classes.inputCategory }}
                                      onChange={e => {
                                        item.newName = e.target.value
                                        this.setState({})
                                      }}
                                    />
                                    <IconButton
                                      className={classes.buttonSave}
                                      aria-label="Save"
                                      color="primary"
                                      onClick={() => this.changeNameItem(item, category.id)}
                                      disabled={loading || item.newName.length === 0}
                                    >
                                      <Save />
                                    </IconButton>
                                    <IconButton
                                      className={classes.iconDelete}
                                      aria-label="Cancel"
                                      onClick={() => {
                                        item.edit = false
                                        this.setState({})
                                      }}
                                      disabled={loading}
                                    >
                                      <Cancel />
                                    </IconButton>
                                  </Grid>
                                  
                                ): (
                                  <Typography variant="subtitle1">
                                    {item.name}
                                    <IconButton
                                      aria-label="Edit"
                                      color="primary"
                                      onClick={() => {
                                        Object.assign(item, {edit: true, newName: item.name}) 
                                        this.setState({})}}
                                      disabled={loading}
                                    >
                                      <Edit />
                                    </IconButton>
                                  </Typography>
                                )}
                                
                              </div>
                            ))}
                          </ExpansionPanelDetails>
                        </ExpansionPanel>
                        
                      </div>
                    ))}
                  </Grid>
                ))}
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
    states: state.global.states,
    permissions: state.auth.permissions,
    is_superuser: state.auth.is_superuser,
    users_customer: state.users.list,
    users: state.projects.users,
    inspections: state.projects.inspections,
    categories: state.projects.categories,    
    structures: state.structures.structures,
    structureTypes: state.structures.structureTypes,
    spans: state.spans.spans,
    spansTypes: state.spans.spanTypes
  };
};

const mapDispatchToProps = {
  fetchStructureTypes,
  fetchSpanTypes,
  fetchStates,
  fetchSpans,
  fetchStructures,
  getUsersProject,
  getInspectionsProject,
  updateCategoryInspection,
  updateItemCategory,
  getProject,
  updateProject,
  getUsers,
  addUser,
  addStructure,
  addSpan,
  addStructureType,
  addSpanType,
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
