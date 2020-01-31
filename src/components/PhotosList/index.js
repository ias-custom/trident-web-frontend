import React, { useState } from "react";
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

const PhotosList=({...props}) => {
  const [open, setOpen] = useState(false)
  const [photoId, setPhotoId] = useState("")
  const { classes, loading, photos } = props;

  async function addPhoto(photo){
    const form = new FormData();
    let response = "";
    form.append("photo", photo);
    if (props.action === "structure")
      response = await props.addPhoto(props.itemId, form);
    if (props.action === "span")
      response = await props.addPhotoSpan(props.itemId, form);
    if (props.action === "access")
      response = await props.addPhotoAccess(props.itemId, form);
    if (props.action === "crossing")
      response = await props.addPhotoMarking(props.itemId, form);

    if (response.status === 200 || response.status === 201) {
      // SHOW NOTIFICACION SUCCCESS
      if (props.action === "access" || props.action === "crossing") {
        props.reload();
      }
      props.enqueueSnackbar("¡The photo was added successfully!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    } else {
      props.enqueueSnackbar("The request could not be processed!", {
        variant: "error"
      });
    }
  };

  function showModal(photoId) {
    setOpen(true)
    setPhotoId(photoId)
  }

  async function handleDelete(){
    setOpen(false)
    let response = "";
    if (props.action === "structure")
      response = await props.deletePhoto(
        props.itemId,
        photoId
      );
    if (props.action === "span")
      response = await props.deletePhotoSpan(
        props.itemId,
        photoId
      );
    if (props.action === "access")
      response = await props.deletePhotoAccess(
        props.itemId,
        photoId
      );
    if (props.action === "crossing")
      response = await props.deletePhotoMarking(
        props.itemId,
        photoId
      );

    if (response.status === 200 || response.status === 204) {
      if (props.action === "access" || props.action === "crossing") {
        props.reload();
      }
      const text = `Photo successfully removed!`;
      props.enqueueSnackbar(text, {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    } else {
      props.enqueueSnackbar("The request could not be processed!", {
        variant: "error"
      });
    }
  };
  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onBackdropClick={() => setOpen(false)}
        onEscapeKeyDown={() => setOpen(false)}
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
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="primary"
            className={classes.buttonAccept}
            onClick={() => handleDelete()}
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
              addPhoto(files[0]);
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
                  onClick={() => showModal(photo.id)}
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
