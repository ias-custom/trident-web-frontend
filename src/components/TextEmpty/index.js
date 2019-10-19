import React from "react";
import styles from "./styles";
import { connect } from "react-redux";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import { withSnackbar } from "notistack";
import { Grid, withStyles, Typography } from "@material-ui/core";

const TextEmpty = ({ ...props }) => {
  const { itemName, loading, classes, empty } = props;
  return (
    <Grid container justify="center">
      {loading ? (
        <Typography
          variant="display1"
          align="center"
          className={classes.emptyText}
        >
          LOADING...
        </Typography>
      ) : (
        empty &&
        <Typography
          variant="display1"
          align="center"
          className={classes.emptyText}
        >
          THERE AREN'T {itemName}
        </Typography>
      )}
    </Grid>
  );
};

const mapStateToProps = state => {
  return {
    loading: state.global.loading
  };
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "TextEmpty" }),
  connect(mapStateToProps)
)(TextEmpty);
