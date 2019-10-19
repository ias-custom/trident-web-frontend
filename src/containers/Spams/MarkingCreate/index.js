import React from "react";
import { Grid, TextField, Button, MenuItem, Fab } from "@material-ui/core";
import { compose } from "recompose";
import { withRouter, Prompt } from "react-router-dom";
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
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { getMarkingsTypes } from "../../../redux/actions/projectActions";
import { addMarking, fetchSpans } from "../../../redux/actions/spanActions";
import {
  setProjectForMap
} from "../../../redux/actions/projectActions";
import { ArrowBack } from "@material-ui/icons";

class MarkingCreate extends React.Component {
  state = {
    form: {
      type_id: "",
      owner: "",
      details: "",
      longitude: "",
      latitude: ""
    },
    span_id: ""
  };

  projectId = this.props.match.params.projectId;
  componentDidMount = async () => {
    try {
      const { latitude, longitude, spanId } = this.props;
      this.setState(prevState => {
        return {
          form: { ...prevState.form, latitude, longitude },
          span_id: spanId
        };
      });
      const response = await this.props.fetchSpans(this.projectId);
      if (response.status === 200) {
        if (response.data.length > 0) {
          if (this.state.span_id === "")
            this.setState({ span_id: response.data[0].id });
        } else {
          this.props.history.push(
            `/projects/${this.projectId}/spans/${this.state.span_id}`
          );
        }
      } else {
        this.props.history.push("/404");
      }
      this.props.getMarkingsTypes(this.projectId);
      const nameItem = "structures";
      const nameSubItem = "create";
      const open = true;
      this.props.toggleItemMenu({ nameItem, open });
      this.props.selectedItemMenu({ nameItem, nameSubItem });
    } catch (error) {}
  };

  save = async (values, formikActions) => {
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
      const response = await this.props.addMarking(this.state.span_id, form);

      if (response.status === 201) {
        resetForm();
        this.setState(prevState => {
          return { form: { ...prevState.form, latitude: "", longitude: "" } };
        });
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

  render() {
    const { classes, loading, marking_types, spans, fromMap } = this.props;
    const { form, span_id } = this.state;

    return (
      <Layout title="Create Marking">
        {() => (
          <div className={classes.root}>
            <SimpleBreadcrumbs
              routes={[
                { name: "Home", to: "/home" },
                { name: "Projects", to: "/projects" },
                {
                  name: "Project edit",
                  to: `/projects/${this.props.match.params.projectId}`
                },
                {
                  name: "Span edit",
                  to: `/projects/${this.props.match.params.projectId}/spans/${span_id}`
                },
                { name: "Create Marking", to: null }
              ]}
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
                    this.props.history.push(`/projects/maps-view`)
                  }}
                >
                  <ArrowBack />
                  Back to map
                </Fab>
              </Grid>
            ) : null}
            <Panel>
              <Grid>
                <TextField
                  name="span_id"
                  select
                  label="Span"
                  required
                  value={span_id}
                  margin="normal"
                  disabled={loading}
                  onChange={e => this.setState({ span_id: e.target.value })}
                  fullWidth
                >
                  {spans.map(span => {
                    return (
                      <MenuItem key={span.id} value={span.id}>
                        {span.number || span.id}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </Grid>
              <Formik
                onSubmit={this.save}
                validateOnChange
                enableReinitialize
                initialValues={{
                  ...form
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
                      <Grid container>
                        <Button
                          disabled={
                            loading || isSubmitting || !isValid || !dirty
                          }
                          onClick={e => {
                            handleSubmit(e);
                          }}
                          variant="contained"
                          color="primary"
                          fullWidth
                        >
                          Save
                        </Button>
                      </Grid>
                    </Form>
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
    marking_types: state.projects.marking_types,
    spans: state.spans.spans,
    spanId: state.spans.spanId,
    fromMap: state.projects.fromMap
  };
};

const mapDispatchToProps = {
  setLoading,
  toggleItemMenu,
  selectedItemMenu,
  getMarkingsTypes,
  addMarking,
  fetchSpans,
  setProjectForMap
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "MarkingCreate" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(MarkingCreate);
