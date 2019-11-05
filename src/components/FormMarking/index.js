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
import { getCategoriesMarking } from "../../redux/actions/projectActions";
import { addMarking, updateMarking } from "../../redux/actions/spanActions";

const FormMarking = ({ ...propsMain }) => {
  const { loading, spans, categories_marking } = propsMain;

  useEffect(() => {
    propsMain.getCategoriesMarking();
    return () => {};
  }, []);

  async function submit(values, formikActions) {
    const { setSubmitting, resetForm } = formikActions;
    const { type_id, owner, latitude, longitude, notes, category_id, span_id } = values;
    const form = {
      type_id,
      owner,
      latitude,
      longitude,
      notes,
      category_id
    };
    try {
      let response = ""
      if(propsMain.isCreate) response = await propsMain.addMarking(span_id, form)
      else response = await propsMain.updateMarking(span_id, propsMain.markingId, form)

      if (response.status === 201 || response.status === 200) {
        let message = "The marking was updated successfully"
        if(propsMain.isCreate) {
          message = "The marking was added successfully!"
          resetForm();
          this.setState(prevState => {
            return { form: { ...prevState.form, latitude: "", longitude: "" } };
          });
        }
        this.props.enqueueSnackbar(message, {
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
  }

  return (
    <div>
      <Panel>
        <Formik
          onSubmit={submit}
          validateOnChange
          enableReinitialize
          initialValues={{
            ...propsMain.form
          }}
          validationSchema={Yup.object().shape({
            type_id: Yup.mixed().required("Marking type is required"),
            owner: Yup.string().required("Owner is required"),
            notes: Yup.string().required("Notes is required"),
            longitude: Yup.string().required("Longitude is required"),
            latitude: Yup.string().required("Latitude is required"),
            category_id: Yup.mixed().required("Category is required")
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
                      name="span_id"
                      select
                      label="Span"
                      required
                      value={values.span_id}
                      margin="normal"
                      disabled={loading}
                      onChange={handleChange}
                      onBlur={handleBlur}
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
                  <Grid item xs={6}>
                    <TextField
                      name="category_id"
                      select
                      label="Category"
                      required
                      value={values.category_id}
                      margin="normal"
                      disabled={loading}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!touched.category_id && !!errors.category_id}
                      helperText={
                        !!touched.category_id &&
                        !!errors.category_id &&
                        errors.category_id
                      }
                      fullWidth
                    >
                      {categories_marking.map(category => {
                        return (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        );
                      })}
                    </TextField>
                  </Grid>
                </Grid>
                <Grid container spacing={16}>
                  <Grid item xs={6}>
                    <TextField
                      name="type_id"
                      select
                      label="Type"
                      required
                      value={values.type_id}
                      margin="normal"
                      disabled={loading || values.category_id === ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!touched.type_id && !!errors.type_id}
                      helperText={
                        !!touched.type_id && !!errors.type_id && errors.type_id
                      }
                      fullWidth
                    >
                      {values.category_id !== "" ? (
                        categories_marking
                          .find(({ id }) => id === values.category_id)
                          .types.map(type => {
                            return (
                              <MenuItem key={type.id} value={type.id}>
                                {type.name}
                              </MenuItem>
                            );
                          })
                      ) : (
                        <MenuItem key={"other"} value={"other"}>
                          other
                        </MenuItem>
                      )}
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      name="owner"
                      label="Owner"
                      required
                      value={values.owner}
                      margin="normal"
                      disabled={loading}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!touched.owner && !!errors.owner}
                      helperText={
                        !!touched.owner && !!errors.owner && errors.owner
                      }
                      fullWidth
                    ></TextField>
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
                      propsMain.isCreate
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
                    {propsMain.isCreate === true ? "Save" : "Update"}
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
    marking_types: state.projects.marking_types,
    spans: state.spans.spans,
    categories_marking: state.projects.categories_marking
  };
};

const mapDispatchToProps = {
  getCategoriesMarking,
  addMarking,
  updateMarking
};

export default compose(
  withSnackbar,
  withStyles(styles, { name: "FormMarking" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(FormMarking);
