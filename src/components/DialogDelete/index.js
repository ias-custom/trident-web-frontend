import React from "react";
import useStyles from "./styles";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";

const DialogDelete = ({ ...props }) => {
  const { open, item } = props;
  const { buttonCancel, buttonAccept } = useStyles();

  return (
    (
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onBackdropClick={() => props.closeModal(open)}
        onEscapeKeyDown={() => props.closeModal(open)}
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            If you delete the {item} it will be permanently.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            className={buttonCancel}
            onClick={() => props.closeModal(open)}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="primary"
            className={buttonAccept}
            onClick={() => props.remove()}
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    ) || ""
  );
};

export default DialogDelete;
