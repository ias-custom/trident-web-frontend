import React from "react";
import {
  Grid,
  TextField,
  Button,
  Typography
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

import styles from "./styles";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import CheckboxGroup  from "../../../components/CheckboxGroup";
import { getRole, updateRole } from "../../../redux/actions/roleActions";

const FakeRoles = [
  { id: 70, name: "user" },
  { id: 69, name: "superUser" },
  { id: 71, name: "employee" },
  { id: 72, name: "bussiness man" },
  { id: 73, name: "role test" }
];  
const breadcrumbs = [
  { name: "Home", to: "/home" },
  { name: "Roles", to: "/roles" },
  { name: "Edit Role", to: null }
];

class RoleEdit extends React.Component {
  state = {};

  form = {
    name: "",
    permissionsId: []
  };

  roleId = null
  componentDidMount = async () => {
    try {
      this.roleId = this.props.match.params.id
      const response = await this.props.getRole(this.roleId);
      if (response.status === 200) {
        this.loadForm(response.data);
      } else {
        this.props.history.push("/404");
      }
    } catch (error) {
      console.error(error);
    }
  }

  handleSubmit = async (values, formikActions) => {
    const { setSubmitting, resetForm } = formikActions;
    this.props.setLoading(true);
    const { name, permissionsId } = values

    const form = { name, permissions: permissionsId };
    
    try {
      const response = await this.props.updateRole(this.roleId, form);

      if (response.status === 200) {
        resetForm();
        this.props.history.push("/roles");
        this.props.enqueueSnackbar("The role has been updated", {
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

  loadForm = data => {
    const { name, permissions, } = data;
    this.form.name = name;
    this.form.permissionsId = permissions;  
    this.setState({})
  };

  changeCheckbox (roleId, add, props) {
    const { setFieldValue, values } = props
    if (add) {
      setFieldValue("permissionsId", [
        ...values.permissionsId,
        roleId
      ])
      return      
    }
    setFieldValue("permissionsId", values.permissionsId.filter( id => id !== roleId))
  }
  render() {
    const { classes, loading } = this.props;

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
                          <Grid item xs className={classes.divPermissions}>
                            <Typography variant="subtitle1" gutterBottom>
                              Permissions
                            </Typography>
                          </Grid>
                        </Grid>
                        <CheckboxGroup roles={FakeRoles} permissionsId={values.permissionsId} onChange={ (roleId, add) => {this.changeCheckbox(roleId, add, props)}}></CheckboxGroup>
                      </Panel>
                    </Grid>
                  </Grid>

                  <br />
                  
                  <Button
                    disabled={loading || isSubmitting || (isValid && !dirty) || (!isValid && dirty) }
                    onClick={e => {
                      handleSubmit(e);
                    }}
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    SAVE
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
  selectedItemMenu,
  updateRole,
  getRole
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "RoleCreate" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(RoleEdit);
