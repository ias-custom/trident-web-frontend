import React from "react";
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
  MenuItem,
  Tooltip,
  IconButton
} from "@material-ui/core";
import { Form } from "formik";
import { fetchSpanTypes } from "../../redux/actions/spanActions";
import { fetchStates } from "../../redux/actions/globalActions";
import { getProject } from "../../redux/actions/projectActions";
import { AddCircle } from "@material-ui/icons";

class FormSpanEdit extends React.Component {
  state = {
    inspections: []
  };

  componentDidMount = async () => {
    this.props.fetchSpanTypes(this.props.projectId);
    this.props.fetchStates();
    const response = await this.props.getProject(this.props.projectId);
    if (response.status === 200) {
      const { set } = response.data;
      if (this.props.isCreate){
        this.props.setFieldValue("inspectionId", set.inspections[0].id)
      }
      this.setState({ inspections: set.inspections });
    }
  };
  render() {
    const {
      classes,
      dirty,
      values,
      touched,
      errors,
      loading,
      isSubmitting,
      isValid,
      states,
      spansTypes,
      structures,
      isCreate
    } = this.props;
    const { inspections } = this.state;
    return (
      <Form onSubmit={this.props.handleSubmit}>
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
                    this.props.handleChange(e);
                  }}
                  onBlur={this.props.handleBlur}
                  label="Number"
                  fullWidth
                  margin="normal"
                  error={!!touched.number && !!errors.number}
                  helperText={
                    !!touched.number && !!errors.number && errors.number
                  }
                  required
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
                  onChange={this.props.handleChange}
                  onBlur={this.props.handleBlur}
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
                          {structure.name}
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
                  onChange={this.props.handleChange}
                  onBlur={this.props.handleBlur}
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
                          {structure.name}
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
                  onChange={this.props.handleChange}
                  onBlur={this.props.handleBlur}
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
                <div style={{ display: "flex" }}>
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
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={16}>
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
            </Grid>
          </Grid>
        </Grid>
        <br />
        {isCreate ? (
          <Grid container justify="flex-end">
            <Button
              style={{ marginLeft: 10 }}
              disabled={loading || isSubmitting || !isValid || !dirty}
              onClick={e => this.props.handleSubmit(e)}
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
              onClick={e => this.props.handleSubmit(e)}
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
  }
}

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
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(FormSpanEdit);
