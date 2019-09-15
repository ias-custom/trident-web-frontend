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
import {
  getCustomer,
  updateCustomer
} from "../../../redux/actions/customerActions";
import AddIcon from "@material-ui/icons/Add";
import InputFiles from "react-input-files";

const breadcrumbs = [
  { name: "Home", to: "/home" },
  { name: "Customers", to: "/customers" },
  { name: "Edit Customer", to: null }
];

class CustomerEdit extends React.Component {
  state = {};

  form = {
    name: "",
    logo: null
  };

  customerId = null;
  logoFile = null;

  componentDidMount = async () => {
    try {
      this.customerId = this.props.match.params.id;
      const response = await this.props.getCustomer(this.customerId);
      if (response.status === 200) {
        this.loadForm(response.data);
      } else {
        this.props.history.push("/404");
      }
    } catch (error) {
      console.error(error);
    }
  };

  loadForm(data) {
    const { name, thumbnail } = data;
    this.form.name = name;
    this.form.logo = thumbnail;
    this.setState({});
  }

  handleSubmit = async (values, formikActions) => {
    const { setSubmitting, resetForm } = formikActions;
    this.props.setLoading(true);
    const { name } = values;

    let formData = new FormData();
    formData.append("name", name);
    if (this.logoFile) formData.append("logo", this.logoFile);

    try {
      const response = await this.props.updateCustomer(
        this.customerId,
        formData
      );

      if (response.status === 200) {
        resetForm();
        this.props.history.push("/customers");
        this.props.enqueueSnackbar("The customer has been created!", {
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
    const { classes, loading } = this.props;

    return (
      <Layout title="Create Customer">
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
                logo: Yup.mixed().required("Logo is required")
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

                          <Grid
                            container
                            spacing={16}
                            className={classes.divLogo}
                          >
                            <Grid item xs className={classes.divPermissions}>
                              <Typography variant="subtitle1" gutterBottom>
                                Logo
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid container spacing={16}>
                            <Grid item xs={3}>
                              <InputFiles
                                name="logo"
                                style={{ width: "100%", height: "140px" }}
                                accept="images/*"
                                onChange={files => {
                                  this.logoFile = files[0];
                                  setFieldValue(
                                    "logo",
                                    URL.createObjectURL(files[0])
                                  );
                                }}
                              >
                                <Grid item xs className={classes.gridLogo}>
                                  {values.logo ? (
                                    <img src={values.logo} alt="logo" />
                                  ) : (
                                    <AddIcon
                                      color="primary"
                                      style={{ fontSize: 30 }}
                                    />
                                  )}
                                </Grid>
                              </InputFiles>
                            </Grid>
                          </Grid>
                        </Panel>
                      </Grid>
                    </Grid>

                    <br />

                    <Button
                      disabled={
                        loading ||
                        isSubmitting ||
                        (isValid && !dirty) ||
                        (!isValid && dirty)
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
  getCustomer,
  updateCustomer
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "CustomerEdit" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(CustomerEdit);
