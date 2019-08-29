import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { withRouter, Prompt } from "react-router-dom";
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
  GridList,
  GridListTile,
  GridListTileBar
} from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Delete } from "@material-ui/icons";
import {
  toggleItemMenu,
  selectedItemMenu
} from "../../../redux/actions/layoutActions";
import {
  fetchStates
} from "../../../redux/actions/globalActions";
import {
  getStructure,
  fetchStructureTypes,
  updateStructure,
  getPhotos,
  addPhoto,
  deletePhoto,
  getInteractions,
  deleteInteraction,
  addInteraction
} from "../../../redux/actions/structureActions";
import { setLoading } from "../../../redux/actions/globalActions";
import Layout from "../../../components/Layout/index";
import SimpleBreadcrumbs from "../../../components/SimpleBreadcrumbs";
import Panel from "../../../components/Panel";
import styles from "./styles";
import SwipeableViews from "react-swipeable-views";
import InputFiles from "react-input-files";
import { Formik, Form } from "formik";
import * as Yup from "yup";

class StructureEdit extends React.Component {
  state = {
    search: "",
    open: false,
    openInteraction: false,
    itemId: null,
    value: 0,
    interactionDescription: "",
    formGeneral: {
      name: "",
      address: "",
      stateId: "",
      latitude: "",
      longitude: "",
      structureTypeId: ""
    }
  };

  breadcrumbs = [
    { name: "Home", to: "/home" },
    { name: "Projects", to: "/projects" },
    {
      name: "Project edit",
      to: `/projects/${this.props.match.params.projectId}`
    },
    { name: "Structure edit", to: null }
  ];

  projectId = null;
  structureId = null;
  formikGeneral = React.createRef();
  
  componentDidMount = async () => {
    try {
      this.projectId = this.props.match.params.projectId;
      this.structureId = this.props.match.params.id;
      const response = await this.props.getStructure(
        this.projectId,
        this.structureId
        );
        if (response.status === 200) {
        const {
          state_id,
          type_structure_id,
          name,
          latitude,
          longitude,
          address
        } = response.data;
        this.setState({
          formGeneral: {
            stateId: state_id,
            structureTypeId: type_structure_id || "",
            name,
            latitude,
            longitude,
            address
          }
        });
        this.props.fetchStates();
        this.props.fetchStructureTypes(this.projectId);
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
    let fields = ["description", "first_name", "last_name"];
    const regex = new RegExp(keyword, "i");

    return list.filter(data => {
      const obj = { ...data };

      return (
        fields.filter(field => {
          return field === "description" ? String(obj[field]).match(regex) : String(obj["user"][field]).match(regex)
        }).length > 0
      );
    });
  };

  handleDelete = async () => {
    this.setState({ open: false });
    let response = "";
    let itemName = "";
    if (this.state.value === 0) {
    }
    if (this.state.value === 1) {
    }
    if (this.state.value === 2) {
      itemName = "Photo";
      response = await this.props.deletePhoto(this.structureId, this.state.itemId)
    }
    if (this.state.value === 3) {
      itemName = "Interaction";
      response = await this.props.deleteInteraction(this.structureId, this.state.itemId)
    }
    if (response.status === 200 || response.status === 204) {
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

  showModal(item, itemId) {
    this.setState({ [item]: true, itemId });
  }

  closeModal(item) {
    this.setState({ [item]: !this.state[item] });
  }

  handleChange(event, newValue) {
    this.setState({ value: newValue, search: "" });
    if (newValue === 0) {
      this.setState(prevState => { return {formGeneral: prevState.formGeneral}});
      this.formikGeneral.current.resetForm()
    }
    if (newValue === 1) {
    }
    if (newValue === 2) {
      this.props.getPhotos(this.structureId);
      return;
    }
    if (newValue === 3) {
      this.props.getInteractions(this.structureId);
      return;
    }
  }

  handleChangeIndex(index) {
    this.setState({ value: index });
  }

  addPhoto = async (photo) => {
    const form = new FormData()
    form.append("photo", photo)
    const response = await this.props.addPhoto(this.structureId, form)
    if (response.status === 200 || response.status === 201) {
      // SHOW NOTIFICACION SUCCCESS
      this.props.enqueueSnackbar("¡The photo was added successfully!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    } else {
      this.props.enqueueSnackbar("The request could not be processed!", {
        variant: "error"
      });
    }
  };

  addInteraction = async () => {
    this.closeModal("openInteraction")
    const form = {description: this.state.interactionDescription}
    this.setState({interactionDescription: ""})
    const response = await this.props.addInteraction(this.structureId, form)
    if (response.status === 200 || response.status === 201) {
      // SHOW NOTIFICACION SUCCCESS
      this.props.enqueueSnackbar("¡The interaction was added successfully!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    } else {
      this.props.enqueueSnackbar("The request could not be processed!", {
        variant: "error"
      });
    }
  };

  update = async (values, formikActions) => {
    const { setSubmitting } = formikActions;
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
      const response = await this.props.updateStructure(this.projectId,this.structureId, form);

      if (response.status === 200) {  
        this.setState({formGeneral: {
          name,
          stateId,
          latitude,
          longitude,
          structureTypeId,
          address
        }});
        this.props.enqueueSnackbar("The structure was updted successfully!", {
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
      states,
      structureTypes,
      photos,
      interactions
    } = this.props;
    const {
      open,
      openInteraction,
      interactionDescription,
      search,
      value,
      formGeneral
    } = this.state;

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
              If you delete it will be permanently.
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
          open={openInteraction}
          classes={{ paper: classes.dialog }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onBackdropClick={() => this.closeModal("openInteraction")}
          onEscapeKeyDown={() => this.closeModal("openInteraction")}
        >
          <DialogTitle id="alert-dialog-title">
            {"Add interaction"}
          </DialogTitle>
          <DialogContent>
            <TextField
              name="description"
              multiline
              rows="5"
              label="Description"
              value={interactionDescription}
              onChange={(e) => {
                const value = e.target.value
                this.setState({ interactionDescription: value})
              }}
              margin="normal"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              className={classes.buttonCancel}
              onClick={() => this.closeModal("openInteraction")}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              color="primary"
              className={classes.buttonAccept}
              onClick={this.addInteraction}
              disabled={loading || interactionDescription.length === 0}
            >
              Add Interaction
            </Button>
          </DialogActions>
        </Dialog>

        <div className={classes.root}>
          <SimpleBreadcrumbs routes={this.breadcrumbs} />
          <Typography component="h1" variant="h5">
            {formGeneral.name}
          </Typography>
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
              slideStyle={{ overflow: "none" }}
            >
              <Grid>
                <Formik
                  onSubmit={this.update}
                  validateOnChange
                  enableReinitialize
                  ref={this.formikGeneral}
                  initialValues={{
                    ...formGeneral
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
                                disabled={loading}
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
                                disabled={loading}
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
                                disabled={loading}
                              />
                            </Grid>
                            <Grid item xs>
                              <TextField
                                label="Longitude"
                                name="longitude"
                                value={values.longitude}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                  !!touched.longitude && !!errors.longitude
                                }
                                helperText={
                                  !!touched.longitude &&
                                  !!errors.longitude &&
                                  errors.longitude
                                }
                                fullWidth
                                margin="normal"
                                required
                                type="number"
                                disabled={loading}
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
                                disabled={loading}
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
                            </Grid>
                          </Grid>
                        </Grid>
                        <br />
                        <Grid container>
                          <Button
                            disabled={
                              loading ||
                              isSubmitting ||
                              (isValid && !dirty) ||
                              (!isValid && dirty)
                            }
                            onClick={e => handleSubmit(e)}
                            variant="contained"
                            color="primary"
                            fullWidth
                          >
                            Update
                          </Button>
                        </Grid>
                      </Form>
                    );
                  }}
                </Formik>
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
                
              </Grid>
              <Grid style={{overflow: "hidden"}}>
                <div className={classes.header}>
                  {!loading ? (
                    <InputFiles
                      name="logo"
                      accept="image/*"
                      onChange={files => { this.addPhoto(files[0]) }}
                    >
                      <Button
                        variant="outlined"
                        color="primary"
                      >
                        Add Photo
                      </Button>
                    </InputFiles>
                  ): (
                    <Button
                        variant="outlined"
                        color="primary"
                        disabled
                      >
                        Add Photo
                      </Button>
                  )}
                </div>
                <GridList cellHeight={180} cols={3}>
                  {photos.map(photo => (
                    <GridListTile key={photo.id}>
                      <img src={photo.thumbnail} alt={photo.name} />
                      <GridListTileBar
                        title={photo.name}
                        titlePosition="top"
                        actionPosition="right"
                        actionIcon={
                          <IconButton className={classes.icon} disabled={loading} onClick={() => this.showModal("open", photo.id)}>
                            <Delete />
                          </IconButton>
                        }
                      />
                    </GridListTile>
                  ))}
                </GridList>
                {photos.length === 0 ? (
                  <Typography
                    variant="display1"
                    align="center"
                    className={classes.emptyText}
                  >
                    THERE AREN'T PHOTOS
                  </Typography>
                ) : null}
              </Grid>
              <Grid>
                <div className={classes.header}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => this.showModal("openInteraction", null)}
                  >
                    Add Interaction
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
                      <TableCell>Description</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.filter(interactions, search).map(interaction => (
                      <TableRow key={interaction.id}>
                        <TableCell component="td" className={classes.cellDescription}>
                          {interaction.description}
                        </TableCell>
                        <TableCell component="td">
                          {interaction.user.first_name} {interaction.user.last_name}
                        </TableCell>
                        <TableCell>
                          <div>
                            <IconButton
                              aria-label="Delete"
                              className={classes.iconDelete}
                              disabled={loading}
                              onClick={() =>
                                this.showModal("open", interaction.id)
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
                {interactions.length === 0 ? (
                  <Typography
                    variant="display1"
                    align="center"
                    className={classes.emptyText}
                  >
                    THERE AREN'T INTERACTIONS
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
    states: state.global.states,
    photos: state.structures.photos,
    structureTypes: state.structures.structureTypes,
    interactions: state.structures.interactions,
  };
};

const mapDispatchToProps = {
  getStructure,
  updateStructure,
  fetchStructureTypes,
  fetchStates,
  addPhoto,
  getPhotos,
  deletePhoto,
  getInteractions,
  deleteInteraction,
  addInteraction,
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
