import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles';
import { withStyles } from "@material-ui/core/styles";
import {
    FormControlLabel,
    Checkbox,
    Switch,
    Grid,
    Divider
  } from "@material-ui/core";
import { 
  CAN_ADD_USER, 
  CAN_VIEW_USER ,
  CAN_CHANGE_USER,
  CAN_DELETE_USER,
  CAN_ADD_ROLE,
  CAN_VIEW_ROLE,
  CAN_CHANGE_ROLE,
  CAN_DELETE_ROLE,
  CAN_ADD_PROJECT,
  CAN_CHANGE_PROJECT,
  CAN_VIEW_PROJECT,
  CAN_DELETE_PROJECT,
  CAN_VIEW_SUBSTATION,
  CAN_ADD_SUBSTATION,
  CAN_CHANGE_SUBSTATION,
  CAN_DELETE_SUBSTATION,
  CAN_VIEW_SET,
  CAN_ADD_SET,
  CAN_CHANGE_SET,
  CAN_DELETE_SET
} from '../../redux/permissions';

class CheckboxGroup extends React.Component {

  havePermissions (permissions) {
    const codenames = permissions.map( ({codename}) => codename)
    return codenames.length === (this.props.permissionsId.filter( id => (codenames.includes(id)))).length
  }
  render() {
    let { permissionsId, classes  } = this.props;
    console.log(permissionsId)
    const roles = [
      {
        title: "ALL MODULE USERS",
        permissions: [
          {
            title: "Users list",
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
        title: "ALL MODULE ROLES",
        permissions: [
          {
            title: "Roles list",
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
      },
      {
        title: "ALL MODULE PROJECTS",
        permissions: [
          {
            title: "Projects list",
            codename: CAN_VIEW_PROJECT
          }, {
            title: "Project create",
            codename: CAN_ADD_PROJECT
          }, {
            title: "Project edit",
            codename: CAN_CHANGE_PROJECT
          }, {
            title: "Project delete",
            codename: CAN_DELETE_PROJECT
          }
        ]
      },
      {
        title: "ALL MODULE SUBSTATIONS",
        permissions: [
          {
            title: "Substations list",
            codename: CAN_VIEW_SUBSTATION
          }, {
            title: "Substation create",
            codename: CAN_ADD_SUBSTATION
          }, {
            title: "Substation edit",
            codename: CAN_CHANGE_SUBSTATION
          }, {
            title: "Substation delete",
            codename: CAN_DELETE_SUBSTATION
          }
        ]
      },
      {
        title: "ALL MODULE SETS",
        permissions: [
          {
            title: "Sets list",
            codename: CAN_VIEW_SET
          }, {
            title: "Set create",
            codename: CAN_ADD_SET
          }, {
            title: "Set edit",
            codename: CAN_CHANGE_SET
          }, {
            title: "Set delete",
            codename: CAN_DELETE_SET
          }
        ]
      },
    ]
    return (
        <Grid container spacing={16}>
            {roles.map((role, index) => (
              <Grid item container xs={12} key={role.title}>
                <Divider style={{'display': index === 0 ? 'none': 'block'}} className={classes.divider}></Divider>
                <Grid item xs={12}>
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
                </Grid>
                {role.permissions.map( ({title, codename}) => (
                  <Grid item xs={6} key={title}>
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
