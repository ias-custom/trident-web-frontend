import React from 'react';
import { Search } from '@material-ui/icons';
import { InputBase, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import styles from './styles';

const InputSearch= ({...props}) => {
  const { classes, value, ...rest } = props;

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <Search />
      </div>
      <InputBase
        placeholder="Search..."
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput
        }}
        value={value}
        onChange={(e) => props.onChange(e)}
        {...rest}
      />
    </div>
  )
};

InputSearch.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default withStyles(styles)(InputSearch);
