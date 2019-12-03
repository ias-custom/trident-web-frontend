import React from "react";
import {
  Grid,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Fab
} from "@material-ui/core";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { withSnackbar } from "notistack";
import SimpleBreadcrumbs from "../../../components/SimpleBreadcrumbs";
import Layout from "../../../components/Layout/index";
import Panel from "../../../components/Panel";
import { connect } from "react-redux";
import { setLoading } from "../../../redux/actions/globalActions";
import {
  toggleItemMenu,
  selectedItemMenu
} from "../../../redux/actions/layoutActions";
import styles from "./styles";
import { Formik } from "formik";
import * as Yup from "yup";
import { FormStructureEdit } from "../../../components";
import {
  addStructure,
  addStructureType
} from "../../../redux/actions/structureActions";
import {
  setProjectForMap
} from "../../../redux/actions/projectActions";
import { ArrowBack } from "@material-ui/icons";

class StructureCreate extends React.Component {
  state = {
    form: {
      name: "",
      address: "",
      stateId: "",
      latitude: "",
      longitude: "",
      structureTypeId: "",
      inspectionId: "",
      number: ""
    },
    formStructureType: {
      name: "",
      description: ""
    },
    open: false
  };

  breadcrumbs = [
    { name: "Home", to: "/home" },
    { name: "Projects", to: "/projects" },
    {
      name: "Project edit",
      to: `/projects/${this.props.match.params.projectId}`
    },
    { name: "Create Structure", to: null }
  ];

  projectId = this.props.match.params.projectId;
  componentDidMount() {
    const { latitude, longitude } = this.props;
    this.setState(prevState => {
      return { form: { ...prevState.form, latitude, longitude, stateId: 2 } };
    });
    const nameItem = "structures";
    const nameSubItem = "create";
    const open = true;
    this.props.toggleItemMenu({ nameItem, open });
    this.props.selectedItemMenu({ nameItem, nameSubItem });
  }

  save = async (values, formikActions) => {
    const { setSubmitting, resetForm } = formikActions;
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
      const response = await this.props.addStructure(this.projectId, form);

      if (response.status === 201) {
        resetForm();
        this.setState(prevState => {
          return { form: { ...prevState.form, latitude: "", longitude: "" } };
        });
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

  addStructureType = async () => {
    this.setState({ open: false });
    const response = await this.props.addStructureType(
      this.projectId,
      this.state.formStructureType
    );
    if (response.status === 200 || response.status === 201) {
      this.setState({ formStructureType: { name: "", description: "" } });
      // SHOW NOTIFICACION SUCCCESS
      this.props.enqueueSnackbar(
        "¡The structure type was added successfully!",
        {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "center" }
        }
      );
    } else {
      this.props.enqueueSnackbar("The request could not be processed!", {
        variant: "error"
      });
    }
  };

  render() {
    const { classes, loading, fromMap } = this.props;
    const { form, formStructureType, open } = this.state;
    return (
      <Layout title="Create Structure">
        {() => (
          <div className={classes.root}>
            <Dialog
              open={open}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                Add structure type
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
                      value={formStructureType.name}
                      onChange={e => {
                        const value = e.target.value;
                        this.setState(prevState => {
                          return {
                            formStructureType: {
                              ...prevState.formStructureType,
                              name: value
                            }
                          };
                        });
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
                      value={formStructureType.description}
                      onChange={e => {
                        const value = e.target.value;
                        this.setState(prevState => {
                          return {
                            formStructureType: {
                              ...prevState.formStructureType,
                              description: value
                            }
                          };
                        });
                      }}
                      margin="normal"
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="outlined"
                  className={classes.buttonCancel}
                  onClick={() => {
                    const formStructureType = { name: "", description: "" };
                    this.setState({ formStructureType, open: false });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={formStructureType.name.length === 0 || loading}
                  className={classes.buttonAdd}
                  onClick={this.addStructureType}
                >
                  Add structure type
                </Button>
              </DialogActions>
            </Dialog>

            <SimpleBreadcrumbs
              routes={this.breadcrumbs}
              classes={{ root: classes.breadcrumbs }}
            />
            {fromMap ? (
              <Grid container justify="flex-end">
                <Fab
                  variant="extended"
                  aria-label="Back"
                  color="primary"
                  className={classes.buttonBack}
                  onClick={() => {
                    this.props.setProjectForMap(this.projectId)
                    this.props.history.push(`/projects/${this.projectId}?map=true`)
                  }}
                >
                  <ArrowBack />
                  Back to map
                </Fab>
              </Grid>
            ) : null}
            <Panel>
              <Formik
                onSubmit={this.save}
                validateOnChange
                enableReinitialize
                initialValues={{
                  ...form
                }}
                validationSchema={Yup.object().shape({
                  name: Yup.string().required("Name is required"),
                  stateId: Yup.mixed().required("State is required"),
                  latitude: Yup.string().required("Latitude is required"),
                  longitude: Yup.string().required("Longitude is required"),
                  inspectionId: Yup.mixed().required("Inspection is required"),
                  number: Yup.string().required("Number is required")
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
                      isCreate={true}
                      showModal={() => this.setState({ open: true })}
                    />
                  );
                }}
              </Formik>
            </Panel>
          </div>
        )}
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.global.loading,
    latitude: state.projects.latitude,
    longitude: state.projects.longitude,
    fromMap: state.projects.fromMap
  };
};

const mapDispatchToProps = {
  setLoading,
  toggleItemMenu,
  selectedItemMenu,
  addStructure,
  addStructureType,
  setProjectForMap
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "StructureCreate" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(StructureCreate);
