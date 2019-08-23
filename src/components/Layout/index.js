import React from 'react';
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
import  SecondaryListItems from './secondaryItems';
import LinearLoading from "../LinearLoading";
import { logout } from '../../redux/actions/authActions';
import { setCustomerSelected } from '../../redux/actions/globalActions';
import styles from './styles';
import Select from '@material-ui/core/Select';

class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: true,
      anchorEl: null,
    };
  }

  componentDidMount () {
  }

  changeSelectCustomer = (event) => {
    this.props.setCustomerSelected(parseInt(event.target.value))
    localStorage.setItem("customerSelectedId", event.target.value)
    this.props.history.push("/home")
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
    const { classes, title, loading, auth, customers, customerSelectedId } = this.props;
    const logoCustomer = (customers.find( c => c.id === customerSelectedId)).thumbnail
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
                  onChange={this.changeSelectCustomer}
                > 
                  {customers.map( ({id, name}) => (
                    <MenuItem value={id} key={id}>{name}</MenuItem>
                  ))}
                </Select>
              ): null}
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
              </Grid>
              
            
            </Grid>
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
          <List><MainListItems/></List>
          <Divider />
          <List><SecondaryListItems/></List>
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
    loading: state.global.loading,
    customers: state.global.customers,
    customerSelectedId: state.global.customerSelectedId
  }
};

const mapDispatchToProps = { logout, setCustomerSelected };

export default compose(
  withRouter,
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(Layout);
