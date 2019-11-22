import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import styles from "./styles";
import { withRouter } from "react-router-dom";
import { withSnackbar } from "notistack";
import PropTypes from "prop-types";
import InputFiles from "react-input-files";
import {
  Button,
  withStyles,
  IconButton,
  GridList,
  GridListTile,
  GridListTileBar,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@material-ui/core";
import { addPhoto, deletePhoto } from "../../redux/actions/structureActions";
import {
  addPhotoSpan,
  deletePhotoSpan,
  addPhotoAccess,
  deletePhotoAccess,
  addPhotoMarking,
  deletePhotoMarking
} from "../../redux/actions/spanActions";
import { Delete } from "@material-ui/icons";

class PhotosList extends React.Component {
  state = {
    open: false,
    photoId: ""
  };

  componentDidMount() {}

  addPhoto = async photo => {
    const form = new FormData();
    let response = "";
    form.append("photo", photo);
    if (this.props.action === "structure")
      response = await this.props.addPhoto(this.props.itemId, form);
    if (this.props.action === "span")
      response = await this.props.addPhotoSpan(this.props.itemId, form);
    if (this.props.action === "access")
      response = await this.props.addPhotoAccess(this.props.itemId, form);
    if (this.props.action === "crossing")
      response = await this.props.addPhotoMarking(this.props.itemId, form);

    if (response.status === 200 || response.status === 201) {
      // SHOW NOTIFICACION SUCCCESS
      if (this.props.action === "access" || this.props.action === "crossing") {
        this.props.reload();
      }
      this.props.enqueueSnackbar("¡The photo was added successfully!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    } else {
      this.props.enqueueSnackbar("The request could not be processed!", {
        variant: "error"
      });
    }
  };

  showModal(photoId) {
    this.setState({ open: true, photoId });
  }

  handleDelete = async () => {
    this.setState({ open: false });
    let response = "";
    if (this.props.action === "structure")
      response = await this.props.deletePhoto(
        this.props.itemId,
        this.state.photoId
      );
    if (this.props.action === "span")
      response = await this.props.deletePhotoSpan(
        this.props.itemId,
        this.state.photoId
      );
    if (this.props.action === "access")
      response = await this.props.deletePhotoAccess(
        this.props.itemId,
        this.state.photoId
      );
    if (this.props.action === "crossing")
      response = await this.props.deletePhotoMarking(
        this.props.itemId,
        this.state.photoId
      );

    if (response.status === 200 || response.status === 204) {
      if (this.props.action === "access" || this.props.action === "crossing") {
        this.props.reload();
      }
      const text = `Photo successfully removed!`;
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

  render() {
    const { classes, loading, photos } = this.props;
    const { open } = this.state;
    return (
      <div>
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
              If you delete it will be permanently.
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
              onClick={() => this.handleDelete()}
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>

        <div className={classes.header}>
          {!loading ? (
            <InputFiles
              name="logo"
              accept="image/*"
              onChange={files => {
                this.addPhoto(files[0]);
              }}
            >
              <Button variant="outlined" color="primary">
                Add Photo
              </Button>
            </InputFiles>
          ) : (
            <Button variant="outlined" color="primary" disabled>
              Add Photo
            </Button>
          )}
        </div>
        <GridList cellHeight={180} cols={3}>
          {photos.map(photo => (
            <GridListTile key={photo.id}>
              <img src={photo.thumbnail} alt={photo.name} />
              <GridListTileBar
                title={photo.name}
                titlePosition="top"
                actionPosition="right"
                actionIcon={
                  <IconButton
                    className={classes.icon}
                    disabled={loading}
                    onClick={() => this.showModal(photo.id)}
                  >
                    <Delete />
                  </IconButton>
                }
              />
            </GridListTile>
          ))}
        </GridList>
        {photos.length === 0 ? (
          <Typography
            variant="display1"
            align="center"
            className={classes.emptyText}
          >
            THERE AREN'T PHOTOS
          </Typography>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.global.loading,
    structureTypes: state.structures.structureTypes,
    states: state.global.states
  };
};

const mapDispatchToProps = {
  addPhoto,
  addPhotoSpan,
  deletePhoto,
  deletePhotoSpan,
  addPhotoAccess,
  deletePhotoAccess,
  addPhotoMarking,
  deletePhotoMarking
};

PhotosList.propTypes = {
  photos: PropTypes.array.isRequired,
  action: PropTypes.string.isRequired,
  itemId: PropTypes.number.isRequired
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(PhotosList);
