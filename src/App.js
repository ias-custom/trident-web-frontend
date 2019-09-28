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
import CustomerEdit from "./containers/Customers/CustomerEdit";

import ProjectsList from "./containers/Projects/ProjectsList";
import ProjectEdit from "./containers/Projects/ProjectEdit";
import ProjectCreate from "./containers/Projects/ProjectCreate";

import StructureEdit from "./containers/Structures/StructureEdit";
import StructureCreate from "./containers/Structures/StructureCreate";

import SpamEdit from "./containers/Spams/SpamEdit";
import SpanCreate from "./containers/Spams/SpamCreate";

import MarkingCreate from "./containers/Spams/MarkingCreate";

import AccessCreate from "./containers/Spams/AccessCreate";

import PrivateRoute from './components/PrivateRoute';

import { refreshToken} from './redux/actions/authActions';

import {
  CAN_VIEW_USER,
  CAN_ADD_USER,
  CAN_CHANGE_USER,
  CAN_VIEW_ROLE,
  CAN_ADD_ROLE,
  CAN_CHANGE_ROLE,
  CAN_VIEW_PROJECT,
  CAN_ADD_PROJECT,
  CAN_CHANGE_PROJECT,
  CAN_VIEW_SUBSTATION,
  CAN_ADD_SUBSTATION,
  CAN_CHANGE_SUBSTATION,
  CAN_VIEW_SET,
  CAN_ADD_SET
} from './redux/permissions'
import SubstationsList from "./containers/Substations/SubstationsList";
import SubstationCreate from "./containers/Substations/SubstationCreate";
import SubstationEdit from "./containers/Substations/SubstationEdit";
import MapsView from "./containers/Projects/MapsView";
import SetList from "./containers/Sets/SetList";
import SetCreate from "./containers/Sets/SetCreate";

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

          <Route exact path="/home" component={Home} />

          <PrivateRoute exact path="/users" component={UserList} allowedPermission={CAN_VIEW_USER}/>
          <PrivateRoute exact path="/users/create" component={UserCreate} allowedPermission={CAN_ADD_USER}/>
          <PrivateRoute exact path="/users/:id" component={UserEdit} allowedPermission={CAN_CHANGE_USER}/>


          <PrivateRoute exact path="/roles" component={RolesList} allowedPermission={CAN_VIEW_ROLE}></PrivateRoute>
          <PrivateRoute exact path="/roles/create" component={RoleCreate} allowedPermission={CAN_ADD_ROLE}></PrivateRoute>
          <PrivateRoute exact path="/roles/:id" component={RoleEdit} allowedPermission={CAN_CHANGE_ROLE}></PrivateRoute>


          <PrivateRoute exact path="/customers" component={CustomersList} allowedPermission={null}></PrivateRoute>
          <PrivateRoute exact path="/customers/create" component={CustomerCreate} allowedPermission={null}></PrivateRoute>
          <PrivateRoute exact path="/customers/:id" component={CustomerEdit}></PrivateRoute>


          <PrivateRoute exact path="/projects" component={ProjectsList} allowedPermission={CAN_VIEW_PROJECT}></PrivateRoute>
          <PrivateRoute exact path="/projects/create" component={ProjectCreate} allowedPermission={CAN_ADD_PROJECT}></PrivateRoute>
          <PrivateRoute exact path="/projects/:projectId/spans/create" component={SpanCreate} allowedPermission={CAN_CHANGE_PROJECT}></PrivateRoute>
          <Route exact path="/projects/maps-view" component={MapsView} />
          <PrivateRoute exact path="/projects/:id" component={ProjectEdit} allowedPermission={CAN_CHANGE_PROJECT}></PrivateRoute>

          <PrivateRoute exact path="/projects/:projectId/structures/create" component={StructureCreate} allowedPermission={CAN_CHANGE_PROJECT}></PrivateRoute>
          <PrivateRoute exact path="/projects/:projectId/structures/:id" component={StructureEdit} allowedPermission={CAN_CHANGE_PROJECT}></PrivateRoute>

          <PrivateRoute exact path="/projects/:projectId/spans/:id" component={SpamEdit} allowedPermission={CAN_CHANGE_PROJECT}></PrivateRoute>
          <PrivateRoute exact path="/projects/:projectId/markings/create" component={MarkingCreate} allowedPermission={CAN_CHANGE_PROJECT}></PrivateRoute>
          <PrivateRoute exact path="/projects/:projectId/access/create" component={AccessCreate} allowedPermission={CAN_CHANGE_PROJECT}></PrivateRoute>

          <PrivateRoute exact path="/substations" component={SubstationsList} allowedPermission={CAN_VIEW_SUBSTATION}/>
          <PrivateRoute exact path="/substations/create" component={SubstationCreate} allowedPermission={CAN_ADD_SUBSTATION}/>
          <PrivateRoute exact path="/substations/:id" component={SubstationEdit} allowedPermission={CAN_CHANGE_SUBSTATION}/>

          <PrivateRoute exact path="/sets" component={SetList} allowedPermission={CAN_VIEW_SET}/>
          <PrivateRoute exact path="/sets/create" component={SetCreate} allowedPermission={CAN_ADD_SET}/>
          
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
