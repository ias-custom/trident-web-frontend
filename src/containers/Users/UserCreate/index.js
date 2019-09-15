import React from "react";
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  FormControlLabel,
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
import {
  fetchStates,
  setHandleForm,
  setLoading
} from "../../../redux/actions/globalActions";
import { getCustomers } from "../../../redux/actions/customerActions";
import { createUser } from "../../../redux/actions/userActions";
import { fetchRoles } from "../../../redux/actions/roleActions";
import {
  toggleItemMenu,
  selectedItemMenu
} from "../../../redux/actions/layoutActions";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";

import styles from "./styles";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const breadcrumbs = [
  { name: "Home", to: "/home" },
  { name: "Users", to: "/users" },
  { name: "Create User", to: null }
];

class UserCreate extends React.Component {
  state = {};

  form = {
    email: "",
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    role_id: "",
    enterApp: false,
    customersId: []
  };

  componentDidMount() {
    const nameItem = "users";
    const nameSubItem = "create";
    const open = true;
    this.props.toggleItemMenu({ nameItem, open });
    this.props.selectedItemMenu({ nameItem, nameSubItem });
    try {
      this.props.getCustomers();
      this.props.fetchRoles();
    } catch (error) {
      console.error(error.message);
    }
  }

  handleSubmit = async (values, formikActions) => {
    const { setSubmitting, resetForm } = formikActions;
    this.props.setLoading(true);
    const { first_name, last_name, email, username, password } = values;
    const customer_ids = values.customersId.map(({ id }) => id);
    const groups = [values.role_id];
    const app_access = values.enterApp;

    const form = {
      first_name,
      last_name,
      username,
      password,
      email,
      groups,
      app_access,
      customer_ids
    };

    try {
      const response = await this.props.createUser(form);

      if (response.status === 201) {
        resetForm();
        this.props.history.push("/users");
        this.props.enqueueSnackbar("The user has been created!", {
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

  render() {
    const { classes, roles, loading, customers } = this.props;

    return (
      <Layout title="Create User">
        {() => (
          <div className={classes.root}>
            <SimpleBreadcrumbs routes={breadcrumbs} classes={{root: classes.breadcrumbs}}/>
            <Formik
              onSubmit={this.handleSubmit}
              validateOnChange
              initialValues={{
                ...this.form
              }}
              validationSchema={Yup.object().shape({
                email: Yup.string()
                  .email("Must be a valid mail")
                  .required("Email is required"),
                first_name: Yup.string().required("First name is required"),
                last_name: Yup.string().required("Last name is required"),
                password: Yup.string()
                  .min(8)
                  .required("Password is required"),
                username: Yup.string().required("Username is required"),
                role_id: Yup.mixed().required("Role is required"),
                customersId: Yup.array()
                  .min(1, "Select at least one customer")
                  .required("Customer is required")
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
                                name="first_name"
                                value={values.first_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                  !!touched.first_name && !!errors.first_name
                                }
                                helperText={
                                  !!touched.first_name &&
                                  !!errors.first_name &&
                                  errors.first_name
                                }
                                label="First Name"
                                fullWidth
                                margin="normal"
                                required
                              />
                            </Grid>
                            <Grid item xs>
                              <TextField
                                label="Last Name"
                                name="last_name"
                                value={values.last_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!touched.last_name && !!errors.last_name}
                                helperText={
                                  !!touched.last_name &&
                                  !!errors.last_name &&
                                  errors.last_name
                                }
                                fullWidth
                                margin="normal"
                                required
                              />
                            </Grid>
                          </Grid>

                          <Grid container spacing={16}>
                            <Grid item xs>
                              <TextField
                                label="Username"
                                name="username"
                                value={values.username}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!touched.username && !!errors.username}
                                helperText={
                                  !!touched.username &&
                                  !!errors.username &&
                                  errors.username
                                }
                                fullWidth
                                margin="normal"
                                required
                              />
                            </Grid>
                            <Grid item xs>
                              <TextField
                                label="Email"
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!touched.email && !!errors.email}
                                helperText={
                                  !!touched.email &&
                                  !!errors.email &&
                                  errors.email
                                }
                                fullWidth
                                margin="normal"
                                type="email"
                                required
                              />
                            </Grid>
                          </Grid>
                          <Grid container spacing={16}>
                            <Grid item xs>
                              <TextField
                                label="Password"
                                name="password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!touched.password && !!errors.password}
                                helperText={
                                  !!touched.password &&
                                  !!errors.password &&
                                  errors.password
                                }
                                fullWidth
                                margin="normal"
                                type="password"
                                required
                              />
                            </Grid>
                            <Grid item xs>
                              <TextField
                                name="role_id"
                                select
                                label="Roles"
                                value={values.role_id}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!touched.role_id && !!errors.role_id}
                                helperText={
                                  !!touched.role_id &&
                                  !!errors.role_id &&
                                  errors.role_id
                                }
                                margin="normal"
                                fullWidth
                              >
                                {roles.map(role => {
                                  return (
                                    <MenuItem key={role.id} value={role.id}>
                                      {role.name}
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
                                    !!touched.customersId && !!errors.customersId
                                  }
                                >
                                  Customers
                                </InputLabel>
                                <Select
                                  multiple
                                  name="customersId"
                                  value={values.customersId}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={
                                    !!touched.customersId && !!errors.customersId
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
                                  {customers.map(customer => (
                                    <MenuItem key={customer.id} value={customer}>
                                      <Checkbox
                                        checked={
                                          !!values.customersId.find(
                                            c => c.id === customer.id
                                          )
                                        }
                                      />
                                      <ListItemText primary={customer.name} />
                                    </MenuItem>
                                  ))}
                                </Select>
                                <FormHelperText
                                  error={
                                    !!touched.customersId && !!errors.customersId
                                  }
                                >
                                  {!!touched.customersId &&
                                    !!errors.customersId &&
                                    errors.customersId}
                                </FormHelperText>
                              </FormControl>
                            </Grid>
                          </Grid>
                          <Grid container spacing={16}>
                            <Grid item xs>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={values.enterApp}
                                    name="enterApp"
                                    onChange={handleChange}
                                  />
                                }
                                label="Has access to the mobile application"
                              />
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
                      Create User
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
    roles: state.roles.roles,
    customers: state.customers.customers
  };
};

const mapDispatchToProps = {
  fetchRoles,
  fetchStates,
  createUser,
  setHandleForm,
  setLoading,
  toggleItemMenu,
  selectedItemMenu,
  getCustomers
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "UserCreate" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(UserCreate);
