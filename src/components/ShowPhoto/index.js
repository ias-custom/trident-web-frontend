import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
} from "@material-ui/core";

const ShowPhoto = ({ ...props }) => {
  const { open, closeDialog, url } = props;

  return (
    <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onEscapeKeyDown={() => closeDialog()}
        onBackdropClick={() => closeDialog()}
      >
        <DialogTitle>{""}</DialogTitle>
        <DialogContent>
          <img src={url} alt="deficiency" style={{ height: 400, width: '100%' }} />
        </DialogContent>
      </Dialog>
  );
};

export default ShowPhoto;
