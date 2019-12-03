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
import { createProject, fetchTags } from "../../../redux/actions/projectActions";
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
    type: ""
  };

  componentDidMount() {
    this.props.fetchTags();
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
        this.props.enqueueSnackbar("The role has been created!", {
          variant: "success"
        });
        this.props.history.push("/projects");
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
                type: Yup.mixed().required("Type is required")
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
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <TextField
                                name="type"
                                select
                                value={values.type}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!touched.type && !!errors.type}
                                helperText={
                                  !!touched.type && !!errors.type && errors.type
                                }
                                label="Type"
                                fullWidth
                                margin="normal"
                                required
                              >
                                <MenuItem key={1} value={1}>
                                  Constructability
                                </MenuItem>
                                <MenuItem key={2} value={2}>
                                  Construction
                                </MenuItem>
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
                      Create Project
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
    tags: state.projects.tags
  };
};

const mapDispatchToProps = {
  setLoading,
  fetchTags,
  toggleItemMenu,
  selectedItemMenu,
  createProject
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
