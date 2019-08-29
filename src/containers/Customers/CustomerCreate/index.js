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
import { createCustomer } from "../../../redux/actions/customerActions";
import AddIcon from "@material-ui/icons/Add";
import InputFiles from "react-input-files";

const breadcrumbs = [
  { name: "Home", to: "/home" },
  { name: "Customers", to: "/customers" },
  { name: "Create Customer", to: null }
];

class CustomerCreate extends React.Component {
  state = {};

  form = {
    name: "",
    logo: null
  };

  componentDidMount() {
    const nameItem = "customers";
    const nameSubItem = "create";
    const open = true;
    this.props.toggleItemMenu({ nameItem, open });
    this.props.selectedItemMenu({ nameItem, nameSubItem });
  }

  handleSubmit = async (values, formikActions) => {
    const { setSubmitting, resetForm } = formikActions;
    this.props.setLoading(true);
    const { name, logo } = values;

    let formData = new FormData();
    formData.append("name", name);
    formData.append("logo", logo);

    try {
      const response = await this.props.createCustomer(formData);

      if (response.status === 201) {
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
                              Logo *
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid container spacing={16}>
                          <Grid item xs={3}>
                            <InputFiles
                              name="logo"
                              style={{ width: "100%", height: "140px" }}
                              accept="image/*"
                              onChange={files => {
                                setFieldValue("logo", files[0]);
                              }}
                            >
                              <Grid item xs className={classes.gridLogo}>
                                {values.logo ? (
                                  <img
                                    src={
                                      values.logo &&
                                      URL.createObjectURL(values.logo)
                                    }
                                    alt="logo"
                                  />
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
                    disabled={loading || isSubmitting || !isValid || !dirty}
                    onClick={e => {
                      handleSubmit(e);
                    }}
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Create Customer
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
  createCustomer
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "CustomerCreate" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(CustomerCreate);
