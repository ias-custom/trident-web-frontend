import React from 'react';
import PropTypes from 'prop-types';
import { FormHelperText } from "@material-ui/core";

const FormTextError = ({ errors, name }) => {
  if (errors.has(name)) {
    return <FormHelperText error>{errors.first(name)}</FormHelperText>
  }

  return null;
};

FormTextError.propTypes = {
  errors: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
};

export default FormTextError;
