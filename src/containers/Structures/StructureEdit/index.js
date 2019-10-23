import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import { withSnackbar } from "notistack";
import {
  Button,
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
import { getCategoriesInspection } from "../../../redux/actions/projectActions";
import {
  getStructure,
  updateStructure,
  getPhotos
} from "../../../redux/actions/structureActions";
import { setLoading } from "../../../redux/actions/globalActions";
import Layout from "../../../components/Layout/index";
import SimpleBreadcrumbs from "../../../components/SimpleBreadcrumbs";
import Panel from "../../../components/Panel";
import styles from "./styles";
import SwipeableViews from "react-swipeable-views";
import { Formik } from "formik";
import * as Yup from "yup";
import FormStructureEdit from "../../../components/FormStructureEdit";
import { PhotosList } from "../../../components";
import Equipment from "../../../components/Equipment";

class StructureEdit extends React.Component {
  state = {
    search: "",
    open: false,
    openInteraction: false,
    itemId: null,
    value: 0,
    interactionDescription: "",
    inspection_id: null,
    inspection_name: "",
    categories: [],
    items: [],
    formGeneral: {
      name: "",
      address: "",
      stateId: "",
      latitude: "",
      longitude: "",
      structureTypeId: "",
      inspectionId: "",
      number: ""
    },
    enabledEquipment: false
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

  projectId = this.props.match.params.projectId;
  structureId = this.props.match.params.id;
  formikGeneral = React.createRef();

  componentDidMount = async () => {
    try {
      const response = await this.props.getStructure(
        this.projectId,
        this.structureId
      );
      if (response.status === 200) {
        this.props.getPhotos(this.structureId);
        const {
          state_id,
          type_structure_id,
          name,
          latitude,
          longitude,
          address,
          inspection_id,
          inspection,
          number,
          items,
          deficiencies
        } = response.data;
        this.setState({
          formGeneral: {
            inspectionId: inspection_id || "",
            stateId: state_id,
            structureTypeId: type_structure_id || "",
            name,
            latitude,
            longitude,
            address: address || "",
            number: number || ""
          },
          inspection_id,
          inspection_name: inspection_id ? inspection.name : "",
          items: items,
          categories: inspection_id ? inspection.categories : [],
          deficiencies,
          enabledEquipment: true
        });
        //if (inspection_id) this.props.getCategoriesInspection(inspection_id);

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
          return field === "description"
            ? String(obj[field]).match(regex)
            : String(obj["user"][field]).match(regex);
        }).length > 0
      );
    });
  };

  handleDelete = async () => {
    this.setState({ open: false });
    let response = "";
    let itemName = "";

    if (this.state.value === 3) {
      itemName = "Interaction";
      response = await this.props.deleteInteraction(
        this.structureId,
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
      address,
      inspectionId,
      number
    } = values;
    const form = {
      name,
      state_id: stateId,
      latitude,
      longitude,
      type_structure_id: structureTypeId,
      address,
      inspection_id: inspectionId,
      number
    };

    try {
      const response = await this.props.updateStructure(
        this.projectId,
        this.structureId,
        form
      );

      if (response.status === 200) {
        this.setState({
          formGeneral: {
            name,
            stateId,
            latitude,
            longitude,
            structureTypeId,
            address,
            inspectionId,
            number
          }
        });
        this.props.enqueueSnackbar("The structure was updated successfully!", {
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
    const { classes, loading, photos } = this.props;
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
      deficiencies,
      items
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
                        name: Yup.string().required("Name is required"),
                        stateId: Yup.mixed().required("State is required"),
                        latitude: Yup.string().required("Latitude is required"),
                        longitude: Yup.string().required(
                          "Longitude is required"
                        ),
                        inspectionId: Yup.mixed().required(
                          "Inspection is required"
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
                          <FormStructureEdit
                            dirty={dirty}
                            values={values}
                            isValid={isValid}
                            touched={touched}
                            errors={errors}
                            isSubmitting={isSubmitting}
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                            handleSubmit={handleSubmit}
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
                        deficiencies={deficiencies}
                        projectId={this.projectId}
                        itemId={parseInt(this.structureId)}
                        inspectionName={inspection_name}
                        isStructure={true}
                        changeItems={newItems =>
                          this.setState({ items: newItems })
                        }
                      />
                    )}
                  </Grid>
                  <Grid style={{ overflow: "hidden" }}>
                    <PhotosList
                      photos={photos}
                      isStructure={true}
                      itemId={parseInt(this.structureId)}
                    />
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
    photos: state.structures.photos,
    interactions: state.structures.interactions
  };
};

const mapDispatchToProps = {
  getCategoriesInspection,
  getStructure,
  updateStructure,
  getPhotos,
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
