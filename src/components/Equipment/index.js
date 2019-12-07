import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import styles from "./styles";
import { withRouter, Prompt } from "react-router-dom";
import { withSnackbar } from "notistack";
import classNames from "classnames";
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
  CardHeader,
  FormControlLabel,
  Switch,
  RadioGroup,
  Radio
} from "@material-ui/core";

import {
  setLoading,
  fetchItemStates,
  addDeficiencyItem,
  deleteDeficiencyItem,
  updateDeficiencyItem
} from "../../redux/actions/globalActions";
import {
  updateItemStructure,
  addItemStructure
} from "../../redux/actions/structureActions";
import { updateItemSpan, addItemSpan } from "../../redux/actions/spanActions";
import {
  ExpandMore,
  Delete,
  Edit,
  FileCopy,
  AddCircle,
  Warning
} from "@material-ui/icons";
import { Formik, Form } from "formik";
import * as Yup from "yup";

class Equipment extends React.Component {
  state = {
    open: false,
    openDeficiency: false,
    openDelete: false,
    openItem: false,
    openId: "",
    itemId: "",
    stateId: "",
    deficiencyId: "",
    inspectionSelected: "",
    parentItems: [],
    categoryId: "",
    deficienciesItem: [],
    deficienciesParent: [],
    formDeficiency: {
      emergency: false,
      deficiency_id: ""
    }
  };

  componentDidMount() {
    try {
      this.props.fetchItemStates();
    } catch (error) {}
  }

  openCollapse(openId, category) {
    if (openId === category.id) this.setState({ openId: 0 });
    else this.setState({ openId: category.id });
  }

  addDeficiency = async (values, formikActions) => {
    const { setSubmitting, resetForm } = formikActions;
    this.props.setLoading(true);
    const { deficiency_id, emergency } = values;

    const form = { deficiency_id, emergency };
    try {
      const response = await this.props.addDeficiencyItem(
        this.state.itemId,
        form
      );
      if (response.status === 201) {
        resetForm();
        const newItems = this.props.items.map(item => {
          if (item.id === this.state.itemId) {
            const newDeficiencies = [...item.deficiencies, response.data];
            item.deficiencies = newDeficiencies;
          }
          return item;
        });
        this.props.changeItems(newItems);
        const item = this.props.items.find(
          ({ id }) => id === this.state.itemId
        );
        if (item.deficiencies.length === 1) {
          this.updateItem(4, false); // 4 IS ID OF STATE ITEM DEFICIENT
          if (this.props.state === 2) {
            this.props.changeItem(1)
          } 
        }
        this.setState({ openDeficiency: false });
        this.props.enqueueSnackbar("The deficiency was added successfully!", {
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

  updateItem = async (stateId, showNotify = true) => {
    const form = { state_id: stateId };
    try {
      let response = "";
      if (this.props.isStructure)
        response = await this.props.updateItemStructure(
          this.props.itemId,
          this.state.itemId,
          form
        );
      else
        response = await this.props.updateItemSpan(
          this.props.itemId,
          this.state.itemId,
          form
        );

      if (response.status === 200) {
        const newItems = this.props.items.map(item => {
          if (item.id === this.state.itemId) {
            return response.data;
          }
          return item;
        });
        this.setState({ openItem: false, stateId: "" });
        this.props.changeItems(newItems);
        const items = newItems.filter(i => i.state.name !== "Not inspected")
        if (items.length === 0 && this.props.state === 1) {
          this.props.changeItem(2)
        } 
        if (items.length > 0 && this.props.state === 2) {
          this.props.changeItem(1)
        } 
        if (showNotify) {
          this.props.enqueueSnackbar("The item was updated successfully!", {
            variant: "success",
            anchorOrigin: { vertical: "top", horizontal: "center" }
          });
        }
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

  duplicateItem = async item => {
    const { state_id, item_parent_id } = item;
    const form = { state_id, item_parent_id };
    try {
      let response = "";
      if (this.props.isStructure)
        response = await this.props.addItemStructure(this.props.itemId, form);
      else response = await this.props.addItemSpan(this.props.itemId, form);

      if (response.status === 201) {
        this.props.changeItems([...this.props.items, response.data]);
        this.props.enqueueSnackbar("The item was dupdlicate successfully!", {
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

  /* deleteItem = async () => {
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
        this.props.reduceItems(this.state.itemId);
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
  }; */

  deleteDeficiency = async () => {
    this.props.setLoading(true);
    this.setState({ openDelete: false });
    try {
      const response = await this.props.deleteDeficiencyItem(
        this.state.itemId,
        this.state.deficiencyId
      );

      if (response.status === 204) {
        const newItems = this.props.items.map(item => {
          if (item.id === this.state.itemId) {
            const newDeficiencies = item.deficiencies.filter(
              ({ id }) => id !== this.state.deficiencyId
            );
            item.deficiencies = newDeficiencies;
          }
          return item;
        });
        this.props.changeItems(newItems);
        const item = this.props.items.find(
          ({ id }) => id === this.state.itemId
        );
        if (item.deficiencies.length === 0) {
          await this.updateItem(3, false); // 3 IS ID OF STATE ITEM NOT INSPECTED
          if (this.props.state === 1) {
            const items = this.props.items.filter(i => i.state.name !== "Not inspected")
            if (items.length === 0) {
              this.props.changeItem(2)
            }
          } 
        }
        this.props.enqueueSnackbar("The deficiency was deleted successfully!", {
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

  updateDeficiency = async (value, itemId, deficiencyId) => {
    try {
      const response = await this.props.updateDeficiencyItem(
        itemId,
        deficiencyId,
        { emergency: value }
      );

      if (response.status === 200) {
        const newItems = this.props.items.map(item => {
          if (item.id === itemId) {
            const newDeficiencies = item.deficiencies.map(deficiency => {
              if (deficiency.id === deficiencyId) {
                return response.data;
              }
              return deficiency;
            });
            item.deficiencies = newDeficiencies;
          }
          return item;
        });
        this.props.changeItems(newItems);
        this.props.enqueueSnackbar("The deficiency was updated successfully!", {
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
  };

  render() {
    const {
      classes,
      loading,
      inspectionName,
      categories,
      items,
      item_states,
      typeSet
    } = this.props;
    const {
      openDeficiency,
      openId,
      formDeficiency,
      openDelete,
      deficienciesItem,
      stateId,
      openItem,
      deficienciesParent
    } = this.state;
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
              onClick={this.deleteDeficiency}
            >
              Agree
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
          <DialogTitle id="alert-dialog-title">{"UPDATE ITEM"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Enter the required information.
            </DialogContentText>
            <TextField
              name="state_id"
              select
              label="State"
              value={stateId}
              margin="normal"
              disabled={loading}
              onChange={e => this.setState({ stateId: e.target.value })}
              required
              fullWidth
            >
              {item_states.map(state => {
                return (
                  <MenuItem key={state.id} value={state.id}>
                    {state.name}
                  </MenuItem>
                );
              })}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              className={classes.buttonCancel}
              onClick={() =>
                !loading
                  ? this.setState({ openItem: false, stateId: "" })
                  : null
              }
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              color="primary"
              disabled={loading || stateId === ""}
              className={classes.buttonAccept}
              onClick={() => this.updateItem(this.state.stateId)}
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openDeficiency}
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
              onSubmit={this.addDeficiency}
              enableReinitialize
              validateOnChange
              initialValues={{
                ...formDeficiency
              }}
              validationSchema={Yup.object().shape({
                deficiency_id: Yup.mixed().required("Deficiency is required")
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
                        name="deficiency_id"
                        select
                        label="Deficiency"
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
                        required
                        fullWidth
                      >
                        {deficienciesParent
                          .filter(({ id }) => !deficienciesItem.includes(id))
                          .map(deficiency => {
                            return (
                              <MenuItem
                                key={deficiency.id}
                                value={deficiency.id}
                              >
                                {deficiency.name}
                              </MenuItem>
                            );
                          })}
                      </TextField>
                    </Grid>
                    <Grid>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={values.emergency}
                            onChange={handleChange}
                            value="emergency"
                            name="emergency"
                          />
                        }
                        label="Emergency"
                      />
                    </Grid>
                    <br />
                    <Grid container justify="flex-end">
                      <Button
                        variant="outlined"
                        className={classes.buttonCancel}
                        onClick={() => this.setState({ openDeficiency: false })}
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
                        Add Deficiency
                      </Button>
                    </Grid>
                  </Form>
                );
              }}
            </Formik>
          </DialogContent>
        </Dialog>
        <Grid>
          <Typography
            component="h1"
            variant="h5"
            className={classes.name}
            align="center"
          >
            {inspectionName}
          </Typography>
          {categories.map(category => (
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
                    </Typography>
                  </Grid>
                  <Grid container spacing={16}>
                    {items
                      .filter(({ category_id }) => category_id === category.id)
                      .map(item => (
                        <Grid item xs={12} key={item.id}>
                          <Card classes={{ root: classes.card }}>
                            <CardHeader
                              action={
                                <div>
                                  <IconButton
                                    onClick={() => this.duplicateItem(item)}
                                  >
                                    <FileCopy />
                                  </IconButton>
                                  <IconButton
                                    color="primary"
                                    disabled={item.deficiencies.length > 0}
                                    onClick={() =>
                                      this.setState({
                                        openItem: true,
                                        itemId: item.id,
                                        stateId: item.state_id
                                      })
                                    }
                                  >
                                    <Edit />
                                  </IconButton>
                                  {/* <IconButton
                                    className={classes.iconDelete}
                                    onClick={() =>
                                      this.setState({
                                        itemId: item.id,
                                        openDelete: true
                                      })
                                    }
                                  >
                                    <Delete />
                                  </IconButton> */}
                                </div>
                              }
                              title={
                                <div className={classes.divHeader}>
                                  <span
                                    className={classNames(
                                      classes.itemName,
                                      typeSet === "2" && classes.question
                                    )}
                                  >
                                    {item.item_parent.name}
                                  </span>{" "}
                                  {item.state.name === "Deficient" ? (
                                    <span>({item.deficiencies.length})</span>
                                  ) : (
                                    <div>
                                      <Button
                                        variant="outlined"
                                        color="primary"
                                        className={
                                          item.state.name === "Not inspected"
                                            ? classes.buttonGray
                                            : classes.buttonGreen
                                        }
                                      >
                                        {item.state.name}
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              }
                            />
                            <CardContent
                              classes={{ root: classes.cardContent }}
                            >
                              {typeSet === "1" ? (
                                <div>
                                  <p>
                                    - Deficiencies:
                                    <IconButton
                                      className={classes.iconAdd}
                                      disabled={
                                        ![
                                          "Not inspected",
                                          "Deficient"
                                        ].includes(item.state.name)
                                      }
                                      onClick={() =>
                                        this.setState({
                                          itemId: item.id,
                                          openDeficiency: true,
                                          deficienciesItem: item.deficiencies.map(
                                            ({ deficiency_id }) => deficiency_id
                                          ),
                                          deficienciesParent: item.deficiencies_parent
                                        })
                                      }
                                    >
                                      <AddCircle />
                                    </IconButton>
                                  </p>
                                  {item.deficiencies.map(deficiency => (
                                    <div
                                      className={classes.divDeficiency}
                                      key={deficiency.id}
                                    >
                                      <span className={classes.label}>
                                        {deficiency.deficiency.name}{" "}
                                        {deficiency.emergency && (
                                          <Warning
                                            classes={{
                                              root: classes.warningIcon
                                            }}
                                          />
                                        )}
                                      </span>
                                      <div>
                                        <FormControlLabel
                                          control={
                                            <Switch
                                              checked={deficiency.emergency}
                                              onChange={e =>
                                                this.updateDeficiency(
                                                  e.target.checked,
                                                  item.id,
                                                  deficiency.id
                                                )
                                              }
                                              disabled={loading}
                                            />
                                          }
                                          label="Emergency"
                                        />
                                        <IconButton
                                          className={classes.iconDelete}
                                          onClick={() =>
                                            this.setState({
                                              itemId: item.id,
                                              deficiencyId: deficiency.id,
                                              openDelete: true
                                            })
                                          }
                                        >
                                          <Delete />
                                        </IconButton>
                                      </div>
                                    </div>
                                  ))}
                                  {item.deficiencies.length === 0 && (
                                    <p className={classes.empty}>
                                      WITHOUT DEFICIENCIES
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <RadioGroup
                                  name="type"
                                  value={item.answer || ""}
                                  classes={{ root: classes.radioGroup }}
                                  onChange={e => {
                                    item.answer = e.target.value;
                                    this.setState({});
                                  }}
                                >
                                  <FormControlLabel
                                    value="1"
                                    control={<Radio color="primary" />}
                                    label="Yes"
                                    labelPlacement="end"
                                    classes={{ root: classes.radio }}
                                    className={classNames(
                                      classes.radio,
                                      item.answer === "1" &&
                                        classes.radioSelected
                                    )}
                                  />
                                  <FormControlLabel
                                    value="2"
                                    control={<Radio color="primary" />}
                                    label="No"
                                    labelPlacement="end"
                                    className={classNames(
                                      classes.radio,
                                      item.answer === "2" &&
                                        classes.radioSelected
                                    )}
                                  />
                                </RadioGroup>
                              )}
                            </CardContent>
                            {/* <CardActions>
                              <Button size="small">See photos</Button>
                            </CardActions> */}
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
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.global.loading,
    states: state.global.states,
    item_states: state.global.item_states
  };
};

const mapDispatchToProps = {
  setLoading,
  fetchItemStates,
  addDeficiencyItem,
  deleteDeficiencyItem,
  updateDeficiencyItem,
  updateItemStructure,
  updateItemSpan,
  addItemStructure,
  addItemSpan
};

Equipment.propTypes = {
  inspection_id: PropTypes.any,
  categories: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(Equipment);
