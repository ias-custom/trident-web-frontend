import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles';
import { withStyles } from "@material-ui/core/styles";
import {
    FormControlLabel,
    Checkbox,
    Grid
  } from "@material-ui/core";

class CheckboxGroup extends React.Component {

  render() {
    const { roles } = this.props;
    let { permissionsId  } = this.props;

    return (
        <Grid container spacing={16}>
            {roles.map(role => (
              <Grid item xs={6} key={role.id}>
                <FormControlLabel
                  key={role.id}
                  control={
                    <Checkbox
                      checked={!!permissionsId.find(id => id === role.id)}
                      onClick={() => {
                        if (permissionsId.find(id => id === role.id)) {
                            this.props.onChange(role.id, false)
                        } else {
                            this.props.onChange(role.id, true)
                        }
                      }}
                    />
                  }
                  label={role.name}
                />
              </Grid>
              ))
            }
        </Grid>
    )
  }
};

CheckboxGroup.propTypes = {
  roles: PropTypes.array.isRequired,
  permissionsId: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};

export default withStyles(styles)(CheckboxGroup);
