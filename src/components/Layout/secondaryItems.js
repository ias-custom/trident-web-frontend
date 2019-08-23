import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ReportingIcon from '@material-ui/icons/Assessment';
import ProjectIcon from '@material-ui/icons/Work';

import { Link as RouterLink } from 'react-router-dom'
import Link from '@material-ui/core/Link';
import styles from './styles';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { compose } from 'recompose';

const DashboardLink = props => <RouterLink to="/home" {...props} />;
const ReportingLink = props => <RouterLink to="/reports" {...props} />;
const ProjectLink = props => <RouterLink to="/projects" {...props} />;

class SecondaryListItems extends React.Component {
  state = {
    customerName: ""
  }
  componentDidMount () {
  }
  render () { 
    const customerSelected = this.props.customers.find( ({id}) => id === this.props.customerSelectedId)
    const customerName = customerSelected.name
    const { classes } = this.props
    return (
      <div>
        <Link component={DashboardLink}>
          <ListItem button>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary={`${customerName} Dashboard`} className={classes.textEllipsis}/>
          </ListItem>
        </Link>
        <Link component={ReportingLink}>
          <ListItem button>
            <ListItemIcon>
              <ReportingIcon />
            </ListItemIcon>
            <ListItemText primary={`${customerName} Reports`} />
          </ListItem>
        </Link>
        <Link component={ProjectLink}>
          <ListItem button>
            <ListItemIcon>
              <ProjectIcon />
            </ListItemIcon>
            <ListItemText primary={`${customerName} Projects`} />
          </ListItem>
        </Link>
      </div>
    );
  }
}
  
const mapStateToProps = (state) => {
return {
    customerSelectedId: state.global.customerSelectedId,
    customers: state.global.customers
}
};

export default compose(
connect(mapStateToProps),
withStyles(styles, {name: 'Layout'})
)(SecondaryListItems);