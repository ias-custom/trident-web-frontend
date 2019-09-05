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
  MenuItem
} from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {
  toggleItemMenu,
  selectedItemMenu
} from "../../../redux/actions/layoutActions";
import {
  getCategoriesInspection,
  getMarkingsTypes,
  getAccessTypes,
  getAccessTypeDetail
} from "../../../redux/actions/projectActions";
import { fetchStructures } from "../../../redux/actions/structureActions";
import {
  getSpan,
  updateSpan,
  getPhotosSpan,
  getMarkings,
  addMarking,
  deleteMarking,
  getAccess,
  addAccess,
  deleteAccess
} from "../../../redux/actions/spanActions";
import { setLoading } from "../../../redux/actions/globalActions";
import Layout from "../../../components/Layout/index";
import SimpleBreadcrumbs from "../../../components/SimpleBreadcrumbs";
import Panel from "../../../components/Panel";
import styles from "./styles";
import SwipeableViews from "react-swipeable-views";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FormSpanEdit, PhotosList, Equipment } from "../../../components";
import { Delete } from "@material-ui/icons";

class SpanEdit extends React.Component {
  state = {
    search: "",
    open: false,
    openMarking: false,
    openAccess: false,
    openInteraction: false,
    itemId: null,
    value: 0,
    interactionDescription: "",
    formGeneral: {
      number: "",
      structureStart: "",
      structureEnd: "",
      stateId: "",
      spanType: ""
    },
    formMarking: {
      type_id: "",
      owner: "",
      details: "",
      longitude: "",
      latitude: ""
    },
    formAccess: {
      type_id: "",
      detail_id: "",
      notes: "",
      longitude: "",
      latitude: ""
    },
    inspection_id: "",
    inspection_name: ""
  };

  breadcrumbs = [
    { name: "Home", to: "/home" },
    { name: "Projects", to: "/projects" },
    {
      name: "Project edit",
      to: `/projects/${this.props.match.params.projectId}`
    },
    { name: "Span edit", to: null }
  ];

  projectId = this.props.match.params.projectId;
  spanId = this.props.match.params.id;
  formikGeneral = React.createRef();

  componentDidMount = async () => {
    try {
      const response = await this.props.getSpan(this.projectId, this.spanId);
      if (response.status === 200) {
        const {
          state_id,
          type_id,
          start_structure,
          end_structure,
          number,
          inspection_id,
          inspection
        } = response.data;
        this.setState({
          formGeneral: {
            number: number || "",
            structureStart: start_structure,
            structureEnd: end_structure,
            stateId: state_id || "",
            spanType: type_id || ""
          },
          inspection_id,
          inspection_name: inspection_id ? inspection.name : ""
        });
        if (inspection_id) this.props.getCategoriesInspection(inspection_id);
        this.props.getPhotosSpan(this.spanId);
        this.props.fetchStructures(this.projectId);
        this.props.getMarkings(this.spanId); 
        this.props.getAccess(this.spanId)
        this.props.getAccessTypes(this.projectId);
        this.props.getMarkingsTypes(this.projectId);
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
    let fields = ["description", "first_name", "last_name"];
    if (tab === "markings")
      fields = ["name", "owner", "details", "latitude", "longitude"];
    const regex = new RegExp(keyword, "i");

    return list.filter(data => {
      const obj = { ...data };

      return (
        fields.filter(field => {
          return field !== "name"
            ? String(obj[field]).match(regex)
            : String(obj["type"][field]).match(regex);
        }).length > 0
      );
    });
  };

  handleDelete = async () => {
    this.setState({ open: false });
    let response = "";
    let itemName = "";

    try {
      if (this.state.value === 3) {
        itemName = "Marking";
        response = await this.props.deleteMarking(
          this.spanId,
          this.state.itemId
        );
      }
      if (this.state.value === 4) {
        itemName = "Access";
        response = await this.props.deleteAccess(
          this.spanId,
          this.state.itemId
        );
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
    } catch (error) {
      this.props.enqueueSnackbar(error.message, { variant: "error" });
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
      this.setState(prevState => {
        return { formGeneral: prevState.formGeneral };
      });
      this.formikGeneral.current.resetForm();
    }
  }

  handleChangeIndex(index) {
    this.setState({ value: index });
  }

  addInteraction = async () => {
    this.closeModal("openInteraction");
    const form = { description: this.state.interactionDescription };
    this.setState({ interactionDescription: "" });
    try {
      const response = await this.props.addInteraction(this.structureId, form);
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
    } catch (error) {
      this.props.enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  update = async (values, formikActions) => {
    const { setSubmitting } = formikActions;
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
      const response = await this.props.updateSpan(
        this.projectId,
        this.spanId,
        form
      );

      if (response.status === 200) {
        this.setState({
          formGeneral: {
            number,
            stateId,
            structureStart,
            structureEnd,
            spanType
          }
        });
        this.props.enqueueSnackbar("The span was updated successfully!", {
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

  addMarking = async (values, formikActions) => {
    const { setSubmitting, resetForm } = formikActions;
    this.props.setLoading(true);
    const { type_id, owner, latitude, longitude, details } = values;
    const form = {
      type_id,
      owner,
      latitude,
      longitude,
      details
    };

    try {
      const response = await this.props.addMarking(this.spanId, form);

      if (response.status === 201) {
        this.closeModal("openMarking");
        resetForm();
        this.props.enqueueSnackbar("The marking was added successfully!", {
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

  addAccess = async (values, formikActions) => {
    const { setSubmitting, resetForm } = formikActions;
    this.props.setLoading(true);
    const { type_id, detail_id, latitude, longitude, notes } = values;
    const form = {
      type_id,
      detail_id,
      latitude,
      longitude,
      notes
    };

    try {
      const response = await this.props.addAccess(this.spanId, form);

      if (response.status === 201) {
        this.closeModal("openAccess");
        resetForm();
        this.props.enqueueSnackbar("The access was added successfully!", {
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

  changeAccessType (value) {
    this.props.getAccessTypeDetail(value)
  }

  render() {
    const {
      classes,
      loading,
      photos,
      structures,
      markings,
      marking_types,
      access,
      access_types,
      details
    } = this.props;
    const {
      open,
      openAccess,
      openMarking,
      openInteraction,
      interactionDescription,
      search,
      value,
      formGeneral,
      formMarking,
      formAccess,
      inspection_id,
      inspection_name
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
          <DialogTitle id="alert-dialog-title">{"Add interaction"}</DialogTitle>
          <DialogContent>
            <TextField
              name="description"
              multiline
              rows="5"
              label="Description"
              value={interactionDescription}
              onChange={e => {
                const value = e.target.value;
                this.setState({ interactionDescription: value });
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
        <Dialog
          open={openMarking}
          classes={{ paper: classes.dialogMarking }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onBackdropClick={() =>
            !loading ? this.closeModal("openMarking") : null
          }
          onEscapeKeyDown={() =>
            !loading ? this.closeModal("openMarking") : null
          }
        >
          <DialogTitle id="alert-dialog-title">{"Add marking"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Enter the required information
            </DialogContentText>
            <Formik
              onSubmit={this.addMarking}
              validateOnChange
              initialValues={{
                ...formMarking
              }}
              validationSchema={Yup.object().shape({
                type_id: Yup.mixed().required("Marking type is required"),
                owner: Yup.string().required("Owner is required"),
                details: Yup.string().required("Details is required"),
                longitude: Yup.string().required("Longitude is required"),
                latitude: Yup.string().required("Latitude is required")
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
                  <Form onSubmit={this.handleSubmit}>
                    <Prompt
                      when={dirty}
                      message="Are you sure you want to leave?, You will lose your changes"
                    />
                    <Grid container spacing={16}>
                      <Grid item xs={6}>
                        <TextField
                          name="type_id"
                          select
                          label="Marking types"
                          required
                          value={values.type_id}
                          margin="normal"
                          disabled={loading}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!touched.type_id && !!errors.type_id}
                          helperText={
                            !!touched.type_id &&
                            !!errors.type_id &&
                            errors.type_id
                          }
                          fullWidth
                        >
                          {marking_types.map(marking => {
                            return (
                              <MenuItem key={marking.id} value={marking.id}>
                                {marking.name}
                              </MenuItem>
                            );
                          })}
                        </TextField>
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          name="owner"
                          label="Owner"
                          required
                          value={values.owner}
                          margin="normal"
                          disabled={loading}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!touched.owner && !!errors.owner}
                          helperText={
                            !!touched.owner && !!errors.owner && errors.owner
                          }
                          fullWidth
                        ></TextField>
                      </Grid>
                    </Grid>
                    <Grid container spacing={16}>
                      <Grid item xs={6}>
                        <TextField
                          name="latitude"
                          label="Latitude"
                          required
                          type="number"
                          value={values.latitude}
                          margin="normal"
                          disabled={loading}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!touched.latitude && !!errors.latitude}
                          helperText={
                            !!touched.latitude &&
                            !!errors.latitude &&
                            errors.latitude
                          }
                          fullWidth
                        ></TextField>
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          name="longitude"
                          label="Longitude"
                          required
                          type="number"
                          value={values.longitude}
                          margin="normal"
                          disabled={loading}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!touched.longitude && !!errors.longitude}
                          helperText={
                            !!touched.longitude &&
                            !!errors.longitude &&
                            errors.longitude
                          }
                          fullWidth
                        ></TextField>
                      </Grid>
                    </Grid>
                    <Grid container spacing={16}>
                      <Grid item xs>
                        <TextField
                          name="details"
                          label="Details"
                          rows="2"
                          rowsMax="2"
                          multiline
                          required
                          value={values.details}
                          margin="normal"
                          disabled={loading}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!touched.details && !!errors.details}
                          helperText={
                            !!touched.details &&
                            !!errors.details &&
                            errors.details
                          }
                          fullWidth
                        ></TextField>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid container justify="flex-end">
                      <Button
                        variant="outlined"
                        disabled={loading}
                        className={classes.buttonCancel}
                        onClick={() => this.closeModal("openMarking")}
                      >
                        Cancel
                      </Button>
                      <Button
                        disabled={loading || isSubmitting || !isValid || !dirty}
                        onClick={e => {
                          handleSubmit(e);
                        }}
                        variant="outlined"
                        color="primary"
                        className={classes.buttonAccept}
                      >
                        Add Marking
                      </Button>
                    </Grid>
                  </Form>
                );
              }}
            </Formik>
          </DialogContent>
        </Dialog>
        <Dialog
          open={openAccess}
          classes={{ paper: classes.dialogMarking }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onBackdropClick={() =>
            !loading ? this.closeModal("openAccess") : null
          }
          onEscapeKeyDown={() =>
            !loading ? this.closeModal("openAccess") : null
          }
        >
          <DialogTitle id="alert-dialog-title">{"Add access"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Enter the required information
            </DialogContentText>
            <Formik
              onSubmit={this.addAccess}
              validateOnChange
              initialValues={{
                ...formAccess
              }}
              validationSchema={Yup.object().shape({
                type_id: Yup.mixed().required("Access type is required"),
                detail_id: Yup.mixed().required("Detail is required"),
                notes: Yup.string().required("Notes is required"),
                longitude: Yup.string().required("Longitude is required"),
                latitude: Yup.string().required("Latitude is required")
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
                  <Form onSubmit={this.handleSubmit}>
                    <Prompt
                      when={dirty}
                      message="Are you sure you want to leave?, You will lose your changes"
                    />
                    <Grid container spacing={16}>
                      <Grid item xs={6}>
                        <TextField
                          name="type_id"
                          select
                          label="Access type"
                          required
                          value={values.type_id}
                          margin="normal"
                          disabled={loading}
                          onChange={ (e) => {
                            handleChange(e);
                            this.changeAccessType(e.target.value)
                          }}
                          onBlur={handleBlur}
                          error={!!touched.type_id && !!errors.type_id}
                          helperText={
                            !!touched.type_id &&
                            !!errors.type_id &&
                            errors.type_id
                          }
                          fullWidth
                        >
                          {access_types.map(type => {
                            return (
                              <MenuItem key={type.id} value={type.id}>
                                {type.name}
                              </MenuItem>
                            );
                          })}
                        </TextField>
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          name="detail_id"
                          label="Detail Access type"
                          required
                          select
                          value={values.detail_id}
                          margin="normal"
                          disabled={loading || values.type_id === ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!touched.detail_id && !!errors.detail_id}
                          helperText={
                            !!touched.detail_id && !!errors.detail_id && errors.detail_id
                          }
                          fullWidth
                        >
                          {details.map(detail => {
                            return (
                              <MenuItem key={detail.id} value={detail.id}>
                                {detail.name}
                              </MenuItem>
                            );
                          })}
                        </TextField>
                      </Grid>
                    </Grid>
                    <Grid container spacing={16}>
                      <Grid item xs={6}>
                        <TextField
                          name="latitude"
                          label="Latitude"
                          required
                          type="number"
                          value={values.latitude}
                          margin="normal"
                          disabled={loading}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!touched.latitude && !!errors.latitude}
                          helperText={
                            !!touched.latitude &&
                            !!errors.latitude &&
                            errors.latitude
                          }
                          fullWidth
                        ></TextField>
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          name="longitude"
                          label="Longitude"
                          required
                          type="number"
                          value={values.longitude}
                          margin="normal"
                          disabled={loading}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!touched.longitude && !!errors.longitude}
                          helperText={
                            !!touched.longitude &&
                            !!errors.longitude &&
                            errors.longitude
                          }
                          fullWidth
                        ></TextField>
                      </Grid>
                    </Grid>
                    <Grid container spacing={16}>
                      <Grid item xs>
                        <TextField
                          name="notes"
                          label="Notes"
                          rows="2"
                          rowsMax="2"
                          multiline
                          required
                          value={values.notes}
                          margin="normal"
                          disabled={loading}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!touched.notes && !!errors.notes}
                          helperText={
                            !!touched.notes &&
                            !!errors.notes &&
                            errors.notes
                          }
                          fullWidth
                        ></TextField>
                      </Grid>
                    </Grid>
                    <br />
                    <Grid container justify="flex-end">
                      <Button
                        variant="outlined"
                        disabled={loading}
                        className={classes.buttonCancel}
                        onClick={() => this.closeModal("openAccess")}
                      >
                        Cancel
                      </Button>
                      <Button
                        disabled={loading || isSubmitting || !isValid || !dirty}
                        onClick={e => {
                          handleSubmit(e);
                        }}
                        variant="outlined"
                        color="primary"
                        className={classes.buttonAccept}
                      >
                        Add Access
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
              <Tab label="Markings" />
              <Tab label="Access" />
            </Tabs>
          </Grid>
          <Panel>
            <SwipeableViews
              index={value}
              onChangeIndex={this.handleChangeIndex}
              slideStyle={{ overflowX: "hidden", overflowY: "hidden" }}
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
                    stateId: Yup.mixed().required("State is required"),
                    spanType: Yup.string().required("Span type is required"),
                    structureStart: Yup.string().required(
                      "Structure start is required"
                    ),
                    structureEnd: Yup.string().required(
                      "Structure end is required"
                    )
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
                      <FormSpanEdit
                        dirty={dirty}
                        values={values}
                        isValid={isValid}
                        touched={touched}
                        errors={errors}
                        isSubmitting={isSubmitting}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        handleSubmit={handleSubmit}
                        structures={structures}
                        projectId={this.projectId}
                        isModal={false}
                      />
                    );
                  }}
                </Formik>
              </Grid>
              <Grid style={{ height: "100%" }}>
                <Equipment
                  inspection_id={inspection_id}
                  projectId={this.projectId}
                  isStructure={false}
                  itemId={parseInt(this.spanId)}
                  inspectionName={inspection_name}
                  changeName={newName =>
                    this.setState({ inspection_name: newName })
                  }
                  changeId={id => this.setState({ inspection_id: id })}
                ></Equipment>
              </Grid>
              <Grid style={{ overflow: "hidden" }}>
                <PhotosList
                  photos={photos}
                  isStructure={false}
                  itemId={parseInt(this.spanId)}
                />
              </Grid>
              <Grid>
                <div className={classes.header}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => this.showModal("openMarking", null)}
                  >
                    Add Marking
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
                <div className={classes.divTable}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Owner</TableCell>
                        <TableCell>Details</TableCell>
                        <TableCell>Latitude</TableCell>
                        <TableCell>Longitude</TableCell>
                        <TableCell fixed={"true"}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.filter(markings, search, "markings").map(
                        marking => (
                          <TableRow key={marking.id}>
                            <TableCell component="td">
                              {marking.type.name}
                            </TableCell>
                            <TableCell component="td">
                              {marking.owner}
                            </TableCell>
                            <TableCell component="td">
                              {marking.details}
                            </TableCell>
                            <TableCell component="td">
                              {marking.coordinate[0]}
                            </TableCell>
                            <TableCell component="td">
                              {marking.coordinate[1]}
                            </TableCell>
                            <TableCell fixed={"true"}>
                              <div style={{ display: "flex" }}>
                                <IconButton
                                  aria-label="Delete"
                                  className={classes.iconDelete}
                                  disabled={loading}
                                  onClick={() =>
                                    this.showModal("open", marking.id)
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
                  {markings.length === 0 ? (
                    <Typography
                      variant="display1"
                      align="center"
                      className={classes.emptyText}
                    >
                      THERE AREN'T MARKINGS
                    </Typography>
                  ) : null}
                </div>
              </Grid>
              <Grid>
              <div className={classes.header}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => this.showModal("openAccess", null)}
                  >
                    Add Access
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
                <div className={classes.divTable}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Detail</TableCell>
                        <TableCell style={{minWidth: "100px"}}>Notes</TableCell>
                        <TableCell>Latitude</TableCell>
                        <TableCell>Longitude</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.filter(access, search, "access").map(
                        acc => (
                          <TableRow key={acc.id}>
                            <TableCell component="td">
                              {acc.type.name}
                            </TableCell>
                            <TableCell component="td">
                              {acc.detail.name}
                            </TableCell>
                            <TableCell component="td" style={{minWidth: "100px"}} >
                              {acc.notes}
                            </TableCell>
                            <TableCell component="td">
                              {acc.coordinate[0]}
                            </TableCell>
                            <TableCell component="td">
                              {acc.coordinate[1]}
                            </TableCell>
                            <TableCell fixed={"true"}>
                              <div style={{ display: "flex" }}>
                                <IconButton
                                  aria-label="Delete"
                                  className={classes.iconDelete}
                                  disabled={loading}
                                  onClick={() =>
                                    this.showModal("open", acc.id)
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
                  {markings.length === 0 ? (
                    <Typography
                      variant="display1"
                      align="center"
                      className={classes.emptyText}
                    >
                      THERE AREN'T MARKINGS
                    </Typography>
                  ) : null}
                </div>
              
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
    photos: state.spans.photos,
    interactions: state.structures.interactions,
    structures: state.structures.structures,
    markings: state.spans.markings,
    marking_types: state.projects.marking_types,
    access_types: state.projects.access_types,
    details: state.projects.details,
    access: state.spans.access
  };
};

const mapDispatchToProps = {
  addAccess,
  getAccess,
  deleteAccess,
  getAccessTypes,
  getAccessTypeDetail,
  getMarkings,
  addMarking,
  deleteMarking,
  getMarkingsTypes,
  fetchStructures,
  getCategoriesInspection,
  getSpan,
  updateSpan,
  getPhotosSpan,
  toggleItemMenu,
  selectedItemMenu,
  setLoading
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "SpanEdit" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SpanEdit);
