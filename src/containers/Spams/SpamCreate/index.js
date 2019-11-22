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
import { FormSpanEdit } from "../../../components";
import { addSpan, addSpanType } from "../../../redux/actions/spanActions";
import { fetchStructures } from "../../../redux/actions/structureActions";
import { setProjectForMap } from "../../../redux/actions/projectActions";
import { ArrowBack } from "@material-ui/icons";
import { getSubstations } from "../../../redux/actions/substationActions";

class SpanCreate extends React.Component {
  state = {
    form: {
      number: "",
      structureStart: "",
      structureEnd: "",
      stateId: "",
      spanType: "",
      inspectionId: ""
    },
    formSpanType: {
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
    { name: "Create Span", to: null }
  ];

  projectId = this.props.match.params.projectId;
  componentDidMount = async () => {
    try {
      const { structureStart, structureEnd } = this.props;
      this.setState(prevState => {
        return { form: { ...prevState.form, structureStart, structureEnd, stateId: 2 } };
      });
      this.props.fetchStructures(this.projectId);
      await this.props.getSubstations();
      const nameItem = "spans";
      const nameSubItem = "create";
      const open = true;
      this.props.toggleItemMenu({ nameItem, open });
      this.props.selectedItemMenu({ nameItem, nameSubItem });
    } catch (error) {}
  };

  save = async (values, formikActions) => {
    const { setSubmitting, resetForm } = formikActions;
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
      type_id: spanType,
      inspection_id: inspectionId
    };

    let id = structureStart.split("-")[0]
    let type = structureStart.split("-")[1]
    if (type === "st") Object.assign(form, {start_structure_id: id})
    else Object.assign(form, {start_substation_id: id})

    id = structureEnd.split("-")[0]
    type = structureEnd.split("-")[1]
    if (type === "st") Object.assign(form, {end_structure_id: id})
    else Object.assign(form, {end_substation_id: id})

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

  addSpanType = async () => {
    const response = await this.props.addSpanType(
      this.projectId,
      this.state.formSpanType
    );
    if (response.status === 200 || response.status === 201) {
      this.setState({
        formSpanType: { name: "", description: "" },
        open: false
      });
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

  render() {
    const { classes, loading, structures, fromMap, substations } = this.props;
    const { form, formSpanType, open } = this.state;
    
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
                      value={formSpanType.name}
                      onChange={e => {
                        const value = e.target.value;
                        this.setState(prevState => {
                          return {
                            formSpanType: {
                              ...prevState.formSpanType,
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
                      value={formSpanType.description}
                      onChange={e => {
                        const value = e.target.value;
                        this.setState(prevState => {
                          return {
                            formSpanType: {
                              ...prevState.formSpanType,
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
                    const formSpanType = { name: "", description: "" };
                    this.setState({ formSpanType, open: false });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={formSpanType.name.length === 0 || loading}
                  className={classes.buttonAdd}
                  onClick={this.addSpanType}
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
                    this.props.setProjectForMap(this.projectId);
                    this.props.history.push(`/projects/maps-view`);
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
                enableReinitialize
                validateOnChange
                initialValues={{
                  ...form
                }}
                validationSchema={Yup.object().shape({
                  stateId: Yup.mixed().required("State is required"),
                  spanType: Yup.string().required("Span type is required"),
                  structureStart: Yup.string().required(
                    "Structure start is required"
                  ),
                  structureEnd: Yup.string().required(
                    "Structure end is required"
                  ),
                  number: Yup.string()
                    .max(10)
                    .required("Number is required")
                    .trim(),
                  inspectionId: Yup.mixed().required("Inspection is required")
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
                      projectId={this.projectId}
                      structures={[
                        ...structures,
                        ...substations.filter(({ project_ids }) =>
                          project_ids.includes(parseInt(this.projectId))
                        )
                      ]}
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
    structureStart: state.spans.structureStart,
    structureEnd: state.spans.structureEnd,
    structures: state.structures.structures,
    substations: state.substations.list,
    fromMap: state.projects.fromMap
  };
};

const mapDispatchToProps = {
  setLoading,
  toggleItemMenu,
  selectedItemMenu,
  addSpan,
  addSpanType,
  fetchStructures,
  getSubstations,
  setProjectForMap
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "SpanCreate" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SpanCreate);
