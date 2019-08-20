import React, { Component } from "react";
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/Auth/Login";
import ForgotPassword from './containers/Auth/ForgotPassword';
import ResetPassword from './containers/Auth/ResetPassword';

import Error404 from "./containers/Errors/Error404";

import UserList from './containers/Users/UserList'
import UserEdit from './containers/Users/UserEdit';
import UserCreate from './containers/Users/UserCreate';

import RolesList from './containers/Roles/RolesList'
import RoleCreate from './containers/Roles/RoleCreate'
import RoleEdit from "./containers/Roles/RoleEdit";

import CustomersList from "./containers/Customers/CustomersList";
import CustomerCreate from "./containers/Customers/CustomerCreate";

import PrivateRoute from './components/PrivateRoute';

import { refreshToken} from './redux/actions/authActions';


const REFRESH_INTERVAL = 600000; // 10 minutes

class App extends Component {
  interval = null;

  componentDidMount = () => {
    this.interval = setInterval(async () =>{
      if (this.props.auth.token !== null) {
        await this.props.refreshToken();
      }
    }, REFRESH_INTERVAL)

    window.onbeforeunload = () =>{
      if(this.props.handleForm)
      return 'Are you sure you want to leave?';
    };
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Redirect exact path="/" to="/login" />
          <Route exact path="/login" component={Login} />
          <Route exact path="/forgot-password" component={ForgotPassword} />
          <Route exact path="/reset-password/:token" component={ResetPassword} />

          <PrivateRoute exact path="/home" component={Home} />

          <PrivateRoute exact path="/users" component={UserList} />
          <PrivateRoute exact path="/users/create" component={UserCreate} />
          <PrivateRoute exact path="/users/:id" component={UserEdit} />

          <PrivateRoute exact path="/roles" component={RolesList}></PrivateRoute>
          <PrivateRoute exact path="/roles/create" component={RoleCreate}></PrivateRoute>
          <PrivateRoute exact path="/roles/:id" component={RoleEdit}></PrivateRoute>

          <PrivateRoute exact path="/customers" component={CustomersList}></PrivateRoute>
          <PrivateRoute exact path="/customers/create" component={CustomerCreate}></PrivateRoute>
          
          <Route exact path="/404" component={Error404} />
          <Route component={Error404} />
        </Switch>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    handleForm: state.global.handleForm,
  }
};




const mapDispatchToProps = { refreshToken };

export default connect(mapStateToProps, mapDispatchToProps)(App);
