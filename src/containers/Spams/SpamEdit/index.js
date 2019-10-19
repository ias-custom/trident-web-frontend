import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
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
  TextField
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
  setPoint
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
  deleteAccess,
  setSpan
} from "../../../redux/actions/spanActions";
import { setLoading } from "../../../redux/actions/globalActions";
import { setFromMap } from "../../../redux/actions/projectActions";
import Layout from "../../../components/Layout/index";
import SimpleBreadcrumbs from "../../../components/SimpleBreadcrumbs";
import Panel from "../../../components/Panel";
import styles from "./styles";
import SwipeableViews from "react-swipeable-views";
import { Formik } from "formik";
import * as Yup from "yup";
import { FormSpanEdit, PhotosList, Equipment, TextEmpty } from "../../../components";
import { Delete } from "@material-ui/icons";

class SpanEdit extends React.Component {
  state = {
    search: "",
    open: false,
    openAccess: false,
    openInteraction: false,
    itemId: null,
    value: 0,
    interactionDescription: "",
    enabledEquipment: false,
    formGeneral: {
      number: "",
      structureStart: "",
      structureEnd: "",
      stateId: "",
      spanType: "",
      inspectionId: ""
    },
    inspection_id: "",
    inspection_name: "",
    items: [],
    categories: [],
    accessId: "",
    markingId: ""
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
      const url = new URL(window.location.href);
      const fromMapMarking = url.searchParams.get("marking");
      const fromMapAccess = url.searchParams.get("access");
      if (fromMapMarking === "true")
        this.setState({
          value: 3,
          markingId: parseInt(url.searchParams.get("id"))
        });
      if (fromMapAccess === "true")
        this.setState({
          value: 4,
          accessId: parseInt(url.searchParams.get("id"))
        });

      const response = await this.props.getSpan(this.projectId, this.spanId);
      if (response.status === 200) {
        const {
          state_id,
          type_id,
          start_structure,
          end_structure,
          number,
          inspection_id,
          inspection,
          items
        } = response.data;
        this.setState({
          formGeneral: {
            inspectionId: inspection_id || "",
            number: number || "",
            structureStart: start_structure,
            structureEnd: end_structure,
            stateId: state_id || "",
            spanType: type_id || ""
          },
          inspection_id,
          inspection_name: inspection_id ? inspection.name : "",
          items: items || [],
          categories: inspection_id ? inspection.categories : [],
          enabledEquipment: true
        });
        // if (inspection_id) this.props.getCategoriesInspection(inspection_id);
        this.props.getPhotosSpan(this.spanId);
        this.props.fetchStructures(this.projectId);
        this.props.getMarkings(this.spanId);
        this.props.getAccess(this.spanId);
        const nameItem = "projects";
        const open = true;
        this.props.toggleItemMenu({ nameItem, open });
        this.props.selectedItemMenu({ nameItem, nameSubItem: "detail" });
      } else {
        this.props.history.push("/404");
      }
    } catch (error) {
      console.log(error);
    }
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
    const {
      number,
      stateId,
      structureStart,
      structureEnd,
      spanType,
      inspectionId
    } = values;
    const form = {
      number,
      state_id: stateId,
      start_structure: structureStart,
      end_structure: structureEnd,
      type_id: spanType,
      inspection_id: inspectionId
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

  goToAddMarking() {
    this.props.setPoint("", "");
    this.props.setSpan(this.spanId);
    this.props.history.push(`/projects/${this.projectId}/markings/create`);
  }

  goToAddAccess() {
    this.props.setPoint("", "");
    this.props.setSpan(this.spanId);
    this.props.history.push(`/projects/${this.projectId}/access/create`);
  }

  render() {
    const {
      classes,
      loading,
      photos,
      structures,
      markings,
      access
    } = this.props;
    const {
      open,
      openInteraction,
      interactionDescription,
      search,
      value,
      formGeneral,
      inspection_name,
      enabledEquipment,
      categories,
      items,
      markingId,
      accessId
    } = this.state;

    return (
      <Layout title="Projects">
        {() => (
          <div>
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
            <div className={classes.root}>
              <SimpleBreadcrumbs
                routes={this.breadcrumbs}
                classes={{ root: classes.breadcrumbs }}
              />
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
                        spanType: Yup.string().required(
                          "Span type is required"
                        ),
                        structureStart: Yup.string().required(
                          "Structure start is required"
                        ),
                        structureEnd: Yup.string().required(
                          "Structure end is required"
                        ),
                        number: Yup.string()
                          .max(10)
                          .required("Number is required")
                          .trim()
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
                            isCreate={false}
                          />
                        );
                      }}
                    </Formik>
                  </Grid>
                  <Grid style={{ height: "100%" }}>
                    {enabledEquipment && (
                      <Equipment
                        categories={categories}
                        items={items}
                        deficiencies={[]}
                        projectId={this.projectId}
                        itemId={parseInt(this.spanId)}
                        inspectionName={inspection_name}
                        isStructure={false}
                      />
                    )}
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
                        onClick={() => {
                          this.props.setFromMap(false);
                          this.goToAddMarking();
                        }}
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
                        { !loading &&
                          <TableBody>
                            {this.filter(markings, search, "markings").map(
                              marking => (
                                <TableRow
                                  key={marking.id}
                                  selected={markingId === marking.id}
                                >
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
                        }
                      </Table>
                      <TextEmpty itemName="MARKINGS" empty={markings.length === 0}/>
                    </div>
                  </Grid>
                  <Grid>
                    <div className={classes.header}>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                          this.props.setFromMap(false);
                          this.goToAddAccess();
                        }}
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
                            <TableCell style={{ minWidth: "100px" }}>
                              Notes
                            </TableCell>
                            <TableCell>Latitude</TableCell>
                            <TableCell>Longitude</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        {!loading &&
                          <TableBody>
                            {this.filter(access, search, "access").map(acc => (
                              <TableRow
                                key={acc.id}
                                selected={accessId === acc.id}
                              >
                                <TableCell component="td">
                                  {acc.type.name}
                                </TableCell>
                                <TableCell component="td">
                                  {acc.detail.name}
                                </TableCell>
                                <TableCell
                                  component="td"
                                  style={{ minWidth: "100px" }}
                                >
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
                            ))}
                          </TableBody>
                        }
                      </Table>
                      <TextEmpty itemName="ACCESS" empty={access.length === 0}/>
                    </div>
                  </Grid>
                </SwipeableViews>
              </Panel>
            </div>
          </div>
        )}
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
    access: state.spans.access
  };
};

const mapDispatchToProps = {
  addAccess,
  getAccess,
  deleteAccess,
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
  setLoading,
  setPoint,
  setSpan,
  setFromMap
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
