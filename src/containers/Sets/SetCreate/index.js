import React from "react";
import { Grid, TextField, Button, Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, IconButton } from "@material-ui/core";
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
import { getInspectionsProject } from "../../../redux/actions/projectActions";
import AddIcon from "@material-ui/icons/Add";
import InputFiles from "react-input-files";
import { ExpandMore, Save, Cancel, Edit, Delete } from "@material-ui/icons";

const breadcrumbs = [
  { name: "Home", to: "/home" },
  { name: "Sets", to: "/sets" },
  { name: "Create Set", to: null }
];

class SetCreate extends React.Component {
  state = {
    openId: ""
  };

  form = {
    name: ""
  };

  componentDidMount() {
    try {
      const nameItem = "sets";
      const nameSubItem = "create";
      const open = true;
      this.props.toggleItemMenu({ nameItem, open });
      this.props.selectedItemMenu({ nameItem, nameSubItem });
      this.props.getInspectionsProject(2);
    } catch (error) {
      
    }
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
        this.props.history.push("/sets");
        this.props.enqueueSnackbar("The set has been created!", {
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

  openCollapse(openId, category) {
    category.newName = "";
    this.props.categories_project.map(category => {
      category.items.map(item => {
        item.edit = false;
        return item;
      });
      return category;
    });
    if (openId === category.id) this.setState({ openId: 0 });
    else this.setState({ openId: category.id });
  }

  render() {
    const { classes, loading, inspections, categories_project } = this.props;
    const { openId } = this.state

    return (
      <Layout title="Create Set">
        {() => (
          <div className={classes.root}>
            <SimpleBreadcrumbs
              routes={breadcrumbs}
              classes={{ root: classes.breadcrumbs }}
            />

            <Formik
              onSubmit={this.handleSubmit}
              validateOnChange
              initialValues={{
                ...this.form
              }}
              validationSchema={Yup.object().shape({
                name: Yup.string().required("Name is required")
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
                          <Grid container spacing={16} className={classes.inspections}>
                            {inspections.map(({ id, name }) => (
                              <Grid item xs={6} key={id}>
                                <Typography
                                  variant="h6"
                                  align="center"
                                  classes={{ h6: classes.categoryName }}
                                >
                                  {name}
                                </Typography>
                                {categories_project
                                  .filter(({ inspection_id }) => inspection_id === id)
                                  .map(category => (
                                    <div key={category.id}>
                                      <ExpansionPanel
                                        expanded={openId === category.id}
                                        onChange={() => {
                                          this.openCollapse(openId, category);
                                        }}
                                        classes={{ root: classes.collapse }}
                                      >
                                        <ExpansionPanelSummary
                                          expandIcon={<ExpandMore />}
                                        >
                                          {category.name}
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails
                                          classes={{ root: classes.collapseDetails }}
                                        >
                                          <Grid>
                                            <TextField
                                              name="name"
                                              value={category.newName || ""}
                                              placeholder="Change category name"
                                              label=""
                                              required
                                              disabled={loading}
                                              inputProps={{
                                                className: classes.inputCategory
                                              }}
                                              onChange={e => {
                                                category.newName = e.target.value;
                                                this.setState({});
                                              }}
                                            />
                                            <IconButton
                                              className={classes.buttonSave}
                                              aria-label="Save"
                                              color="primary"
                                              onClick={() =>
                                                this.changeNameCategory(category, id)
                                              }
                                              disabled={
                                                loading ||
                                                !(
                                                  category.newName &&
                                                  category.newName.length > 0
                                                )
                                              }
                                            >
                                              <Save />
                                            </IconButton>
                                            <IconButton
                                              aria-label="Delete"
                                              className={classes.iconDelete}
                                              disabled={loading}
                                            >
                                              <Delete />
                                            </IconButton>
                                          </Grid>
                                          <Grid>
                                            <Typography
                                              variant="subtitle1"
                                              classes={{ subtitle1: classes.itemsText }}
                                            >
                                              ITEMS
                                            </Typography>
                                          </Grid>
                                          {category.items.map(item => (
                                            <div key={item.id}>
                                              {item.edit ? (
                                                <Grid>
                                                  <TextField
                                                    name="name"
                                                    value={item.newName}
                                                    label=""
                                                    required
                                                    disabled={loading}
                                                    autoFocus={item.edit}
                                                    inputProps={{
                                                      className: classes.inputCategory
                                                    }}
                                                    onChange={e => {
                                                      item.newName = e.target.value;
                                                      this.setState({});
                                                    }}
                                                  />
                                                  <IconButton
                                                    className={classes.buttonSave}
                                                    aria-label="Save"
                                                    color="primary"
                                                    onClick={() =>
                                                      this.changeNameItem(
                                                        item,
                                                        category.id
                                                      )
                                                    }
                                                    disabled={
                                                      loading ||
                                                      item.newName.length === 0
                                                    }
                                                  >
                                                    <Save />
                                                  </IconButton>
                                                  <IconButton
                                                    className={classes.iconDelete}
                                                    aria-label="Cancel"
                                                    onClick={() => {
                                                      item.edit = false;
                                                      this.setState({});
                                                    }}
                                                    disabled={loading}
                                                  >
                                                    <Cancel />
                                                  </IconButton>
                                                </Grid>
                                              ) : (
                                                <Typography variant="subtitle1">
                                                  {item.name}
                                                  <IconButton
                                                    aria-label="Edit"
                                                    color="primary"
                                                    onClick={() => {
                                                      Object.assign(item, {
                                                        edit: true,
                                                        newName: item.name
                                                      });
                                                      this.setState({});
                                                    }}
                                                    disabled={loading}
                                                  >
                                                    <Edit />
                                                  </IconButton>
                                                </Typography>
                                              )}
                                            </div>
                                          ))}
                                        </ExpansionPanelDetails>
                                      </ExpansionPanel>
                                    </div>
                                  ))}
                              </Grid>
                            ))}
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
                      Create Set
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
    inspections: state.projects.inspections,
    categories_project: state.projects.categories_project
  };
};

const mapDispatchToProps = {
  setLoading,
  toggleItemMenu,
  selectedItemMenu,
  createCustomer,
  getInspectionsProject
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "SetCreate" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SetCreate);
