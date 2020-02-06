import React from "react";
import {
  Grid,
  TextField,
  Button,
  MenuItem,
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
import { createProject, fetchTags, fetchInspectionsProject } from "../../../redux/actions/projectActions";
import { fetchSets } from "../../../redux/actions/setsActions";
import { fetchLines } from "../../../redux/actions/LineActions";
import styles from "./styles";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const breadcrumbs = [
  { name: "Home", to: "/home" },
  { name: "Projects", to: "/projects" },
  { name: "Create Project", to: null }
];

class ProjectCreate extends React.Component {
  state = {};

  form = {
    name: "",
    inspection_id: "",
    set_id: ""
  };

  componentDidMount() {
    //this.props.fetchTags();
    this.props.fetchSets();
    this.props.fetchLines();
    this.props.fetchInspectionsProject();
    const nameItem = "projects";
    const nameSubItem = "create";
    const open = true;
    this.props.toggleItemMenu({ nameItem, open });
    this.props.selectedItemMenu({ nameItem, nameSubItem });
  }

  handleSubmit = async (values, formikActions) => {
    const { setSubmitting, resetForm } = formikActions;
    this.props.setLoading(true);
    const form = { ...values };

    try {
      const response = await this.props.createProject(form);

      if (response.status === 201) {
        resetForm();
        this.props.enqueueSnackbar("The project has been created!", {
          variant: "success"
        });
        this.props.history.push(`/projects/${response.data.id}`);
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
    const { classes, loading, inspections_project, sets, lines } = this.props;
    return (
      <Layout title="Create Project">
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
                inspection_id: Yup.mixed().required("Type is required"),
                set_id: Yup.mixed().required("Set is required"),
                line_id: Yup.mixed().required("Line is required"),
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
                  handleSubmit
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
                            <Grid item xs={6}>
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
                                disabled={loading}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                name="inspection_id"
                                select
                                value={values.inspection_id}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!touched.inspection_id && !!errors.inspection_id}
                                helperText={
                                  !!touched.inspection_id && !!errors.inspection_id && errors.inspection_id
                                }
                                label="Type"
                                fullWidth
                                margin="normal"
                                required
                                disabled={loading}
                              >
                                {inspections_project.map(i => (
                                  <MenuItem key={i.id} value={i.id}>
                                    {i.name}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                name="set_id"
                                select
                                value={values.set_id}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!touched.set_id && !!errors.set_id}
                                helperText={
                                  !!touched.set_id && !!errors.set_id && errors.set_id
                                }
                                label="Set"
                                fullWidth
                                disabled={values.inspection_id === "" || loading}
                                margin="normal"
                                required
                              >
                                {sets.filter(({inspection_id}) => inspection_id === values.inspection_id).map(s => (
                                  <MenuItem key={s.id} value={s.id}>
                                    {s.name}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                name="line_id"
                                select
                                value={values.line_id}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!touched.line_id && !!errors.line_id}
                                helperText={
                                  !!touched.line_id && !!errors.line_id && errors.line_id
                                }
                                label="Line"
                                fullWidth
                                margin="normal"
                                required
                                disabled={loading}
                              >
                                {lines.map(l => (
                                  <MenuItem key={l.id} value={l.id}>
                                    {l.name}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                          </Grid>
  
                          {/* <Grid container spacing={16}>
                            <Grid item xs>
                              <FormControl fullWidth margin="normal">
                                <InputLabel>Tags</InputLabel>
                                <Select
                                  multiple
                                  name="tagsId"
                                  value={values.tagsId}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  input={<Input id="select-multiple-chip" />}
                                  renderValue={selected => (
                                    <div className={classes.chips}>
                                      {selected.map(({ id, name }) => (
                                        <Chip
                                          key={id}
                                          label={name}
                                          className={classes.chip}
                                        />
                                      ))}
                                    </div>
                                  )}
                                  fullWidth
                                >
                                  {tags.map(tag => (
                                    <MenuItem key={tag.id} value={tag}>
                                      <Checkbox
                                        checked={
                                          !!values.tagsId.find(
                                            c => c.id === tag.id
                                          )
                                        }
                                      />
                                      <ListItemText primary={tag.name} />
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                          </Grid> */}
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
                      Next
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
    loading: state.global.loading,
    tags: state.projects.tags,
    inspections_project: state.projects.inspections_project,
    sets: state.sets.list,
    lines: state.lines.list
  };
};

const mapDispatchToProps = {
  setLoading,
  fetchTags,
  toggleItemMenu,
  selectedItemMenu,
  createProject,
  fetchInspectionsProject,
  fetchSets,
  fetchLines
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "ProjectCreate" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ProjectCreate);
