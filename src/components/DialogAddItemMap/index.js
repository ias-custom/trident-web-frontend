import React, { useState } from "react";
import { compose } from "redux";
import { withStyles, Button } from "@material-ui/core";
import styles from "./styles";
import PropTypes from "prop-types";
import { DialogConfirmMap } from "..";

const DialogAddItemMap = ({ ...props }) => {
  const {
    classes,
    itemValue,
    structuresSelected,
    addFirstStructure,
    spanSelected,
    span,
    cancelAddItem,
    confirmAddItem,
    cancelAddSpan,
    cancelAddMarkingOrAccess,
    setSpanSelected,
    setAddFirstStructure,
  } = props;
  const [confirmStructures, setConfirmStructures] = useState(false)
  return (
    <div>
      {itemValue === 2 &&
        (structuresSelected.first.id &&
        structuresSelected.second.id &&
        confirmStructures ? (
          <DialogConfirmMap
            spanSelected={spanSelected}
            structuresSelected={structuresSelected}
            span={span}
            itemValue={itemValue}
            cancelAdd={() => cancelAddItem()}
            addItem={() => confirmAddItem()}
          />
        ) : (
          <div className={classes.detailsMarker}>
            <div className={classes.triangle}></div>
            <div className={classes.infoMarker}>
              {addFirstStructure ? (
                <div>
                  <p className={classes.paragraph}>
                    THE SELECTED STR/SUB START:
                  </p>
                  <p className={classes.paragraph}>
                    {structuresSelected.first.id
                      ? structuresSelected.first.number
                      : "Not selected"}
                  </p>
                </div>
              ) : (
                <div>
                  <p className={classes.paragraph}>THE SELECTED STR/SUB END:</p>
                  <p className={classes.paragraph}>
                    {structuresSelected.second.id
                      ? structuresSelected.second.number
                      : "Not selected"}
                  </p>
                </div>
              )}
              <div>
                <Button
                  variant="outlined"
                  className={classes.buttonCancel}
                  onClick={() => cancelAddSpan()}
                >
                  Cancel
                </Button>
                <Button
                  style={{ marginLeft: 10 }}
                  variant="outlined"
                  className={classes.buttonAccept}
                  disabled={
                    addFirstStructure
                      ? structuresSelected.first.id === ""
                      : structuresSelected.second.id === ""
                  }
                  onClick={() => {
                    if (addFirstStructure) {
                      setAddFirstStructure(false);
                    } else {
                      setConfirmStructures(true);
                    }
                  }}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        ))}
      {(itemValue === 3 || itemValue === 4) &&
        (spanSelected ? (
          <DialogConfirmMap
            itemValue={itemValue}
            spanSelected={spanSelected}
            structuresSelected={structuresSelected}
            span={span}
            cancelAdd={() => cancelAddItem()}
            addItem={() => confirmAddItem()}
          />
        ) : (
          <div className={classes.detailsMarker}>
            <div className={classes.triangle}></div>
            <div className={classes.infoMarker}>
              <p className={classes.paragraph}>THE SELECTED SPAN IS:</p>
              <p className={classes.paragraph}>
                {span.number ? span.number : "Not selected"}
              </p>
              <div>
                <Button
                  variant="outlined"
                  className={classes.buttonCancel}
                  onClick={() => cancelAddMarkingOrAccess()}
                >
                  Cancel
                </Button>
                <Button
                  style={{ marginLeft: 10 }}
                  variant="outlined"
                  className={classes.buttonAccept}
                  onClick={() => setSpanSelected(span.id)}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        ))}
      {(itemValue === 1 || itemValue === 5) && (
        <DialogConfirmMap
          itemValue={itemValue}
          spanSelected={spanSelected}
          structuresSelected={structuresSelected}
          span={span}
          cancelAdd={() => cancelAddItem()}
          addItem={() => confirmAddItem()}
        />
      )}
    </div>
  );
};

DialogAddItemMap.propTypes = {
  tab: PropTypes.number,
  type: PropTypes.number,
  addItem: PropTypes.func.isRequired,
  itemValue: PropTypes.number,
};

DialogAddItemMap.defaultProps = {
  tab: 5,
  type: 1,
  addItem: () => {},
  itemValue: 0,
};

export default compose(withStyles(styles))(DialogAddItemMap);
