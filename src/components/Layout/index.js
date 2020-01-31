import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from "react-router-dom";
import { compose } from "recompose";
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
  Menu,
  MenuItem,
  Avatar,
  Grid
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import  MainListItems from './listItems';
import LinearLoading from "../LinearLoading";
import { logout } from '../../redux/actions/authActions';
import { setCustomerSelected } from '../../redux/actions/customerActions';
import styles from './styles';
import Select from '@material-ui/core/Select';

const Layout= ({...props}) => {
  const [open, setOpen] = useState(true)
  const [openLogout, setOpenLogout] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const { classes, title, loading, auth, customers, customerSelectedId } = props;

  function changeSelectCustomer(event) {
    props.setCustomerSelected(parseInt(event.target.value))
    localStorage.setItem("customerSelectedId", event.target.value)
    //this.props.history.push("/home")
    window.location.reload();
  }
  function handleDrawerOpen() {
    setOpen(true)
  };

  function handleDrawerClose(){
    setOpen(false)
  };


  function handleMenu(event) {
    setOpenLogout(true)
    setAnchorEl(event.currentTarget)
  };

  function handleCloseMenu() {
    setOpenLogout(false)
    setAnchorEl(null)
  };

  function logout() {
    props.logout();
  };
    
  if (auth.token === null) {
    return <Redirect to="/login" />
  }
  const logoCustomer = (customers.find( c => c.id === customerSelectedId)).thumbnail


  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={classNames(classes.appBar, open && classes.appBarShift)}
      >
        <LinearLoading loading={loading}/>

        <Toolbar disableGutters={!open} className={classes.toolbar}>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={handleDrawerOpen}
            className={classNames(
              classes.menuButton,
              open && classes.menuButtonHidden,
            )}
          >
            <MenuIcon />
          </IconButton>
          <Grid container className={classes.divRight}>
            <Grid item className={classes.divTitle}>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
              >
                {title || 'Dashboard'}
              </Typography>
            </Grid>
            <Grid item className={classes.divAvatar}>
              <img src={logoCustomer} alt="logoCustomer"/>
              <div></div>
            </Grid>
            <Grid item>
            { customers.length > 0 ? (
              <Select
                value={customerSelectedId}
                autoWidth={true}
                className={classes.selectCustomer}
                classes={{select: classes.divSelect, icon: classes.IconSelect }}
                onChange={changeSelectCustomer}
              > 
                {customers.map( ({id, name}) => (
                  <MenuItem value={id} key={id}>{name}</MenuItem>
                ))}
              </Select>
            ): null}
            <IconButton color="inherit" onClick={handleMenu}>
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
              open={openLogout}
              onClose={handleCloseMenu}
            >
              <MenuItem onClick={handleCloseMenu}>
                {auth.fullName}
              </MenuItem>
              <MenuItem onClick={logout}>Log Out</MenuItem>
            </Menu>
            </Grid>
            
          
          </Grid>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: classNames(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List><MainListItems/></List>
      </Drawer>
      <main className={classes.content}>

        <div className={classes.appBarSpacer} />
        {props.children(open)}
      </main>
    </div>
  );
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
    loading: state.global.loading,
    customers: state.customers.customers,
    customerSelectedId: state.customers.customerSelectedId
  }
};

const mapDispatchToProps = { logout, setCustomerSelected };

export default compose(
  withRouter,
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(Layout);
