import React from 'react';
import {
  Avatar, Button, CssBaseline, FormControl, Input, InputLabel, Paper, Typography, withStyles
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { withSnackbar } from 'notistack';
import { Redirect } from 'react-router-dom';
import { forgotPassword } from '../../../redux/actions/authActions';
import { setLoading } from '../../../redux/actions/globalActions';
import styles from './styles';
import LinearLoading from '../../../components/LinearLoading';

class ForgotPassword extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
    };
  }

  submit = async (event) => {
    event.preventDefault();

    this.props.setLoading(true);

    try {
      const response = await this.props.forgotPassword(this.state.email);

      if (response.status === 200) {
        this.props.enqueueSnackbar('An email has been sent to reset your password.', {
          variant: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'center' }
        });
      } else {
        this.props.enqueueSnackbar('The email doesn\'t exist!', {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'center' }
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.setState({ email: '' });
      this.props.setLoading(false);
    }
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email } = this.state;
    const { classes, auth, loading } = this.props;

    if (auth.token) {
      return <Redirect to="/home"/>
    }

    return (
      <main className={classes.main}>
        <LinearLoading loading={loading} />

        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">Forgot your password?</Typography>
          <form className={classes.form} onSubmit={this.submit}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input
                name="email"
                value={email}
                onChange={this.handleChange}
                type="email"
                id="email"
                autoComplete="email"
                autoFocus
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={loading}
            >
              Send instructions
            </Button>
          </form>
        </Paper>
      </main>
    );
  }
}

ForgotPassword.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
    loading: state.global.loading
  }
};

const mapDispatchToProps = { forgotPassword, setLoading };

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: 'ForgotPassword'}),
  connect(mapStateToProps, mapDispatchToProps),
)(ForgotPassword);