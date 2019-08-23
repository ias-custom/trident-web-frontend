import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles';
import { withStyles } from "@material-ui/core/styles";
import {
    FormControlLabel,
    Checkbox,
    Switch,
    Grid
  } from "@material-ui/core";
import { 
  CAN_ADD_USER, 
  CAN_VIEW_USER ,
  CAN_CHANGE_USER,
  CAN_DELETE_USER,
  CAN_ADD_ROLE,
  CAN_VIEW_ROLE,
  CAN_CHANGE_ROLE,
  CAN_DELETE_ROLE
} from '../../redux/permissions';

class CheckboxGroup extends React.Component {

  havePermissions (permissions) {
    const codenames = permissions.map( ({codename}) => codename)
    return codenames.length === (this.props.permissionsId.filter( id => (codenames.includes(id)))).length
  }
  render() {
    let { permissionsId  } = this.props;
    const roles = [
      {
        title: "All module user",
        permissions: [
          {
            title: "User list",
            codename: CAN_VIEW_USER
          }, {
            title: "User create",
            codename: CAN_ADD_USER
          }, {
            title: "User edit",
            codename: CAN_CHANGE_USER
          }, {
            title: "User delete",
            codename: CAN_DELETE_USER
          }
        ]
      },
      {
        title: "All module role",
        permissions: [
          {
            title: "Role list",
            codename: CAN_VIEW_ROLE
          }, {
            title: "Role create",
            codename: CAN_ADD_ROLE
          }, {
            title: "Role edit",
            codename: CAN_CHANGE_ROLE
          }, {
            title: "Role delete",
            codename: CAN_DELETE_ROLE
          }
        ]
      }
    ]
    return (
        <Grid container spacing={16}>
            {roles.map(role => (
              <Grid item xs={6} key={role.title}>
                <FormControlLabel
                  control={
                    <Switch checked={this.havePermissions(role.permissions)} onChange={ () => {
                      if (this.havePermissions(role.permissions)) {
                          this.props.onChange(role.permissions.map( ({codename}) => codename), false)
                      } else {
                          this.props.onChange(role.permissions.map( ({codename}) => codename), true)
                      }
                    }} />
                  }
                  label={role.title}
                />
                {role.permissions.map( ({title, codename}) => (
                  <Grid item xs={12} key={title}>
                    <FormControlLabel
                      key={codename}
                      control={
                        <Checkbox
                          checked={!!permissionsId.find(id => id === codename)}
                          onClick={() => {
                            if (permissionsId.find(id => id === codename)) {
                                this.props.onChange([codename], false)
                            } else {
                                this.props.onChange([codename], true)
                            }
                          }}
                        />
                      }
                      label={title}
                    />
                  </Grid>
                ))}
              </Grid>
            ))
            }
        </Grid>
    )
  }
};

CheckboxGroup.propTypes = {
  permissionsId: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};

export default withStyles(styles)(CheckboxGroup);
