import React from "react";
import { Grid, TextField, Button, MenuItem } from "@material-ui/core";
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
import { getAccessTypes, getAccessTypeDetail } from "../../../redux/actions/projectActions";
import { addAccess, fetchSpans } from "../../../redux/actions/spanActions";

class AccessCreate extends React.Component {
  state = {
    form: {
      type_id: "",
      detail_id: "",
      notes: "",
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
      this.props.getAccessTypes(this.projectId);
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
    const { type_id, detail_id, latitude, longitude, notes } = values;
    const form = {
      type_id,
      detail_id,
      latitude,
      longitude,
      notes
    };

    try {
      const response = await this.props.addAccess(this.state.span_id, form);

      if (response.status === 201) {
        this.setState(prevState => {
          return { form: { ...prevState.form, latitude: "", longitude: "", span_id: "" } };
        });
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
    const { classes, loading, access_types, spans, details } = this.props;
    const { form, span_id } = this.state;

    return (
      <Layout title="Create Access">
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
                { name: "Create Access", to: null }
              ]}
              classes={{ root: classes.breadcrumbs }}
            />
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
                            onChange={e => {
                              handleChange(e);
                              this.changeAccessType(e.target.value);
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
                              !!touched.detail_id &&
                              !!errors.detail_id &&
                              errors.detail_id
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
                              !!touched.notes && !!errors.notes && errors.notes
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
    access_types: state.projects.access_types,
    details: state.projects.details,
    spans: state.spans.spans,
    spanId: state.spans.spanId
  };
};

const mapDispatchToProps = {
  setLoading,
  toggleItemMenu,
  selectedItemMenu,
  getAccessTypes,
  getAccessTypeDetail,
  addAccess,
  fetchSpans
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "AccessCreate" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AccessCreate);
