import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import {
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { mainListItems } from './listItems';
import LinearLoading from "../LinearLoading";
import { logout } from '../../redux/actions/authActions';
import styles from './styles';

class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true,
      anchorEl: null
    };
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };


  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleCloseMenu = () => {
    this.setState({ anchorEl: null });
  };

  logout = () => {
    this.props.logout();
    this.setState({ redirect: true });
  };

  handleCloseSnackbar = () => {
    this.setState({ openSnackbar: false });
  };

  render() {
    const { classes, title, loading, auth } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    if (auth.token === null) {
      return <Redirect to="/login" />
    }

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="absolute"
          className={classNames(classes.appBar, this.state.open && classes.appBarShift)}
        >
          <LinearLoading loading={loading}/>

          <Toolbar disableGutters={!this.state.open} className={classes.toolbar}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(
                classes.menuButton,
                this.state.open && classes.menuButtonHidden,
              )}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              {title || 'Dashboard'}
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit" onClick={this.handleMenu}>
              <Avatar>{auth.avatar}</Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={this.handleCloseMenu}
            >
              <MenuItem onClick={this.handleCloseMenu}>
                {auth.fullName}
              </MenuItem>
              <MenuItem onClick={this.logout}>Log Out</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
          }}
          open={this.state.open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>{mainListItems}</List>
          {/*<Divider />*/}
          {/*<List>{secondaryListItems}</List>*/}
        </Drawer>
        <main className={classes.content}>

          <div className={classes.appBarSpacer} />
          {this.props.children}
        </main>
      </div>
    );
  }
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  title: PropTypes.string
};

Layout.defaultProps = {
  loading: false
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    loading: state.global.loading
  }
};

const mapDispatchToProps = { logout };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Layout));