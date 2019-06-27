import React from 'react';
import Paper from "@material-ui/core/Paper/Paper";
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

const Panel = (props) => {
  const { classes } = props;

  return (
    <Paper className={classes.root}>
      {props.children}
    </Paper>
  )
};

export default withStyles(styles)(Panel);