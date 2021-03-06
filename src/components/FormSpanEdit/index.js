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
import { fetchSpanTypes } from "../../redux/actions/spanActions";
import { fetchStates } from "../../redux/actions/globalActions";
import { getProject } from "../../redux/actions/projectActions";

const FormSpanEdit = ({ ...props }) => {
  const [inspections, setInspections] = useState([]);
  const [numberStart, setNumberStart] = useState("");
  const [numberEnd, setNumberEnd] = useState("");
  const {
    //classes,
    dirty,
    values,
    touched,
    errors,
    loading,
    isSubmitting,
    isValid,
    states,
    //spansTypes,
    structures,
    isCreate,
    setFieldValue
  } = props;

  async function getProject() {
    const response = await props.getProject(props.projectId, false);
    if (response.status === 200) {
      const { set } = response.data;
      if (props.isCreate) {
        props.setFieldValue(
          "inspectionId",
          set.inspections.find(({ belong_to }) => belong_to === "Span").id
        );
      }
      setInspections(set.inspections);
    }
  } 
  useEffect(() => {
    props.fetchSpanTypes(props.projectId);
    props.fetchStates();
    getProject()
    if (values.structureStart && values.structureEnd) {
      let numberStart = structures.find(
        ({ id }) => id === parseInt(values.structureStart.split("-")[0])
      ).number;
      let numberEnd = structures.find(
        ({ id }) => id === parseInt(values.structureEnd.split("-")[0])
      ).number;
      props.setFieldValue("number", `Span ${numberStart}-${numberEnd}`);
      setNumberStart(numberStart);
      setNumberEnd(numberEnd);
    }
    return () => {};
  }, []);
  
  return (
    <Form onSubmit={props.handleSubmit}>
      <Prompt
        when={dirty}
        message="Are you sure you want to leave?, You will lose your changes"
      />
      <Grid container>
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
                helperText={
                  !!touched.number && !!errors.number && errors.number
                }
                required
                disabled
              />
            </Grid>
          </Grid>
          <Grid container spacing={16}>
            <Grid item xs>
              <TextField
                name="structureStart"
                select
                label="Start structure or substation"
                value={values.structureStart}
                margin="normal"
                onChange={e => {
                  const structureId = parseInt(e.target.value.split("-")[0]);
                  const numberStart = structures.find(
                    ({ id }) => id === structureId
                  ).number;
                  if (values.structureEnd) {
                    setFieldValue("number", `Span ${numberStart}-${numberEnd}`);
                  }
                  setNumberStart(numberStart);
                  props.handleChange(e);
                }}
                onBlur={props.handleBlur}
                error={!!touched.structureStart && !!errors.structureStart}
                helperText={
                  !!touched.structureStart &&
                  !!errors.structureStart &&
                  errors.structureStart
                }
                fullWidth
                disabled={loading}
                required
              >
                {structures
                  .filter(item => {
                    if (item.project_ids !== undefined)
                      return `${item.id}-sub` !== values.structureEnd;
                    return `${item.id}-st` !== values.structureEnd;
                  })
                  .map(structure => {
                    return (
                      <MenuItem
                        key={structure.id}
                        value={`${structure.id}-${
                          structure.project_ids !== undefined ? "sub" : "st"
                        }`}
                      >
                        {structure.number}
                      </MenuItem>
                    );
                  })}
              </TextField>
            </Grid>
            <Grid item xs>
              <TextField
                name="structureEnd"
                select
                label="End structure or substation"
                value={values.structureEnd}
                margin="normal"
                onChange={e => {
                  const structureId = parseInt(e.target.value.split("-")[0]);
                  const numberEnd = structures.find(
                    ({ id }) => id === structureId
                  ).number;
                  if (values.structureStart) {
                    setFieldValue("number", `Span ${numberStart}-${numberEnd}`);
                  }
                  setNumberEnd(numberEnd);
                  props.handleChange(e);
                }}
                onBlur={props.handleBlur}
                error={!!touched.structureEnd && !!errors.structureEnd}
                helperText={
                  !!touched.structureEnd &&
                  !!errors.structureEnd &&
                  errors.structureEnd
                }
                fullWidth
                disabled={loading}
                required
              >
                {structures
                  .filter(item => {
                    if (item.project_ids !== undefined)
                      return `${item.id}-sub` !== values.structureStart;
                    return `${item.id}-st` !== values.structureStart;
                  })
                  .map(structure => {
                    return (
                      <MenuItem
                        key={structure.id}
                        value={`${structure.id}-${
                          structure.project_ids !== undefined ? "sub" : "st"
                        }`}
                      >
                        {structure.number}
                      </MenuItem>
                    );
                  })}
              </TextField>
            </Grid>
          </Grid>
          <Grid container spacing={16}>
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
                disabled
                required
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
            <Grid item xs>
              {/* <div style={{ display: "flex" }}>
                  <TextField
                    name="spanType"
                    select
                    label="Span type"
                    value={values.spanType}
                    margin="normal"
                    onChange={this.props.handleChange}
                    onBlur={this.props.handleBlur}
                    error={!!touched.spanType && !!errors.spanType}
                    helperText={
                      !!touched.spanType && !!errors.spanType && errors.spanType
                    }
                    fullWidth
                    disabled={loading}
                    required
                  >
                    {spansTypes.map(type => {
                      return (
                        <MenuItem key={type.id} value={type.id}>
                          {type.name}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                  {isCreate ? (
                    <div>
                      <Tooltip
                        title="Add span type"
                        aria-label="Add"
                        placement="top-start"
                      >
                        <IconButton
                          className={classes.iconAdd}
                          onClick={this.props.showModal}
                        >
                          <AddCircle />
                        </IconButton>
                      </Tooltip>
                    </div>
                  ) : null}
                </div> */}
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
                disabled
                required
              >
                {inspections.map(inspection => {
                  return (
                    <MenuItem key={inspection.id} value={inspection.id}>
                      {inspection.name}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>
          </Grid>
          {/* <Grid container spacing={16}>
              <Grid item xs={6}>
                <TextField
                  name="inspectionId"
                  select
                  label="Inspection"
                  value={values.inspectionId}
                  margin="normal"
                  onChange={this.props.handleChange}
                  onBlur={this.props.handleBlur}
                  error={!!touched.inspectionId && !!errors.inspectionId}
                  helperText={
                    !!touched.inspectionId &&
                    !!errors.inspectionId &&
                    errors.inspectionId
                  }
                  fullWidth
                  disabled
                  required
                >
                  {inspections.map(inspection => {
                    return (
                      <MenuItem key={inspection.id} value={inspection.id}>
                        {inspection.name}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </Grid>
            </Grid> */}
        </Grid>
      </Grid>
      <br />
      {isCreate ? (
        <Grid container justify="flex-end">
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
        </Grid>
      ) : (
        <Grid container>
          <Button
            disabled={
              loading ||
              isSubmitting ||
              (!isValid && dirty) ||
              (isValid && !dirty)
            }
            onClick={e => props.handleSubmit(e)}
            variant="contained"
            color="primary"
            fullWidth
          >
            Update
          </Button>
        </Grid>
      )}
    </Form>
  );
};

const mapStateToProps = state => {
  return {
    loading: state.global.loading,
    spansTypes: state.spans.spanTypes,
    states: state.global.states
  };
};

const mapDispatchToProps = {
  fetchSpanTypes,
  fetchStates,
  getProject
};

FormSpanEdit.propTypes = {
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
)(FormSpanEdit);
