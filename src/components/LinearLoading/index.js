import React from "react";
import { LinearProgress, withStyles } from "@material-ui/core";
import styles from './styles';
import PropTypes from 'prop-types';

const LinearLoading = ({ loading = false, classes}) => {
  if (loading) {
    return <LinearProgress variant="query" className={classes.loading}/>;
  }

  return null;
};

LinearLoading.propTypes = {
  loading: PropTypes.bool
};

export default withStyles(styles)(LinearLoading);