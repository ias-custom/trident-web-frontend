import React from "react";
import { compose } from "recompose";
import styles from "./styles";
import { withStyles, Button } from "@material-ui/core";

const DialogConfirmMap = ({ ...props }) => {
  const {
    itemValue,
    classes,
    spanSelected,
    structuresSelected,
    span,
    addItem,
    cancelAdd,
  } = props;
  return (
    <div>
      {itemValue !== 2 ? (
        <i className={`fas fa-map-marker-alt ${classes.iconMarker}`}></i>
      ) : null}
      <div className={classes.detailsMarker}>
        <div className={classes.triangle}></div>
        <div className={classes.infoMarker}>
          {itemValue === 2 ? (
            <p className={classes.paragraph}>CONFIRM THE STR/SUB?</p>
          ) : (
            <p className={classes.paragraph}>¡SELECT TO LOCATION !</p>
          )}
          {spanSelected ? (
            <p className={classes.paragraph}> - Selected span: {span.number}</p>
          ) : null}
          {structuresSelected.first.id ? (
            <p className={classes.paragraph}>
              {" "}
              - Selected str/sub start: {structuresSelected.first.number}
            </p>
          ) : null}
          {structuresSelected.second.id ? (
            <p className={classes.paragraph}>
              {" "}
              - Selected str/sub end: {structuresSelected.second.number}
            </p>
          ) : null}
          <div>
            <Button
              variant="outlined"
              className={classes.buttonCancel}
              onClick={() => {
                cancelAdd();
              }}
            >
              Cancel
            </Button>
            <Button
              style={{ marginLeft: 10 }}
              variant="outlined"
              className={classes.buttonAccept}
              onClick={() => addItem()}
            >
              Yes, I sure
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default compose(withStyles(styles))(DialogConfirmMap);
