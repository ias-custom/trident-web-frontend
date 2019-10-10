import React from "react";
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Checkbox,
  Chip,
  InputLabel,
  FormControl,
  FormHelperText
} from "@material-ui/core";
import { compose } from "recompose";
import { withRouter, Prompt } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { withSnackbar } from "notistack";
import SimpleBreadcrumbs from "../../../components/SimpleBreadcrumbs";
import Layout from "../../../components/Layout/index";
import Panel from "../../../components/Panel";
import { connect } from "react-redux";
import { setLoading } from "../../../redux/actions/globalActions";
import { getCustomers } from "../../../redux/actions/customerActions";
import {
  toggleItemMenu,
  selectedItemMenu
} from "../../../redux/actions/layoutActions";
import {
  getProjectsOfCustomer,
  createSubstation
} from "../../../redux/actions/substationActions";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";

import styles from "./styles";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const breadcrumbs = [
  { name: "Home", to: "/home" },
  { name: "Substations", to: "/substations" },
  { name: "Create Substation", to: null }
];

class SubstationCreate extends React.Component {
  state = {
    projects: []
  };

  form = {
    name: "",
    number: "",
    customerId: "",
    latitude: "",
    longitude: "",
    projectIds: []
  };

  componentDidMount() {
    const nameItem = "substations";
    const nameSubItem = "create";
    const open = true;
    this.props.toggleItemMenu({ nameItem, open });
    this.props.selectedItemMenu({ nameItem, nameSubItem });
    try {
      this.props.getCustomers();
    } catch (error) {
      console.error(error.message);
    }
  }

  handleSubmit = async (values, formikActions) => {
    const { setSubmitting, resetForm } = formikActions;
    this.props.setLoading(true);
    const {
      name,
      latitude,
      longitude,
      number,
      customerId,
      projectIds
    } = values;
    const project_ids = projectIds.map(({ id }) => id);

    const form = {
      name,
      latitude,
      longitude,
      number,
      customer_id: customerId,
      project_ids
    };

    try {
      const response = await this.props.createSubstation(form);

      if (response.status === 201) {
        resetForm();
        this.props.history.push("/substations");
        this.props.enqueueSnackbar("The substation has been created!", {
          variant: "success"
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

  getProjectsOfCustomer = async customerId => {
    const response = await this.props.getProjectsOfCustomer(customerId);
    if (response.status === 200) {
      this.setState({ projects: response.data });
    }
  };

  render() {
    const { classes, loading, customers } = this.props;
    const { projects } = this.state;

    return (
      <Layout title="Create Substation">
        {() => (
          <div className={classes.root}>
            <SimpleBreadcrumbs
              routes={breadcrumbs}
              classes={{ root: classes.breadcrumbs }}
            />
            <Formik
              onSubmit={this.handleSubmit}
              validateOnChange
              initialValues={{
                ...this.form
              }}
              validationSchema={Yup.object().shape({
                name: Yup.string().required("First name is required"),
                number: Yup.string()
                  .max(10)
                  .required("Number is required"),
                latitude: Yup.string().required("Latitude is required"),
                longitude: Yup.string().required("Longitude is required"),
                customerId: Yup.mixed().required("Customer is required")
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
                        <Panel>
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
                                label="Number"
                                name="number"
                                value={values.number}
                                onChange={e => {
                                  e.target.value = e.target.value.replace(
                                    /\s/g,
                                    ""
                                  );
                                  handleChange(e);
                                }}
                                onBlur={handleBlur}
                                error={!!touched.number && !!errors.number}
                                helperText={
                                  !!touched.number &&
                                  !!errors.number &&
                                  errors.number
                                }
                                fullWidth
                                margin="normal"
                                required
                              />
                            </Grid>
                            <Grid item xs>
                              <TextField
                                name="customerId"
                                select
                                label="Customers"
                                value={values.customerId}
                                onChange={e => {
                                  handleChange(e);
                                  this.getProjectsOfCustomer(e.target.value);
                                }}
                                onBlur={handleBlur}
                                error={
                                  !!touched.customerId && !!errors.customerId
                                }
                                helperText={
                                  !!touched.customerId &&
                                  !!errors.customerId &&
                                  errors.customerId
                                }
                                margin="normal"
                                fullWidth
                              >
                                {customers.map(customer => {
                                  return (
                                    <MenuItem
                                      key={customer.id}
                                      value={customer.id}
                                    >
                                      {customer.name}
                                    </MenuItem>
                                  );
                                })}
                              </TextField>
                            </Grid>
                          </Grid>
                          <Grid container spacing={16}>
                            <Grid item xs>
                              <FormControl fullWidth margin="normal">
                                <InputLabel
                                  htmlFor="select-multiple-chip"
                                  error={
                                    !!touched.projectIds && !!errors.projectIds
                                  }
                                >
                                  Projects
                                </InputLabel>
                                <Select
                                  multiple
                                  name="projectIds"
                                  value={values.projectIds}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  disabled={loading || values.customerId === ""}
                                  error={
                                    !!touched.projectIds && !!errors.projectIds
                                  }
                                  input={<Input id="select-multiple-chip" />}
                                  renderValue={selected => (
                                    <div className={classes.chips}>
                                      {selected.map(({ id, name }) => (
                                        <Chip
                                          key={id}
                                          label={name}
                                          className={classes.chip}
                                        />
                                      ))}
                                    </div>
                                  )}
                                  fullWidth
                                >
                                  {projects.map(project => (
                                    <MenuItem key={project.id} value={project}>
                                      <Checkbox
                                        checked={
                                          !!values.projectIds.find(
                                            c => c.id === project.id
                                          )
                                        }
                                      />
                                      <ListItemText primary={project.name} />
                                    </MenuItem>
                                  ))}
                                </Select>
                                <FormHelperText
                                  error={
                                    !!touched.projectIds && !!errors.projectIds
                                  }
                                >
                                  {!!touched.projectIds &&
                                    !!errors.projectIds &&
                                    errors.projectIds}
                                </FormHelperText>
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Panel>
                      </Grid>
                    </Grid>

                    <br />

                    <Button
                      disabled={loading || isSubmitting || !isValid || !dirty}
                      onClick={e => {
                        handleSubmit(e);
                      }}
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Create Substation
                    </Button>
                  </Form>
                );
              }}
            </Formik>
          </div>
        )}
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.global.loading,
    customers: state.customers.customers
  };
};

const mapDispatchToProps = {
  createSubstation,
  setLoading,
  toggleItemMenu,
  selectedItemMenu,
  getCustomers,
  getProjectsOfCustomer
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "SubstationCreate" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SubstationCreate);
