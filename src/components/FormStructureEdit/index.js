import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import styles from "./styles";
import { withRouter, Prompt } from "react-router-dom";
import { withSnackbar } from "notistack";
import PropTypes from "prop-types";
import {
  Button,
  withStyles,
  Grid,
  TextField,
  MenuItem
} from "@material-ui/core";
import { Form } from "formik";
import { fetchStructureTypes } from "../../redux/actions/structureActions";
import { fetchStates, fetchInspections } from "../../redux/actions/globalActions";
import { getProject } from "../../redux/actions/projectActions";

const FormStructureEdit = ({ ...props }) => {
  const [inspections, setInspections] = useState([]);
  const {
    dirty,
    values,
    touched,
    errors,
    loading,
    isSubmitting,
    isValid,
    states,
    isCreate,
    forLine
  } = props;

  async function getProject() {
    const response = await props.getProject(props.projectId, false);
    if (response.status === 200) {
      const { set } = response.data;
      setInspections(
        set.inspections.filter(({ belong_to }) => belong_to === "Structure")
      );
    }
  }

  async function getInspections() {
    const response = await props.fetchInspections();
    if (response.status === 200) {
      setInspections(response.data);
    }
  }

  useEffect(() => {
    //props.fetchStructureTypes(props.projectId);
    props.fetchStates();
    if (forLine) {
      getInspections()
    } else {
      getProject();
    }
    return () => {};
  }, []);
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
              name="number"
              value={values.number}
              onChange={e => {
                e.target.value = e.target.value.replace(/\s/g, "");
                props.handleChange(e);
              }}
              onBlur={props.handleBlur}
              label="Number"
              fullWidth
              margin="normal"
              error={!!touched.number && !!errors.number}
              helperText={!!touched.number && !!errors.number && errors.number}
              required
            />
          </Grid>
        </Grid>{/* 
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
        </Grid> */}
        <Grid container spacing={16}>
          <Grid item xs>
            <TextField
              name="address"
              value={values.address}
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              label="Address"
              fullWidth
              margin="normal"
              disabled={loading}
            />
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
          {!forLine && (
            <Grid item xs>
              <TextField
                name="stateId"
                select
                label="State"
                value={values.stateId}
                margin="normal"
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                error={!!touched.stateId && !!errors.stateId}
                helperText={
                  !!touched.stateId && !!errors.stateId && errors.stateId
                }
                fullWidth
                required
                disabled
              >
                {states.map(state => {
                  return (
                    <MenuItem key={state.id} value={state.id}>
                      {state.name}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>
          )}

          <Grid item xs={6}>
            <TextField
              name="inspectionId"
              select
              label="Inspection"
              value={values.inspectionId}
              margin="normal"
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              error={!!touched.inspectionId && !!errors.inspectionId}
              helperText={
                !!touched.inspectionId &&
                !!errors.inspectionId &&
                errors.inspectionId
              }
              fullWidth
              required
              disabled={loading}
            >
              {inspections.map(inspection => {
                return (
                  <MenuItem key={inspection.id} value={inspection.id}>
                    {inspection.name}
                  </MenuItem>
                );
              })}
            </TextField>
            {/* <div style={{display: "flex"}}>
              <TextField
                name="structureTypeId"
                select
                label="Stucture type"
                value={values.structureTypeId}
                margin="normal"
                onChange={this.props.handleChange}
                onBlur={this.props.handleBlur}
                error={!!touched.structureTypeId && !!errors.structureTypeId}
                helperText={
                  !!touched.structureTypeId &&
                  !!errors.structureTypeId &&
                  errors.structureTypeId
                }
                fullWidth
                disabled={loading}
              >
                {structureTypes.map(type => {
                  return (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  );
                })}
              </TextField>
              {isCreate ? (
                <div>
                  <Tooltip title="Add structure type" aria-label="Add" placement="top-start">
                    <IconButton disabled={loading} className={classes.iconAdd} onClick={ this.props.showModal}>
                      <AddCircle/>
                    </IconButton> 
                  </Tooltip>
                </div>
              ) : null}
            </div> */}
          </Grid>
        </Grid>
      </Grid>
      <br />
      <Grid container justify="flex-end">
        {isCreate ? (
          <Button
            style={{ marginLeft: 10 }}
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
  getProject,
  fetchInspections
};

FormStructureEdit.propTypes = {
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isCreate: PropTypes.bool.isRequired
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(FormStructureEdit);
