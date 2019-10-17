import React from "react";
import PropTypes from "prop-types";
import styles from "./styles";
import { withSnackbar } from "notistack";
import { connect } from "react-redux";
import { compose } from "recompose";
import { Prompt } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Paper,
  Tabs,
  Tab
} from "@material-ui/core";
import {
  ExpandMore,
  Save,
  Delete,
  Cancel,
  ExpandLess
} from "@material-ui/icons";
import {
  updateCategoryInspection,
  updateItemCategory
} from "../../redux/actions/projectActions";
import classNames from "classnames";
import Panel from "../../components/Panel";
import SwipeableViews from "react-swipeable-views";

class SetInspections extends React.Component {
  state = {
    open: false,
    openId: "",
    categoryId: "",
    name: this.props.name,
    inspections: this.props.inspections,
    deficiencies: this.props.deficiencies,
    changeName: false,
    tab: 0
  };

  openCollapse(openId, category) {
    category.newName = "";
    let { categories } = this.state;
    categories.map(category => {
      category.items.map(item => {
        item.edit = false;
        return item;
      });
      return category;
    });
    this.setState({ categories });
    if (openId === category.id) this.setState({ openId: 0 });
    else this.setState({ openId: category.id });
  }

  deleteCategory(categoryId, inspectionId) {
    const { inspections } = this.state;
    let indexInspection = 0;
    const inspection = inspections.find((inspection, index) => {
      if (inspection.id === inspectionId) {
        indexInspection = index;
        return inspection;
      }
      return undefined;
    });
    if (inspection.categories.length === 1) {
      this.props.enqueueSnackbar(
        "The inspection must have at least 1 category",
        {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" }
        }
      );
      return;
    }
    inspection.categories = inspection.categories.filter(
      ({ id }) => id !== categoryId
    );
    inspections[indexInspection] = inspection;
    this.setState({ inspections });
  }

  deleteItem(itemId, categoryId, inspectionId) {
    const { inspections } = this.state;
    let indexCategory = 0;
    let indexInspection = 0;
    const inspection = inspections.find((inspection, index) => {
      if (inspection.id === inspectionId) {
        indexInspection = index;
        return inspection;
      }
      return undefined;
    });
    const category = inspection.categories.find((category, index) => {
      if (category.id === categoryId) {
        indexCategory = index;
        return category;
      }
      return undefined;
    });
    if (category.items.length === 1) {
      this.props.enqueueSnackbar("The category must have at least 1 item", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
      return;
    }
    category.items = category.items.filter(({ id }) => id !== itemId);
    inspection.categories[indexCategory] = category;
    inspections[indexInspection] = inspection;
    this.setState({ inspections });
  }

  deleteDeficiency(id) {
    const { deficiencies } = this.state;
    if (deficiencies.length === 1) {
      this.props.enqueueSnackbar(
        "The set must have at least 1 deficiency",
        {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" }
        }
      );
      return;
    }
    this.setState({ deficiencies:  deficiencies.filter(
      deficiency => deficiency.id !== id
    )});
  }

  render() {
    let { classes, isCreate } = this.props;
    const {
      loading,
      openId,
      open,
      inspections,
      deficiencies,
      name,
      changeName,
      tab
    } = this.state;
    return (
      <Panel>
        <Dialog
          open={open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onBackdropClick={() => this.setState({ open: false })}
          onEscapeKeyDown={() => this.setState({ open: false })}
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure you want to delete?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              If you delete the category it will be permanently.
            </DialogContentText>
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
              onClick={this.handleDelete}
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>
        <Grid container spacing={16} className={classes.inspections}>
          {/* <Prompt
            when={changeName}
            message="Are you sure you want to leave?, You will lose your changes"
          /> */}
          <Grid item xs={12}>
            <TextField
              name="name"
              value={name}
              onChange={e =>
                this.setState({ name: e.target.value, changeName: true })
              }
              error={name.length === 0 && changeName}
              helperText={
                changeName && name.length === 0 ? "Name is required" : ""
              }
              label="Name"
              fullWidth
              margin="normal"
              disabled={loading}
              required
            />
          </Grid>
          <Grid item className={classes.divTabs} xs={12}>
            <Tabs
              value={tab}
              onChange={(e, newValue) => this.setState({ tab: newValue })}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="INSPECTIONS" disabled={loading} />
              <Tab label="DEFICIENCES" disabled={loading} />
            </Tabs>
          </Grid>
          <Grid item xs={12}>
            <SwipeableViews
              index={tab}
              onChangeIndex={value => this.setState({ tab: value })}
              slideStyle={{
                overflowX: "hidden",
                overflowY: "hidden",
                padding: "0 2px"
              }}
            >
              <Grid container spacing={16}>
                {inspections.map(({ id, name, categories }) => (
                  <Grid item xs={6} key={id}>
                    <Typography
                      variant="h6"
                      align="center"
                      classes={{ h6: classes.categoryName }}
                    >
                      {name}
                    </Typography>
                    {categories.map(category => (
                      <div key={category.id}>
                        <Paper className={classes.paper}>
                          <div className={classes.divCategory}>
                            <TextField
                              name="name"
                              value={category.name}
                              label=""
                              required
                              disabled={loading}
                              inputProps={{
                                className: classes.inputCategory
                              }}
                              onChange={e => {
                                if (e.target.value === "") {
                                  this.props.enqueueSnackbar(
                                    "The category are not empty",
                                    {
                                      variant: "error"
                                    }
                                  );
                                  return;
                                }
                                category.name = e.target.value;
                                this.setState({});
                              }}
                            />
                            <IconButton
                              aria-label="Delete"
                              className={classes.iconDelete}
                              disabled={loading}
                              onClick={() => {
                                this.deleteCategory(category.id, id);
                              }}
                            >
                              <Cancel />
                            </IconButton>
                            {openId === category.id ? (
                              <IconButton
                                className={classes.buttonCollapse}
                                onClick={() => this.setState({ openId: 0 })}
                              >
                                <ExpandLess />
                              </IconButton>
                            ) : (
                              <IconButton
                                className={classes.buttonCollapse}
                                onClick={() =>
                                  this.setState({ openId: category.id })
                                }
                              >
                                <ExpandMore />
                              </IconButton>
                            )}
                          </div>
                          {openId === category.id ? (
                            <div>
                              <p className={classes.textItems}>ITEMS:</p>
                              {category.items.map(item => (
                                <div
                                  key={item.id}
                                  className={classNames(
                                    classes.divCategory,
                                    classes.divItem
                                  )}
                                >
                                  <TextField
                                    name="name"
                                    value={item.name}
                                    label=""
                                    required
                                    disabled={loading}
                                    autoFocus={item.edit}
                                    inputProps={{
                                      className: classes.inputCategory
                                    }}
                                    onChange={e => {
                                      if (e.target.value === "") {
                                        this.props.enqueueSnackbar(
                                          "The item are not empty",
                                          {
                                            variant: "error"
                                          }
                                        );
                                        return;
                                      }
                                      item.name = e.target.value;
                                      this.setState({});
                                    }}
                                  />
                                  <IconButton
                                    className={classNames(
                                      classes.iconDelete,
                                      classes.iconItem
                                    )}
                                    aria-label="Delete"
                                    onClick={() => {
                                      this.deleteItem(item.id, category.id, id);
                                    }}
                                    disabled={loading}
                                  >
                                    <Cancel />
                                  </IconButton>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </Paper>
                      </div>
                    ))}
                  </Grid>
                ))}
              </Grid>
              <Grid>
                {deficiencies.map( deficiency => (
                  <Paper key={deficiency.id} className={classes.paper}>
                    <div className={classes.divCategory}>
                      <TextField
                        name="name"
                        value={deficiency.name}
                        label=""
                        required
                        disabled={loading}
                        inputProps={{
                          className: classes.inputCategory
                        }}
                        onChange={e => {
                          if (e.target.value === "") {
                            this.props.enqueueSnackbar(
                              "The deficiency are not empty",
                              {
                                variant: "error"
                              }
                            );
                            return;
                          }
                          deficiency.name = e.target.value;
                          this.setState({});
                        }}
                      />
                      <IconButton
                        aria-label="Delete"
                        className={classes.iconDelete}
                        disabled={loading}
                        onClick={() => {
                          this.deleteDeficiency(deficiency.id)
                        }}
                      >
                        <Cancel />
                      </IconButton>
                    </div>
                  </Paper>
                ))}
              </Grid>
            </SwipeableViews>
          </Grid>
        </Grid>
        <br />
        <Button
          disabled={name.length === 0}
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => this.props.action(inspections, deficiencies, name)}
        >
          {isCreate ? "Create Set" : "Update set"}
        </Button>
      </Panel>
    );
  }
}
const mapStateToProps = state => {
  return {
    loading: state.global.loading
  };
};

const mapDispatchToProps = {
  updateCategoryInspection,
  updateItemCategory
};

SetInspections.propTypes = {
  isCreate: PropTypes.bool.isRequired,
  inspections: PropTypes.array.isRequired,
  deficiencies: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired
};

export default compose(
  withSnackbar,
  withStyles(styles, { name: "SetInspections" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SetInspections);
