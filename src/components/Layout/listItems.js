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

import UserIcon from '@material-ui/icons/GroupOutlined';
import { Link as RouterLink } from 'react-router-dom'
import Link from '@material-ui/core/Link';
import styles from './styles';
import { withStyles } from '@material-ui/core';
import {  toggleItemMenu } from '../../redux/actions/layoutActions';
import { connect } from 'react-redux';
import { compose } from 'recompose';
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

class MainListItems extends React.Component {
  
  changeStateOpen = (nameItem, open) => {
    this.props.toggleItemMenu({nameItem, open})
  };
  
  
  render () {
    const { classes, itemsMenu } = this.props
    return (
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
              <Link component={UsersLink} underline="none">
                <ListItem button className={classes.subMenu} selected={itemsMenu.users.list}>
                  <ListItemText primary="Users List" />
                </ListItem>
              </Link>
              <Link component={UsersCreateLink} underline="none">
                <ListItem button className={classes.subMenu} selected={itemsMenu.users.create}>
                  <ListItemText primary="User Create" />
                </ListItem>
              </Link>
            </List>
          </Collapse>
          <ListItem button onClick={()=>{this.changeStateOpen('roles', !itemsMenu.roles.open)}} className={classes.listItem}>
            <ListItemIcon>
              <RolesIcon/>
            </ListItemIcon>
            <ListItemText primary="Roles Admin" />
            {itemsMenu.roles.open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={itemsMenu.roles.open}>
            <List component="div">
              <Link component={RolesLink} underline="none">
                <ListItem button className={classes.subMenu} selected={itemsMenu.roles.list}>
                  <ListItemText primary="Roles List" />
                </ListItem>
              </Link>
              <Link component={RolesCreateLink} underline="none">
                <ListItem button className={classes.subMenu} selected={itemsMenu.roles.create}>
                  <ListItemText primary="Role Create" />
                </ListItem>
              </Link>
            </List>
          </Collapse>
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
    );
  }
}

const mapStateToProps = (state) => {
  return {
    itemsMenu: state.layout.itemsMenu,
    customerSelectedId: state.global.customerSelectedId,
    customers: state.global.customers
  }
};

const mapDispatchToProps = { toggleItemMenu };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles)
)(MainListItems);


