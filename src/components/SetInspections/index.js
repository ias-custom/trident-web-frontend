import React from "react";
import PropTypes from "prop-types";
import styles from "./styles";
import { connect } from "react-redux";
import { compose } from "recompose";
import { withSnackbar } from "notistack";
import { withStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper
} from "@material-ui/core";
import { ExpandMore, Cancel, ExpandLess, AddCircle } from "@material-ui/icons";
import classNames from "classnames";
import Panel from "../../components/Panel";

class SetInspections extends React.Component {
  state = {
    openId: "",
    categoryId: "",
    name: this.props.name,
    inspections: this.props.inspections,
    changeName: false,
    itemId: "",
    openAdd: false,
    action: "",
    newName: ""
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
      this.props.enqueueSnackbar("The set must have at least 1 deficiency", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
      return;
    }
    this.setState({
      deficiencies: deficiencies.filter(deficiency => deficiency.id !== id)
    });
  }

  openAddCategory(id) {
    this.setState({ inspectionId: id, action: "category", openAdd: true });
  }

  openAddItem(inspectionId, id) {
    this.setState({
      inspectionId,
      categoryId: id,
      action: "item",
      openAdd: true
    });
  }

  openAddDeficiency(inspectionId, categoryId, id) {
    this.setState({
      inspectionId,
      categoryId,
      itemId: id,
      action: "deficiency",
      openAdd: true
    });
  }

  confirmAddCategory() {
    const { inspections, inspectionId, newName } = this.state;
    const newInspections = inspections.map(inspection => {
      if (inspection.id === inspectionId) {
        inspection.categories.unshift({
          id: Math.random(),
          name: newName,
          items: []
        });
      }
      return inspection;
    });
    this.setState({
      openAdd: false,
      inspections: newInspections,
      newName: ""
    });
  }

  confirmAddItem() {
    const { inspections, inspectionId, categoryId, newName } = this.state;
    const newInspections = inspections.map(inspection => {
      if (inspection.id === inspectionId) {
        inspection.categories = inspection.categories.map(category => {
          if (category.id === categoryId) {
            category.items.unshift({
              id: Math.random(),
              name: newName,
              deficiencies: []
            });
          }
          return category;
        });
      }
      return inspection;
    });
    this.setState({
      openAdd: false,
      inspections: newInspections,
      newName: ""
    });
  }

  confirmAddDeficiency() {
    const { inspections, inspectionId, categoryId, itemId, newName } = this.state;
    const newInspections = inspections.map(inspection => {
      if (inspection.id === inspectionId) {
        inspection.categories = inspection.categories.map(category => {
          if (category.id === categoryId) {
            category.items = category.items.map(item => {
              if (item.id === itemId) {
                item.deficiencies.unshift({
                  id: Math.random(),
                  name: newName
                });
              }
              return item
            });
          }
          return category;
        });
      }
      return inspection;
    });
    this.setState({
      openAdd: false,
      inspections: newInspections,
      newName: ""
    });
  }

  validateSet () {
    const { inspections, name } = this.state;
    let error = false
    inspections.forEach(({categories}) => {
      var empty = categories.find(({items}) => items.length === 0)
      if (empty) {
        error = true
        this.props.enqueueSnackbar(`Opps! The category "${empty.name}" has no items.`, {
          variant: "error"
        });
        return 
      }
      categories.forEach(({items}) => {
        var empty = items.find(({deficiencies}) => deficiencies.length === 0)
        if (empty) {
          error = true
          this.props.enqueueSnackbar(`Opps! The item "${empty.name}" has no deficiencies.`, {
            variant: "error"
          });
          return 
        }
      })
    })
    if (!error) this.props.action(inspections, name)
  }

  render() {
    let { classes, isCreate } = this.props;
    const {
      loading,
      openId,
      itemId,
      openAdd,
      action,
      inspections,
      name,
      changeName,
      newName
    } = this.state;
    return (
      <Panel>
        <Dialog
          open={openAdd}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onBackdropClick={() => this.setState({ open: false })}
          onEscapeKeyDown={() => this.setState({ openAdd: false })}
          classes={{ paper: classes.dialog }}
        >
          <DialogTitle id="alert-dialog-title">
            {action === "category" && "Add category"}
            {action === "item" && "Add item"}
            {action === "deficiency" && "Add deficiency"}
          </DialogTitle>
          <DialogContent>
            <TextField
              name="name"
              value={newName}
              onChange={e => this.setState({ newName: e.target.value })}
              label="Name"
              fullWidth
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              className={classes.buttonCancel}
              onClick={() => this.setState({ openAdd: false, newName: "" })}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              color="primary"
              className={classes.buttonAccept}
              disabled={newName.length === 0}
              onClick={() => {
                if (action === "category") this.confirmAddCategory();
                if (action === "item") this.confirmAddItem();
                if (action === "deficiency") this.confirmAddDeficiency();
              }}
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
                <div>
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{ marginBottom: 10 }}
                    onClick={() => this.openAddCategory(id)}
                  >
                    Add Category
                  </Button>
                </div>
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
                          <p className={classes.textItems}>
                            ITEMS:{" "}
                            <IconButton
                              className={classes.iconAdd}
                              disabled={loading}
                              onClick={() => this.openAddItem(id, category.id)}
                            >
                              <AddCircle />
                            </IconButton>
                          </p>
                          {category.items.map(item => (
                            <Grid key={item.id}>
                              <div
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
                                {itemId === item.id ? (
                                  <IconButton
                                    className={classes.buttonCollapse}
                                    onClick={() => this.setState({ itemId: 0 })}
                                  >
                                    <ExpandLess />
                                  </IconButton>
                                ) : (
                                  <IconButton
                                    className={classes.buttonCollapse}
                                    onClick={() =>
                                      this.setState({ itemId: item.id })
                                    }
                                  >
                                    <ExpandMore />
                                  </IconButton>
                                )}
                              </div>
                              {itemId === item.id && (
                                <div className={classes.divDeficiency}>
                                  <p className={classes.textItems}>
                                    DEFICIENCIES:{" "}
                                    <IconButton
                                      className={classes.iconAdd}
                                      disabled={loading}
                                      onClick={() => this.openAddDeficiency(id, category.id, item.id)}
                                    >
                                      <AddCircle />
                                    </IconButton>
                                  </p>
                                  {item.deficiencies.map(d => (
                                    <div
                                      key={d.id}
                                      className={classNames(
                                        classes.divCategory,
                                        classes.divItem
                                      )}
                                    >
                                      <TextField
                                        name="name"
                                        value={d.name}
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
                                          d.name = e.target.value;
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
                                          item.deficiencies = item.deficiencies.filter(
                                            ({ id }) => id !== d.id
                                          );
                                          this.setState({});
                                        }}
                                        disabled={loading}
                                      >
                                        <Cancel />
                                      </IconButton>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </Grid>
                          ))}
                        </div>
                      ) : null}
                    </Paper>
                  </div>
                ))}
              </Grid>
            ))}
          </Grid>
        </Grid>
        <br />
        <Button
          disabled={name.length === 0}
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => this.validateSet()}
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

SetInspections.propTypes = {
  isCreate: PropTypes.bool.isRequired,
  inspections: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired
};

export default compose(
  withSnackbar,
  withStyles(styles, { name: "SetInspections" }),
  connect(mapStateToProps)
)(SetInspections);
