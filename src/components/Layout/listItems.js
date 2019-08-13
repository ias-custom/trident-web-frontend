import React from 'react';
// import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ReportingIcon from '@material-ui/icons/Assessment';
import ProjectIcon from '@material-ui/icons/Work';
import RolesIcon from '@material-ui/icons/AssignmentInd';
import CustomersIcon from '@material-ui/icons/HowToReg';
import AssignmentIcon from '@material-ui/icons/Assignment';

import UserIcon from '@material-ui/icons/GroupOutlined';
import ProductIcon from '@material-ui/icons/Opacity';
import PatientIcon from '@material-ui/icons/Accessible';
import OrderIcon from '@material-ui/icons/ShoppingCartOutlined';
import ExpirationIcon from '@material-ui/icons/CalendarToday';
import CallCustomersIcon from '@material-ui/icons/CallOutlined';
import CheckEligibilityIcon from '@material-ui/icons/MobileFriendly';
import ShippingStatusIcon from '@material-ui/icons/LocalShippingOutlined';
import { Link as RouterLink } from 'react-router-dom'
import Link from '@material-ui/core/Link';
/*
import Collapse from "@material-ui/core/Collapse/Collapse";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
*/

const DashboardLink = props => <RouterLink to="/home" {...props} />;
const ReportingLink = props => <RouterLink to="/reports" {...props} />;
const ProjectLink = props => <RouterLink to="/projects" {...props} />;
const UsersLink = props => <RouterLink to="/users" {...props} />;
const RolesLink = props => <RouterLink to="/roles" {...props} />;
const CustomersLink = props => <RouterLink to="/customers" {...props} />;

export const mainListItems = (
  <div>
    <Link component={UsersLink}>
      <ListItem button>
        <ListItemIcon>
          <UserIcon />
        </ListItemIcon>
        <ListItemText primary="Admin Users" />
      </ListItem>
    </Link>
    <Link component={RolesLink}>
      <ListItem button>
        <ListItemIcon>
          <RolesIcon />
        </ListItemIcon>
        <ListItemText primary="Admin Roles" />
      </ListItem>
    </Link>

    <Link component={CustomersLink}>
      <ListItem button>
        <ListItemIcon>
          <CustomersIcon />
        </ListItemIcon>
        <ListItemText primary="Admin Customers" />
      </ListItem>
    </Link>
  </div>
);

export const secondaryListItems = (
      <div>
        <Link component={DashboardLink}>
          <ListItem button>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </Link>
        <Link component={ReportingLink}>
          <ListItem button>
            <ListItemIcon>
              <ReportingIcon />
            </ListItemIcon>
            <ListItemText primary="Reports" />
          </ListItem>
        </Link>
        <Link component={ProjectLink}>
          <ListItem button>
            <ListItemIcon>
              <ProjectIcon />
            </ListItemIcon>
            <ListItemText primary="Projects" />
          </ListItem>
        </Link>
      </div>
    );
