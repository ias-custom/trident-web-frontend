import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import RolesIcon from '@material-ui/icons/AssignmentInd';
import CustomersIcon from '@material-ui/icons/HowToReg';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ReportingIcon from '@material-ui/icons/Assessment';
import ProjectIcon from '@material-ui/icons/Work';
import BusinessIcon from '@material-ui/icons/Business';

import UserIcon from '@material-ui/icons/GroupOutlined';
import { Link as RouterLink } from 'react-router-dom'
import Link from '@material-ui/core/Link';
import styles from './styles';
import { withStyles, Divider } from '@material-ui/core';
import {  toggleItemMenu } from '../../redux/actions/layoutActions';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import {
  CAN_ADD_USER,
  CAN_VIEW_USER,
  CAN_ADD_ROLE,
  CAN_VIEW_ROLE,
  CAN_ADD_PROJECT,
  CAN_VIEW_PROJECT,
  CAN_ADD_SUBSTATION,
  CAN_VIEW_SUBSTATION,
} from '../../redux/permissions'
/*
import Collapse from "@material-ui/core/Collapse/Collapse";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
*/


const UsersLink = props => <RouterLink to="/users" {...props} />;
const UsersCreateLink = props => <RouterLink to="/users/create" {...props} />;
const RolesLink = props => <RouterLink to="/roles" {...props} />;
const RolesCreateLink = props => <RouterLink to="/roles/create" {...props} />;
const CustomersLink = props => <RouterLink to="/customers" {...props} />;
const CustomersCreateLink = props => <RouterLink to="/customers/create" {...props} />;
const ProjectsLink = props => <RouterLink to="/projects" {...props} />;
const ProjectCreateLink = props => <RouterLink to="/projects/create" {...props} />;
const DashboardLink = props => <RouterLink to="/home" {...props} />;
const ReportingLink = props => <RouterLink to="/reports" {...props} />;
const SubstationsLink = props => <RouterLink to="/substations" {...props} />;
const SubstationCreateLink = props => <RouterLink to="/substations/create" {...props} />;

class MainListItems extends React.Component {
  
  changeStateOpen = (nameItem, open) => {
    this.props.toggleItemMenu({nameItem, open})
  };
  
  
  render () {
    const customerSelected = this.props.customers.find( ({id}) => id === this.props.customerSelectedId)
    const customerName = customerSelected.name
    const { classes, itemsMenu, permissions, is_superuser } = this.props
    return (
      <div>
        {permissions.includes(CAN_ADD_USER) || permissions.includes(CAN_VIEW_USER) || is_superuser ? (
          <div>
            <ListItem button onClick={()=>{this.changeStateOpen('users', !itemsMenu.users.open)}} className={classes.listItem}>
              <ListItemIcon>
                <UserIcon/>
              </ListItemIcon>
              <ListItemText primary="Users System Admin" />
              {itemsMenu.users.open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={itemsMenu.users.open}>
              <List component="div">
                { permissions.includes(CAN_VIEW_USER) || is_superuser ? (
                  <Link component={UsersLink} underline="none">
                    <ListItem button className={classes.subMenu} selected={itemsMenu.users.list}>
                      <ListItemText primary="Users List" />
                    </ListItem>
                  </Link>
                ): null }
                { permissions.includes(CAN_ADD_USER) || is_superuser ? (
                  <Link component={UsersCreateLink} underline="none">
                    <ListItem button className={classes.subMenu} selected={itemsMenu.users.create}>
                      <ListItemText primary="User Create" />
                    </ListItem>
                  </Link>
                ): null }
              </List>
            </Collapse>
          </div>
          
        ): null}
        { permissions.includes(CAN_ADD_ROLE) || permissions.includes(CAN_VIEW_ROLE) || is_superuser ? (
          <div>
            <ListItem button onClick={()=>{this.changeStateOpen('roles', !itemsMenu.roles.open)}} className={classes.listItem}>
              <ListItemIcon>
                <RolesIcon/>
              </ListItemIcon>
              <ListItemText primary="Roles Admin" />
              {itemsMenu.roles.open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={itemsMenu.roles.open}>
              <List component="div">
              { permissions.includes(CAN_VIEW_ROLE) || is_superuser ? (
                <Link component={RolesLink} underline="none">
                  <ListItem button className={classes.subMenu} selected={itemsMenu.roles.list}>
                    <ListItemText primary="Roles List" />
                  </ListItem>
                </Link>
              ):null }
              { permissions.includes(CAN_ADD_ROLE) || is_superuser ? (
                <Link component={RolesCreateLink} underline="none">
                  <ListItem button className={classes.subMenu} selected={itemsMenu.roles.create}>
                    <ListItemText primary="Role Create" />
                  </ListItem>
                </Link>
              ):null}
              </List>
            </Collapse>
          </div>
        ): null}
        { is_superuser ? (
          <div>
            <ListItem button onClick={()=>{this.changeStateOpen('customers',!itemsMenu.customers.open)}} className={classes.listItem}>
              <ListItemIcon>
                <CustomersIcon/>
              </ListItemIcon>
              <ListItemText primary="Customers Admin" />
              {itemsMenu.customers.open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={itemsMenu.customers.open}>
              <List component="div">
                <Link component={CustomersLink} underline="none">
                  <ListItem button className={classes.subMenu} selected={itemsMenu.customers.list}>
                    <ListItemText primary="Customers List" />
                  </ListItem>
                </Link>
                <Link component={CustomersCreateLink} underline="none">
                  <ListItem button className={classes.subMenu} selected={itemsMenu.customers.create}>
                    <ListItemText primary="Customer Create" />
                  </ListItem>
                </Link>
              </List>
            </Collapse>
          </div>
        ):null}
        {permissions.includes(CAN_ADD_USER) || permissions.includes(CAN_VIEW_USER) || permissions.includes(CAN_ADD_ROLE) || permissions.includes(CAN_VIEW_ROLE) || is_superuser ? <Divider /> : null}
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
            <ListItemText primary={`${customerName} Reports`} className={classes.textEllipsis}/>
          </ListItem>
        </Link>
        { permissions.includes(CAN_ADD_PROJECT) || permissions.includes(CAN_VIEW_PROJECT) || is_superuser ? (
          <div>
            <ListItem button onClick={()=>{this.changeStateOpen('projects', !itemsMenu.projects.open)}} className={classes.listItem}>
              <ListItemIcon>
                <ProjectIcon/>
              </ListItemIcon>
              <ListItemText primary={`${customerName} Projects`} className={classes.textEllipsis} />
              {itemsMenu.projects.open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={itemsMenu.projects.open}>
              <List component="div">
              { permissions.includes(CAN_VIEW_PROJECT) || is_superuser ? (
                <Link component={ProjectsLink} underline="none">
                  <ListItem button className={classes.subMenu} selected={itemsMenu.projects.list}>
                    <ListItemText primary="Projects List" />
                  </ListItem>
                </Link>
              ):null }
              { permissions.includes(CAN_ADD_PROJECT) || is_superuser ? (
                <Link component={ProjectCreateLink} underline="none">
                  <ListItem button className={classes.subMenu} selected={itemsMenu.projects.create}>
                    <ListItemText primary="Project Create" />
                  </ListItem>
                </Link>
              ):null}
              </List>
            </Collapse>
          </div>
        ): null}
        { permissions.includes(CAN_ADD_SUBSTATION) || permissions.includes(CAN_VIEW_SUBSTATION) || is_superuser ? (
          <div>
            <ListItem button onClick={()=>{this.changeStateOpen('substations', !itemsMenu.substations.open)}} className={classes.listItem}>
              <ListItemIcon>
                <BusinessIcon/>
              </ListItemIcon>
              <ListItemText primary={`Substations Admin`} className={classes.textEllipsis} />
              {itemsMenu.substations.open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={itemsMenu.substations.open}>
              <List component="div">
              { permissions.includes(CAN_VIEW_SUBSTATION) || is_superuser ? (
                <Link component={SubstationsLink} underline="none">
                  <ListItem button className={classes.subMenu} selected={itemsMenu.substations.list}>
                    <ListItemText primary="Substation List" />
                  </ListItem>
                </Link>
              ):null }
              { permissions.includes(CAN_ADD_SUBSTATION) || is_superuser ? (
                <Link component={SubstationCreateLink} underline="none">
                  <ListItem button className={classes.subMenu} selected={itemsMenu.substations.create}>
                    <ListItemText primary="Substation Create" />
                  </ListItem>
                </Link>
              ):null}
              </List>
            </Collapse>
          </div>
        ): null}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    itemsMenu: state.layout.itemsMenu,
    customerSelectedId: state.customers.customerSelectedId,
    customers: state.customers.customers,
    permissions: state.auth.permissions,
    is_superuser: state.auth.is_superuser
  }
};

const mapDispatchToProps = { toggleItemMenu };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles)
)(MainListItems);


