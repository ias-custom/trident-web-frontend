import React from "react";
import { Grid, TextField, Button, Typography } from "@material-ui/core";
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
import CheckboxGroup from "../../../components/CheckboxGroup";
import { createRole } from "../../../redux/actions/roleActions";

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
    const { name, permissionsId } = values;
    const form = { name, permissions: permissionsId };

    try {
      const response = await this.props.createRole(form);

      if (response.status === 201) {
        resetForm();
        this.props.history.push("/roles");
        this.props.enqueueSnackbar("The role has been created!", {
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

  changeCheckbox(permissions, add, props) {
    const { setFieldValue, values } = props;
    const permissionsFinal = new Set([...values.permissionsId, ...permissions]);
    if (add) {
      setFieldValue("permissionsId", [...permissionsFinal]);
      return;
    }
    setFieldValue(
      "permissionsId",
      values.permissionsId.filter(id => !permissions.includes(id))
    );
  }
  render() {
    const { classes, loading } = this.props;

    return (
      <Layout title="Create Role">
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
                          <CheckboxGroup
                            permissionsId={values.permissionsId}
                            onChange={(permissions, add) => {
                              this.changeCheckbox(permissions, add, props);
                            }}
                          />
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
        )}
        
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
  createRole
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
