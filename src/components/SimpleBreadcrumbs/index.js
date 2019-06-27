import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/lab/Breadcrumbs';
import { Link as RouterLink } from 'react-router-dom'
import Link from '@material-ui/core/Link';
import styles from './styles';

class SimpleBreadcrumbs extends React.Component {
  render() {
    const { classes, routes } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Breadcrumbs arial-label="Breadcrumb">
            {
              routes.map((route, index) => {
                return (
                  route.to !== null ?
                  <Link key={index} component={RouterLink} color="inherit" to={route.to}>{route.name}</Link> :
                  <Typography key={index} color="textPrimary">{route.name}</Typography>
                )
              })
            }
          </Breadcrumbs>
        </Paper>
      </div>
    );
  }
}

SimpleBreadcrumbs.propTypes = {
  classes: PropTypes.object.isRequired,
  routes: PropTypes.array.isRequired,
};

export default withStyles(styles)(SimpleBreadcrumbs);
