import React, { useEffect } from "react";
import { Panel } from "..";
import { Grid, TextField, MenuItem, Button } from "@material-ui/core";
import { Prompt } from "react-router-dom";
import { compose } from "recompose";
import styles from "./styles";
import { withSnackbar } from "notistack";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { getSubstations } from "../../redux/actions/substationActions";
const FormLine = ({ ...props }) => {
  const {
    loading,
    substations,
    getSubstations,
    form,
    action,
    isCreate
  } = props;

  useEffect(() => {
    getSubstations();
    return () => {};
  }, []);

  return (
    <div>
      <Panel>
        <Formik
          onSubmit={action}
          validateOnChange
          enableReinitialize
          initialValues={{
            ...form
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required("Name is required"),
            start_substation: Yup.mixed().required(
              "Start substation is required"
            ),
            end_substation: Yup.mixed().required("End substation is required")
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
              <Form onSubmit={handleSubmit}>
                <Prompt
                  when={dirty}
                  message="Are you sure you want to leave?, You will lose your changes"
                />
                <Grid container spacing={16}>
                  <Grid item xs={6}>
                    <TextField
                      name="name"
                      label="Name"
                      required
                      value={values.name}
                      margin="normal"
                      disabled={loading}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      fullWidth
                      error={!!touched.name && !!errors.name}
                      helperText={
                        !!touched.name && !!errors.name && errors.name
                      }
                    ></TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      name="accounting_code"
                      label="Accounting Code"
                      value={values.accounting_code}
                      margin="normal"
                      disabled={loading}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        !!touched.accounting_code && !!errors.accounting_code
                      }
                      helperText={
                        !!touched.accounting_code &&
                        !!errors.accounting_code &&
                        errors.accounting_code
                      }
                      fullWidth
                    ></TextField>
                  </Grid>
                </Grid>
                <Grid container spacing={16}>
                  <Grid item xs={6}>
                    <TextField
                      name="start_substation"
                      select
                      label="Start substation"
                      required
                      value={values.start_substation}
                      margin="normal"
                      disabled={loading}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        !!touched.start_substation && !!errors.start_substation
                      }
                      helperText={
                        !!touched.start_substation &&
                        !!errors.start_substation &&
                        errors.start_substation
                      }
                      fullWidth
                    >
                      {substations
                        .filter(sub => sub.id !== values.end_substation)
                        .map(sub => {
                          return (
                            <MenuItem key={sub.id} value={sub.id}>
                              {sub.name}
                            </MenuItem>
                          );
                        })}
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      name="end_substation"
                      select
                      label="End substation"
                      required
                      value={values.end_substation}
                      margin="normal"
                      disabled={loading}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        !!touched.end_substation && !!errors.end_substation
                      }
                      helperText={
                        !!touched.end_substation &&
                        !!errors.end_substation &&
                        errors.end_substation
                      }
                      fullWidth
                    >
                      {substations
                        .filter(({ id }) => id !== values.start_substation)
                        .map(sub => {
                          return (
                            <MenuItem key={sub.id} value={sub.id}>
                              {sub.name}
                            </MenuItem>
                          );
                        })}
                    </TextField>
                  </Grid>
                </Grid>
                <br />
                <Grid container>
                  <Button
                    disabled={
                      isCreate
                        ? loading || isSubmitting || !isValid || !dirty
                        : loading ||
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
                    {isCreate === true ? "Save" : "Update"}
                  </Button>
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Panel>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    loading: state.global.loading,
    substations: state.substations.list
  };
};

const mapDispatchToProps = {
  getSubstations
};

export default compose(
  withSnackbar,
  withStyles(styles, { name: "FormLine" }),
  connect(mapStateToProps, mapDispatchToProps)
)(FormLine);
