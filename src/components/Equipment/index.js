import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import styles from "./styles";
import { withRouter } from "react-router-dom";
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
  IconButton
} from "@material-ui/core";
import { updateStructure } from "../../redux/actions/structureActions";
import { updateSpan } from "../../redux/actions/spanActions";
import {
  getCategoriesInspection,
  getInspectionsProject
} from "../../redux/actions/projectActions";
import { Add, ExpandMore, AddCircle } from "@material-ui/icons";

class Equipment extends React.Component {
  state = {
    open: false,
    openId: "",
    inspectionSelected: ""
  };

  componentDidMount() {
    this.props.getInspectionsProject(this.props.projectId);
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

  render() {
    const {
      classes,
      loading,
      inspection_id,
      inspections,
      categoriesInspection,
      inspectionName
    } = this.props;
    const { open, inspectionSelected, openId } = this.state;

    return (
      <div style={{ height: "100%" }}>
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
                        >
                          <AddCircle />
                        </IconButton>
                      </Typography>
                    </Grid>
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
    states: state.global.states
  };
};

const mapDispatchToProps = {
  getInspectionsProject,
  getCategoriesInspection,
  updateStructure,
  updateSpan
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
