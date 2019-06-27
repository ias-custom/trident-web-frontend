import React from 'react';
// import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
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
const UsersLink = props => <RouterLink to="/users" {...props} />;


export const mainListItems = (
  <div>
    <Link component={DashboardLink}>
      <ListItem button>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
    </Link>
    <Link component={UsersLink}>
      <ListItem button>
        <ListItemIcon>
          <UserIcon />
        </ListItemIcon>
        <ListItemText primary="Users" />
      </ListItem>
    </Link>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItem>
  </div>
);
