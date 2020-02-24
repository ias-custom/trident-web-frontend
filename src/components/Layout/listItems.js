import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ReportingIcon from '@material-ui/icons/Assessment';
import ProjectIcon from '@material-ui/icons/Work';
import BusinessIcon from '@material-ui/icons/Business'
import RolesIcon from '@material-ui/icons/AssignmentInd'
import CustomersIcon from '@material-ui/icons/HowToReg'

import UserIcon from '@material-ui/icons/GroupOutlined';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import styles from './styles';
import { withStyles, Divider } from '@material-ui/core';
import {  toggleItemMenu, setProjectForMap } from '../../redux/actions/layoutActions';
import {
  CAN_VIEW_USER,
  CAN_VIEW_ROLE,
  CAN_VIEW_PROJECT,
  CAN_VIEW_SUBSTATION,
  CAN_VIEW_SET,
} from '../../redux/permissions'
import { FolderOpen, SettingsApplications, Timeline } from '@material-ui/icons';
/*
import Collapse from "@material-ui/core/Collapse/Collapse";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
*/


const UsersLink = props => <RouterLink to="/users" {...props} />;
const RolesLink = props => <RouterLink to="/roles" {...props} />;
const CustomersLink = props => <RouterLink to="/customers" {...props} />;
const ProjectsLink = props => <RouterLink to="/projects" {...props} />;
const ProjectViewerLink = props => <RouterLink to="/project-viewer" {...props} />;
const MenuLink = props => <RouterLink to="/home" {...props} />;
const DashboardLink = props => <RouterLink to="/dashboard" {...props} />;
const ReportingLink = props => <RouterLink to="/reports" {...props} />;
const SubstationsLink = props => <RouterLink to="/substations" {...props} />;
const SetsLink = props => <RouterLink to="/sets" {...props} />;
const LinesLink = props => <RouterLink to="/lines" {...props} />;

class MainListItems extends React.Component {
  
  changeStateOpen = (nameItem, open) => {
    this.props.toggleItemMenu({nameItem, open})
  };
  
  
  render () {
    const { classes, itemsMenu, permissions, is_superuser } = this.props
    return (
      <div>
        <div>
          <ListItem button onClick={()=>{this.changeStateOpen('admin', !itemsMenu.admin.open)}} className={classes.listItem}>
            <ListItemIcon>
              <SettingsApplications/>
            </ListItemIcon>
            <ListItemText primary="System Admin" />
            {itemsMenu.admin.open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={itemsMenu.admin.open}>
            <List component="div">
              { permissions.includes(CAN_VIEW_USER) || is_superuser ? (
                <Link component={UsersLink} underline="none">
                  <ListItem button className={classes.subMenu} selected={itemsMenu.admin.users}>
                    <ListItemIcon>
                      <UserIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Users" />
                  </ListItem>
                </Link>
              ): null }
              { permissions.includes(CAN_VIEW_ROLE) || is_superuser ? (
                <Link component={RolesLink} underline="none">
                  <ListItem button className={classes.subMenu} selected={itemsMenu.admin.roles}>
                    <ListItemIcon>
                      <RolesIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Roles" />
                  </ListItem>
                </Link>
              ): null }
              { is_superuser ? (
                <Link component={CustomersLink} underline="none">
                  <ListItem button className={classes.subMenu} selected={itemsMenu.admin.customers}>
                    <ListItemIcon>
                      <CustomersIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Utility" />
                  </ListItem>
                </Link>
              ) : null}
            </List>
          </Collapse>
        </div>
        {/* permissions.includes(CAN_VIEW_USER) || permissions.includes(CAN_VIEW_ROLE) || permissions.includes(CAN_VIEW_) || is_superuser ? (
          
        ): null */}
        {permissions.includes(CAN_VIEW_USER) || permissions.includes(CAN_VIEW_ROLE) || is_superuser ? <Divider /> : null}
        <Link component={MenuLink} underline="none">
          <ListItem button selected={itemsMenu.menu.apps}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Menu" className={classes.textEllipsis}/>
          </ListItem>
        </Link>
        <Link component={DashboardLink} underline="none">
          <ListItem button>
            <ListItemIcon>
              <ReportingIcon />
            </ListItemIcon>
            <ListItemText primary="Project Dashboard" className={classes.textEllipsis}/>
          </ListItem>
        </Link>
        <Link component={ReportingLink} underline="none">
          <ListItem button>
            <ListItemIcon>
              <ReportingIcon />
            </ListItemIcon>
            <ListItemText primary="Reporting" className={classes.textEllipsis}/>
          </ListItem>
        </Link>
        {/* <Link component={ProjectViewerLink} underline="none">
          <ListItem button selected={itemsMenu.projects.viewer}>
            <ListItemIcon>
              <ProjectIcon/>
            </ListItemIcon>
            <ListItemText primary="Project Viewer" />
          </ListItem>
        </Link> */}
        {permissions.includes(CAN_VIEW_PROJECT) || is_superuser ? (
          <Link component={ProjectsLink} underline="none">
            <ListItem button selected={itemsMenu.projects.list}>
              <ListItemIcon>
                <ProjectIcon/>
              </ListItemIcon>
              <ListItemText primary="Project Setup" />
            </ListItem>
          </Link>
        ) : null}
        { permissions.includes(CAN_VIEW_SUBSTATION) || permissions.includes(CAN_VIEW_SET) || is_superuser ? (
          <div>
            <ListItem button onClick={()=>{this.changeStateOpen('setup', !itemsMenu.setup.open)}} className={classes.listItem}>
              <ListItemIcon>
                <SettingsApplications/>
              </ListItemIcon>
              <ListItemText primary={"Utility Setup - Admin"} className={classes.textEllipsis} />
              {itemsMenu.setup.open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={itemsMenu.setup.open}>
              <List component="div">
              { permissions.includes(CAN_VIEW_SUBSTATION) || is_superuser ? (
                <Link component={SubstationsLink} underline="none">
                  <ListItem button className={classes.subMenu} selected={itemsMenu.setup.substations}>
                    <ListItemIcon>
                      <BusinessIcon/>
                    </ListItemIcon>
                    <ListItemText primary="Substations" />
                  </ListItem>
                </Link>
              ):null }
              { permissions.includes(CAN_VIEW_SET) || is_superuser ? (
                <Link component={SetsLink} underline="none">
                  <ListItem button className={classes.subMenu} selected={itemsMenu.setup.sets}>
                    <ListItemIcon>
                      <FolderOpen/>
                    </ListItemIcon>
                    <ListItemText primary="Sets" />
                  </ListItem>
                </Link>
              ):null}
              <Link component={LinesLink} underline="none">
                  <ListItem button className={classes.subMenu} selected={itemsMenu.setup.lines}>
                    <ListItemIcon>
                      <Timeline/>
                    </ListItemIcon>
                    <ListItemText primary="Lines" />
                  </ListItem>
                </Link>
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
    permissions: state.auth.permissions,
    is_superuser: state.auth.is_superuser
  }
};

const mapDispatchToProps = { toggleItemMenu, setProjectForMap };

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(MainListItems);


