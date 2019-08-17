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
  FormGroup
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
import {
  toggleItemMenu,
  selectedItemMenu
} from "../../../redux/actions/layoutActions";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";

import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

import styles from "./styles";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const FakeRoles = [
  { id: 1, name: "user" },
  { id: 2, name: "superUser" },
  { id: 3, name: "employee" },
  { id: 4, name: "bussiness man" }
];
const breadcrumbs = [
  { name: "Home", to: "/home" },
  { name: "Roles", to: "/roles" },
  { name: "Create Role", to: null }
];

class RoleCreate extends React.Component {
  state = {};

  form = {
    name: "",
    permissionsId: []
  };

  componentDidMount() {
    const nameItem = "roles";
    const nameSubItem = "create";
    const open = true;
    this.props.toggleItemMenu({ nameItem, open });
    this.props.selectedItemMenu({ nameItem, nameSubItem });
  }

  handleSubmit = async (values, formikActions) => {
    const { setSubmitting, resetForm } = formikActions;
    this.props.setLoading(true);
    const { first_name, last_name, email, username, password } = values;
    const customersId = values.customersId.map(({ id }) => id);
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
      customersId
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

  handleTab = (event, tab) => {
    this.setState({ tab });
  };

  isInside = (permissionsId, roleId) => {
    return !!permissionsId.find(permission => permission.id === roleId);
  };
  render() {
    const { classes, loading } = this.props;

    const formats = [];
    return (
      <Layout title="Create Role">
        <div className={classes.root}>
          <SimpleBreadcrumbs routes={breadcrumbs} />

          <Formik
            onSubmit={this.handleSubmit}
            validateOnChange
            initialValues={{
              ...this.form
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string().required("Name is required"),
              permissionsId: Yup.array()
                .min(1)
                .required("Permissions is required")
            })}
            enableReinitialize
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
                handleSubmit,
                setFieldValue
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
                            {JSON.stringify(formats)}
                            {FakeRoles.map(role => (
                              <FormControlLabel
                                key={role.id}
                                control={
                                  <Checkbox
                                    checked={this.isInside(
                                      values.permissionsId,
                                      role.id
                                    )}
                                    onClick={() => {
                                      if (
                                        this.isInside(
                                          values.permissionsId,
                                          role.id
                                        )
                                      ) {
                                        setFieldValue(
                                          "permissionsId",
                                          values.permissionsId.filter(
                                            permission =>
                                              permission.id !== role.id
                                          )
                                        );
                                        return;
                                      }
                                      setFieldValue("permissionsId", [
                                        ...values.permissionsId,
                                        role
                                      ]);
                                    }}
                                  />
                                }
                                label="Has access to the mobile application"
                              />
                            ))}
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
                    Create Role
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
    loading: state.global.loading
  };
};

const mapDispatchToProps = {
  setLoading,
  toggleItemMenu,
  selectedItemMenu
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "RoleCreate" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(RoleCreate);
