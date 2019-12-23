import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import styles from "./styles";
import { withRouter, Prompt } from "react-router-dom";
import { withSnackbar } from "notistack";
import {
  Button,
  withStyles,
  Grid,
  TextField,
  MenuItem,
} from "@material-ui/core";
import { Form } from "formik";
import { fetchStructureTypes } from "../../redux/actions/structureActions";
import { fetchStates } from "../../redux/actions/globalActions";
import { getProject } from "../../redux/actions/projectActions";

const TITLE_CHOICES = [
  { id: 0, name: "Occupant" },
  { id: 1, name: "Property Owner" },
  { id: 2, name: "Police" }
];

const TYPE_CHOICES = [{ id: 0, name: "Negative" }, { id: 1, name: "Positive" }];

const FormInteraction = ({ ...props }) => {
  const {
    dirty,
    values,
    touched,
    errors,
    loading,
    isValid,
    isCreate,
    isSubmitting
  } = props;
  return (
    <Form onSubmit={props.handleSubmit}>
      <Prompt
        when={dirty}
        message="Are you sure you want to leave?, You will lose your changes"
      />
      <Grid item sm={12} md={12}>
        <Grid container spacing={16}>
          <Grid item xs>
            <TextField
              name="name"
              value={values.name}
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              error={!!touched.name && !!errors.name}
              helperText={!!touched.name && !!errors.name && errors.name}
              label="Name"
              fullWidth
              margin="normal"
              required
              disabled={loading}
            />
          </Grid>
        </Grid>
        <Grid container spacing={16}>
          <Grid item xs>
            <TextField
              name="titleId"
              select
              label="Title"
              value={values.titleId}
              margin="normal"
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              error={!!touched.titleId && !!errors.titleId}
              helperText={
                !!touched.titleId && !!errors.titleId && errors.titleId
              }
              fullWidth
              required
              disabled={loading}
            >
              {TITLE_CHOICES.map(title => {
                return (
                  <MenuItem key={title.id} value={title.id}>
                    {title.name}
                  </MenuItem>
                );
              })}
            </TextField>
          </Grid>
          <Grid item xs>
            <TextField
              name="typeId"
              select
              label="Type"
              value={values.typeId}
              margin="normal"
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              error={!!touched.typeId && !!errors.typeId}
              helperText={!!touched.typeId && !!errors.typeId && errors.typeId}
              fullWidth
              required
              disabled={loading}
            >
              {TYPE_CHOICES.map(type => {
                return (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                );
              })}
            </TextField>
          </Grid>
        </Grid>
        <Grid container spacing={16}>
          <Grid item xs>
            <TextField
              label="Latitude"
              name="latitude"
              value={values.latitude}
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              error={!!touched.latitude && !!errors.latitude}
              helperText={
                !!touched.latitude && !!errors.latitude && errors.latitude
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
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              error={!!touched.longitude && !!errors.longitude}
              helperText={
                !!touched.longitude && !!errors.longitude && errors.longitude
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
              multiline
              name="contactInfo"
              rows="2"
              rowsMax="5"
              label="Contact info"
              value={values.contactInfo}
              margin="normal"
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              error={!!touched.contactInfo && !!errors.contactInfo}
              helperText={
                !!touched.contactInfo &&
                !!errors.contactInfo &&
                errors.contactInfo
              }
              fullWidth
              disabled={loading}
            ></TextField>
          </Grid>
          <Grid item xs>
            <TextField
              multiline
              name="notes"
              rows="2"
              rowsMax="5"
              label="Notes"
              value={values.notes}
              margin="normal"
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              error={!!touched.notes && !!errors.notes}
              helperText={!!touched.notes && !!errors.notes && errors.notes}
              fullWidth
              disabled={loading}
            ></TextField>
          </Grid>
        </Grid>
      </Grid>
      <br />
      <Grid container justify="flex-end">
        {isCreate ? (
          <Button
            disabled={loading || isSubmitting || !isValid || !dirty}
            onClick={e => props.handleSubmit(e)}
            color="primary"
            variant="contained"
            fullWidth
          >
            Save
          </Button>
        ) : (
          <Button
            disabled={
              loading ||
              isSubmitting ||
              (isValid && !dirty) ||
              (!isValid && dirty)
            }
            onClick={e => props.handleSubmit(e)}
            variant="contained"
            color="primary"
            fullWidth
          >
            Update
          </Button>
        )}
      </Grid>
    </Form>
  );
};

const mapStateToProps = state => {
  return {
    loading: state.global.loading,
    structureTypes: state.structures.structureTypes,
    states: state.global.states
  };
};

const mapDispatchToProps = {
  fetchStructureTypes,
  fetchStates,
  getProject
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(FormInteraction);
