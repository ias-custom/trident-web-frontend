import {Redirect, Route} from "react-router-dom";
import React from "react";
import { connect } from 'react-redux';

const  PrivateRoute = ({ component: Component, auth, allowedPermission,is_superuser, permissions, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
      ((is_superuser || permissions.includes(allowedPermission)) && auth.token) ?
        (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
    permissions: state.auth.permissions,
    is_superuser: state.auth.is_superuser
  }
};

export default connect(mapStateToProps, null)(PrivateRoute);