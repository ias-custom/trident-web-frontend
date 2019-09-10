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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Fab,
  TextField,
  MenuItem,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  IconButton,
  CardContent,
  Card,
  CardActions,
  CardHeader
} from "@material-ui/core";
import {
  updateStructure,
  getItemsStructure,
  addItemStructure,
  deleteItemStructure
} from "../../redux/actions/structureActions";
import {
  updateSpan,
  getItemsSpan,
  addItemSpan,
  deleteItemSpan
} from "../../redux/actions/spanActions";
import {
  getCategoriesInspection,
  getInspectionsProject,
  getDeficiencies
} from "../../redux/actions/projectActions";

import { setLoading } from "../../redux/actions/globalActions";
import { Add, ExpandMore, AddCircle, Delete } from "@material-ui/icons";
import { Formik, Form } from "formik";
import * as Yup from "yup";

class Equipment extends React.Component {
  state = {
    open: false,
    openItem: false,
    openDelete: false,
    openId: "",
    inspectionSelected: "",
    parentItems: [],
    categoryId: "",
    formItem: {
      name: "",
      description: "",
      category_id: "",
      item_parent_id: "",
      deficiency_id: ""
    }
  };

  componentDidMount() {
    try {
      this.props.getInspectionsProject(this.props.projectId);
      this.props.getDeficiencies(this.props.projectId);
      if (this.props.isStructure)
        this.props.getItemsStructure(this.props.itemId);
      else this.props.getItemsSpan(this.props.itemId);
    } catch (error) {
      this.props.history.push("/404");
    }
  }

  saveInspection = async () => {
    let response = "";
    const form = { inspection_id: this.state.inspectionSelected };
    if (this.props.isStructure)
      response = await this.props.updateStructure(
        this.props.projectId,
        this.props.itemId,
        form
      );
    else
      response = await this.props.updateSpan(
        this.props.projectId,
        this.props.itemId,
        form
      );

    if (response.status === 200 || response.status === 204) {
      this.setState({ open: false });
      const inspectionSelected = this.props.inspections.find(
        ({ id }) => id === this.state.inspectionSelected
      );
      this.props.changeId(this.state.inspectionSelected);
      this.props.changeName(inspectionSelected.name);
      this.props.getCategoriesInspection(this.state.inspectionSelected);

      const text = `Inspection successfully added!`;
      this.props.enqueueSnackbar(text, {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    } else {
      this.props.enqueueSnackbar("The request could not be processed!", {
        variant: "error"
      });
    }
  };

  openCollapse(openId, category) {
    if (openId === category.id) this.setState({ openId: 0 });
    else this.setState({ openId: category.id });
  }

  createItem(parentItems, categoryId) {
    this.setState({ parentItems, categoryId, openItem: true });
  }

  createItemConfirm = async (values, formikActions) => {
    const { setSubmitting, resetForm } = formikActions;
    this.props.setLoading(true);
    const { name, description, item_parent_id, deficiency_id } = values;

    const form = { category_id: this.state.categoryId };
    if (name) Object.assign(form, { name });
    else Object.assign(form, { item_parent_id });

    if (description) Object.assign(form, { description });
    else Object.assign(form, { deficiency_id });

    try {
      let response = "";
      if (this.props.isStructure)
        response = await this.props.addItemStructure(this.props.itemId, form);
      else response = await this.props.addItemSpan(this.props.itemId, form);

      if (response.status === 201) {
        resetForm();
        this.setState({ openItem: false });
        this.props.enqueueSnackbar("The item was added successfully!", {
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
    this.props.setLoading(false);
  };

  deleteItem = async () => {
    this.setState({ openDelete: false });
    this.props.setLoading(true);

    try {
      let response = "";
      if (this.props.isStructure)
        response = await this.props.deleteItemStructure(
          this.props.itemId,
          this.state.itemId
        );
      else
        response = await this.props.deleteItemSpan(
          this.props.itemId,
          this.state.itemId
        );

      if (response.status === 204) {
        this.props.enqueueSnackbar("The item was deleted successfully!", {
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

    this.props.setLoading(false);
  };

  render() {
    const {
      classes,
      loading,
      inspection_id,
      inspections,
      categoriesInspection,
      inspectionName,
      structure_items,
      span_items,
      isStructure,
      deficiencies
    } = this.props;
    const {
      open,
      openItem,
      inspectionSelected,
      openId,
      formItem,
      parentItems,
      openDelete
    } = this.state;
    const items = isStructure ? structure_items : span_items;
    return (
      <div style={{ height: "100%" }}>
        <Dialog
          open={openDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onBackdropClick={() =>
            !loading ? this.setState({ openDelete: false }) : null
          }
          onEscapeKeyDown={() =>
            !loading ? this.setState({ openDelete: false }) : null
          }
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure you want to delete?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              If you delete it will be permanently.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              className={classes.buttonCancel}
              onClick={() =>
                !loading ? this.setState({ openDelete: false }) : null
              }
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              color="primary"
              className={classes.buttonAccept}
              onClick={this.deleteItem}
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={open}
          classes={{ paper: classes.dialog }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onBackdropClick={() =>
            !loading ? this.setState({ open: false }) : null
          }
          onEscapeKeyDown={() =>
            !loading ? this.setState({ open: false }) : null
          }
        >
          <DialogTitle id="alert-dialog-title">{"Add inspection"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Select the inspection.
            </DialogContentText>
            <TextField
              name="inspection_selected"
              select
              label="Inspections"
              value={inspectionSelected}
              margin="normal"
              disabled={loading}
              onChange={e =>
                this.setState({ inspectionSelected: e.target.value })
              }
              fullWidth
            >
              {inspections.map(inspection => {
                return (
                  <MenuItem key={inspection.id} value={inspection.id}>
                    {inspection.name}
                  </MenuItem>
                );
              })}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              className={classes.buttonCancel}
              onClick={() => this.setState({ open: false })}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              color="primary"
              className={classes.buttonAccept}
              onClick={this.saveInspection}
            >
              Add Inspection
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openItem}
          classes={{ paper: classes.dialog }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onBackdropClick={() =>
            !loading ? this.setState({ openItem: false }) : null
          }
          onEscapeKeyDown={() =>
            !loading ? this.setState({ openItem: false }) : null
          }
        >
          <DialogTitle id="alert-dialog-title">{"Add item"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Enter the required information.
            </DialogContentText>
            <Formik
              onSubmit={this.createItemConfirm}
              enableReinitialize
              validateOnChange
              initialValues={{
                ...formItem
              }}
              validationSchema={Yup.object().shape({
                item_parent_id: Yup.mixed().required("Item is required"),
                deficiency_id: Yup.mixed().required("Deficiency is required"),
                name: Yup.string().when("item_parent_id", {
                  is: 0,
                  then: Yup.string().required("Item name is required")
                }),
                description: Yup.string().when("deficiency_id", {
                  is: 0,
                  then: Yup.string().required("Deficiency name is required")
                })
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
                  <Form onSubmit={this.handleSubmit}>
                    <Prompt
                      when={dirty}
                      message="Are you sure you want to leave?, You will lose your changes"
                    />
                    <Grid>
                      <TextField
                        name="item_parent_id"
                        select
                        label="Type items"
                        value={values.item_parent_id}
                        margin="normal"
                        disabled={loading}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          !!touched.item_parent_id && !!errors.item_parent_id
                        }
                        helperText={
                          !!touched.item_parent_id &&
                          !!errors.item_parent_id &&
                          errors.item_parent_id
                        }
                        required
                        fullWidth
                      >
                        {parentItems.map(parent => {
                          return (
                            <MenuItem key={parent.id} value={parent.id}>
                              {parent.name}
                            </MenuItem>
                          );
                        })}
                        <MenuItem key={0} value={0}>
                          Other
                        </MenuItem>
                      </TextField>
                    </Grid>
                    {values.item_parent_id === 0 ? (
                      <Grid>
                        <TextField
                          name="name"
                          multiline
                          rowsMax="2"
                          rows="2"
                          label="Enter the item"
                          value={values.name}
                          margin="normal"
                          disabled={loading}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!touched.name && !!errors.name}
                          helperText={
                            !!touched.name && !!errors.name && errors.name
                          }
                          required
                          fullWidth
                        ></TextField>
                      </Grid>
                    ) : null}
                    <Grid>
                      <TextField
                        name="deficiency_id"
                        select
                        label="Deficiencies"
                        required
                        value={values.deficiency_id}
                        margin="normal"
                        disabled={loading}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          !!touched.deficiency_id && !!errors.deficiency_id
                        }
                        helperText={
                          !!touched.deficiency_id &&
                          !!errors.deficiency_id &&
                          errors.deficiency_id
                        }
                        fullWidth
                      >
                        {deficiencies.map(deficiency => {
                          return (
                            <MenuItem key={deficiency.id} value={deficiency.id}>
                              {deficiency.name}
                            </MenuItem>
                          );
                        })}
                        <MenuItem key={0} value={0}>
                          Other
                        </MenuItem>
                      </TextField>
                    </Grid>
                    {values.deficiency_id === 0 ? (
                      <Grid>
                        <TextField
                          name="description"
                          multiline
                          rowsMax="2"
                          rows="2"
                          label="Enter the deficiency"
                          value={values.description}
                          margin="normal"
                          disabled={loading}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!touched.description && !!errors.description}
                          helperText={
                            !!touched.description &&
                            !!errors.description &&
                            errors.description
                          }
                          required
                          fullWidth
                        ></TextField>
                      </Grid>
                    ) : null}
                    <br />
                    <Grid container justify="flex-end">
                      <Button
                        variant="outlined"
                        className={classes.buttonCancel}
                        onClick={() => this.setState({ openItem: false })}
                      >
                        Cancel
                      </Button>
                      <Button
                        disabled={loading || isSubmitting || !isValid || !dirty}
                        onClick={e => {
                          handleSubmit(e);
                        }}
                        variant="outlined"
                        color="primary"
                        className={classes.buttonAccept}
                      >
                        Add Item
                      </Button>
                    </Grid>
                  </Form>
                );
              }}
            </Formik>
          </DialogContent>
        </Dialog>
        {inspection_id ? (
          <Grid>
            <Typography
              component="h1"
              variant="h5"
              className={classes.name}
              align="center"
            >
              {inspectionName}
            </Typography>
            {categoriesInspection.map(category => (
              <div key={category.id} style={{ padding: "2px" }}>
                <ExpansionPanel
                  expanded={openId === category.id}
                  onChange={() => {
                    this.openCollapse(openId, category);
                  }}
                  classes={{ root: classes.collapse }}
                >
                  <ExpansionPanelSummary expandIcon={<ExpandMore />}>
                    {category.name}
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails
                    classes={{ root: classes.collapseDetails }}
                  >
                    <Grid>
                      <Typography
                        variant="subtitle1"
                        classes={{ subtitle1: classes.itemsText }}
                      >
                        ITEMS
                        <IconButton
                          disabled={loading}
                          className={classes.iconAdd}
                          onClick={() =>
                            this.createItem(category.items, category.id)
                          }
                        >
                          <AddCircle />
                        </IconButton>
                      </Typography>
                    </Grid>
                    <Grid container spacing={16}>
                      {items
                        .filter(
                          ({ category_id }) => category_id === category.id
                        )
                        .map(item => (
                          <Grid item xs={3} key={item.id}>
                            <Card
                              style={{
                                height: item.id === 49 ? "300px" : "auto"
                              }}
                              classes={{ root: classes.card }}
                            >
                              <CardHeader
                                classes={{ root: classes.cardHeader }}
                                action={
                                  <IconButton
                                    className={classes.iconDelete}
                                    onClick={() =>
                                      this.setState({
                                        itemId: item.id,
                                        openDelete: true
                                      })
                                    }
                                  >
                                    <Delete />
                                  </IconButton>
                                }
                              />
                              <CardContent>
                                {item.name ? (
                                  <p>{item.name}</p>
                                ) : (
                                  <p>{item.item_parent.name}</p>
                                )}
                                <Typography
                                  className={classes.title}
                                  color="textSecondary"
                                  gutterBottom
                                >
                                  {item.description
                                    ? `${item.description}`
                                    : `${item.deficiency.name}`}
                                </Typography>
                              </CardContent>
                              <CardActions>
                                <Button size="small">See photos</Button>
                              </CardActions>
                            </Card>
                          </Grid>
                        ))}
                    </Grid>
                    {items.filter(
                      ({ category_id }) => category_id === category.id
                    ).length === 0 ? (
                      <Typography
                        variant="display1"
                        align="center"
                        className={classes.emptyText}
                      >
                        THERE AREN'T ITEMS
                      </Typography>
                    ) : null}
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </div>
            ))}
          </Grid>
        ) : (
          <Grid className={classes.divInspection}>
            <Fab
              variant="extended"
              color="primary"
              aria-label="Add"
              onClick={() => this.setState({ open: true })}
            >
              <Add /> ADD INSPECTION
            </Fab>
          </Grid>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.global.loading,
    inspections: state.projects.inspections,
    categoriesInspection: state.projects.categoriesInspection,
    deficiencies: state.projects.deficiencies,
    states: state.global.states,
    structure_items: state.structures.items,
    span_items: state.spans.items
  };
};

const mapDispatchToProps = {
  setLoading,
  addItemStructure,
  deleteItemStructure,
  addItemSpan,
  deleteItemSpan,
  getInspectionsProject,
  getDeficiencies,
  getCategoriesInspection,
  updateStructure,
  getItemsStructure,
  updateSpan,
  getItemsSpan
};

Equipment.propTypes = {
  inspection_id: PropTypes.any,
  isStructure: PropTypes.bool.isRequired
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Equipment);
