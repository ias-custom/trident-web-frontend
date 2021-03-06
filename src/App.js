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
  CAN_ADD_SET,
  CAN_CHANGE_SET
} from './redux/permissions'
import SubstationsList from "./containers/Substations/SubstationsList";
import SubstationCreate from "./containers/Substations/SubstationCreate";
import SubstationEdit from "./containers/Substations/SubstationEdit";
import SetList from "./containers/Sets/SetList";
import SetCreate from "./containers/Sets/SetCreate";
import SetEdit from "./containers/Sets/SetEdit";
import InteractionCreate from "./containers/Interactions/InteractionCreate";
import InteractionEdit from "./containers/Interactions/InteractionEdit";
import MarkingCreate from "./containers/Markings/MarkingCreate";
import MarkingEdit from "./containers/Markings/MarkingEdit";
import AccessCreate from "./containers/Access/AccessCreate";
import AccessEdit from "./containers/Access/AccessEdit";
import LinesList from "./containers/Lines/LinesList";
import LineCreate from "./containers/Lines/LineCreate";
import LineEdit from "./containers/Lines/LineEdit";
import StructureLineCreate from "./containers/LineStructures/StructureLineCreate";
import Dashboard from "./containers/Dashboard";
import ProjectMap from "./containers/ProjectMap";
import StructureLineEdit from "./containers/LineStructures/StructureLineEdit";

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

          <PrivateRoute exact path="/projects/dashboard" component={Dashboard} allowedPermission={CAN_CHANGE_PROJECT}></PrivateRoute>
          <PrivateRoute exact path="/projects/:id/map" component={ProjectMap} allowedPermission={CAN_CHANGE_PROJECT}></PrivateRoute>
          <PrivateRoute exact path="/projects" component={ProjectsList} allowedPermission={CAN_VIEW_PROJECT}></PrivateRoute>
          <PrivateRoute exact path="/projects/create" component={ProjectCreate} allowedPermission={CAN_ADD_PROJECT}></PrivateRoute>
          <PrivateRoute exact path="/projects/:projectId/spans/create" component={SpanCreate} allowedPermission={CAN_CHANGE_PROJECT}></PrivateRoute>
          {/* <Route exact path="/projects/maps-view" component={MapsView} /> */}
          <PrivateRoute exact path="/projects/:id" component={ProjectEdit} allowedPermission={CAN_CHANGE_PROJECT}></PrivateRoute>

          <PrivateRoute exact path="/projects/:projectId/structures/create" component={StructureCreate} allowedPermission={CAN_CHANGE_PROJECT}></PrivateRoute>
          <PrivateRoute exact path="/projects/:projectId/structures/:id" component={StructureEdit} allowedPermission={CAN_CHANGE_PROJECT}></PrivateRoute>

          <PrivateRoute exact path="/projects/:projectId/spans/:id" component={SpamEdit} allowedPermission={CAN_CHANGE_PROJECT}></PrivateRoute>
          <PrivateRoute exact path="/projects/:projectId/crossings/create" component={MarkingCreate} allowedPermission={CAN_CHANGE_PROJECT}></PrivateRoute>
          <PrivateRoute exact path="/projects/:projectId/crossings/:markingId" component={MarkingEdit} allowedPermission={CAN_CHANGE_PROJECT}></PrivateRoute>
          <PrivateRoute exact path="/projects/:projectId/crossings/create" component={MarkingCreate} allowedPermission={CAN_CHANGE_PROJECT}></PrivateRoute>
          <PrivateRoute exact path="/projects/:projectId/access/create" component={AccessCreate} allowedPermission={CAN_CHANGE_PROJECT}></PrivateRoute>
          <PrivateRoute exact path="/projects/:projectId/access/:accessId" component={AccessEdit} allowedPermission={CAN_CHANGE_PROJECT}></PrivateRoute>
          <PrivateRoute exact path="/projects/:projectId/interactions/create" component={InteractionCreate} allowedPermission={CAN_CHANGE_PROJECT}></PrivateRoute>

          <PrivateRoute exact path="/projects/:projectId/interactions/:interactionId" component={InteractionEdit} allowedPermission={CAN_CHANGE_PROJECT}></PrivateRoute>
          

          <PrivateRoute exact path="/substations" component={SubstationsList} allowedPermission={CAN_VIEW_SUBSTATION}/>
          <PrivateRoute exact path="/substations/create" component={SubstationCreate} allowedPermission={CAN_ADD_SUBSTATION}/>
          <PrivateRoute exact path="/substations/:id" component={SubstationEdit} allowedPermission={CAN_CHANGE_SUBSTATION}/>

          <PrivateRoute exact path="/sets" component={SetList} allowedPermission={CAN_VIEW_SET}/>
          <PrivateRoute exact path="/sets/create" component={SetCreate} allowedPermission={CAN_ADD_SET}/>
          <PrivateRoute exact path="/sets/:id" component={SetEdit} allowedPermission={CAN_CHANGE_SET}/>
          <Route exact path="/lines" component={LinesList} />
          <Route exact path="/lines/create" component={LineCreate} />
          <Route exact path="/lines/:id" component={LineEdit} />
          <Route exact path="/lines/:lineId/structure/create" component={StructureLineCreate} />
          <Route exact path="/lines/:lineId/structures/:structureId" component={StructureLineEdit} />
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
