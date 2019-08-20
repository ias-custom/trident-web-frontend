import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Chip
} from "@material-ui/core";
import { compose } from "recompose";
import { withRouter, Prompt } from "react-router-dom";
import { connect } from "react-redux";
import { withSnackbar } from "notistack";
import Layout from "../../../components/Layout/index";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";
import SimpleBreadcrumbs from "../../../components/SimpleBreadcrumbs";
import Panel from "../../../components/Panel";
import {
  fetchRoles,
  setLoading,
} from "../../../redux/actions/globalActions";
import { getCustomers } from "../../../redux/actions/customerActions"
import { getUser, updateUser } from "../../../redux/actions/userActions";
import ListItemText from "@material-ui/core/ListItemText";
import Input from "@material-ui/core/Input";
import { Form, Formik } from "formik";
import * as Yup from "yup";

const breadcrumbs = [
  { name: "Home", to: "/home" },
  { name: "Users", to: "/users" },
  { name: "Edit User", to: null }
];

class UserEdit extends React.Component {
  state = {
    tab: 0,
    user: {}
  };

  form = {
    username: "",
    email: "",
    role_id: "",
    first_name: "",
    last_name: "",
    customersId: [],
    enterApp: false
  };

  userId = null

  componentDidMount = async () => {
    await this.props.fetchRoles()
    await this.props.getCustomers();
    try {
      this.userId = this.props.match.params.id;
      const response = await this.props.getUser(this.userId);
      if (response.status === 200) {
        this.loadForm(response.data);
      } else {
        this.props.history.push("/404");
      }
    } catch (error) {
      console.error(error);
    }
  };

  loadForm = data => {
    const { first_name, last_name, email, username, groups, customer_ids } = data;
    this.form.username = username;
    this.form.email = email;
    this.form.first_name = first_name;
    this.form.last_name = last_name;
    this.form.role_id = groups[0] || "";
    this.form.enterApp = data.app_access || false;
    this.form.customersId = customer_ids
    this.setState({})
  };

  handleChange = event => {
    const form = this.state.form;
    form[event.target.name] = event.target.value;

    this.setState({ form });
  };

  handleTab = (event, tab) => {
    this.setState({ tab });
  };

  handleSubmit = async (values, formikActions) => {   
    const { setSubmitting, resetForm } = formikActions;
    this.props.setLoading(true);
    const {
      first_name,
      last_name,
      email,
      username,
      password
    } = values;
    const customer_ids = values.customersId
    const groups = [values.role_id]
    const app_access = values.enterApp

    const form = { first_name, last_name, username, password, email, groups, app_access, customer_ids };
    
    try {
      const response = await this.props.updateUser(this.userId, form);

      if (response.status === 200) {
        resetForm();
        this.props.history.push("/users");
        this.props.enqueueSnackbar("The user has been updated!", {
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
    const {
      classes,
      loading,
      roles,
      customers
    } = this.props;

    return (
      <Layout title="Edit User">
        <div className={classes.root}>
          <SimpleBreadcrumbs routes={breadcrumbs} />
          <Formik
            onSubmit={this.handleSubmit}
            validateOnChange
            enableReinitialize
            initialValues={{
              ...this.form
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email("Must be a valid mail")
                .required("Email is required"),
              first_name: Yup.string().required("First name is required"),
              last_name: Yup.string().required("Last name is required"),
              username: Yup.string().required("Username is required"),
              role_id: Yup.mixed().required("Role is required"),
              customersId: Yup.array()
                .min(1)
                .required("Role is required")
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
                          <Grid item xs>
                            <FormControl fullWidth margin="normal">
                              <InputLabel htmlFor="select-multiple-chip">
                                Customers
                              </InputLabel>
                              <Select
                                multiple
                                name="customersId"
                                value={values.customersId}
                                onChange={handleChange}
                                input={<Input id="select-multiple-chip" />}
                                renderValue={selected => (
                                  <div className={classes.chips}>
                                    {selected.map( selectedId => (
                                      <Chip
                                        key={selectedId}
                                        label={(customers.find( ({id}) => id === selectedId)).name}
                                        className={classes.chip}
                                      />
                                    ))}
                                  </div>
                                )}
                                fullWidth
                              >
                                {customers.map(customer => (
                                  <MenuItem key={customer.id} value={customer.id}>
                                    <Checkbox
                                      checked={
                                        !!values.customersId.find(
                                          id => id === customer.id
                                        )
                                      }
                                    />
                                    <ListItemText primary={customer.name} />
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                        <Grid container spacing={16}>
                          <Grid item xs>
                            <FormControlLabel
                              control={<Checkbox checked={values.enterApp} name="enterApp" onChange={handleChange}/>}
                              label="Has access to the mobile application"
                            />
                          </Grid>
                        </Grid>
                      </Panel>
                    </Grid>
                  </Grid>

                  <br />

                  <Button
                    disabled={loading || isSubmitting || (isValid && !dirty) || (!isValid && dirty)}
                    onClick={e => {
                      handleSubmit(e);
                    }}
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    GUARDAR
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.global.loading,
    roles: state.global.roles,
    customers: state.customers.customers
  };
};

const mapDispatchToProps = {
  fetchRoles,
  getCustomers,
  getUser,
  updateUser,
  setLoading
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "UserEdit" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(UserEdit);
