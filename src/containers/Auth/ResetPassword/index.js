import React from 'react';
import {
  Avatar, Button, CssBaseline, FormControl, Input, InputLabel, Typography, withStyles, Paper
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Redirect, withRouter } from 'react-router-dom';
import { LinearLoading, Errors, FormTextError } from '../../../components';
import { resetPassword } from '../../../redux/actions/authActions';
import { setLoading } from '../../../redux/actions/globalActions';
import { compose } from 'recompose';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import styles from './styles';

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      confirm_password: '',
      reset_token: props.match.params.token,
      errors: new Errors()
    };
  }

  submit = async (event) => {
    event.preventDefault();
    this.props.setLoading(true);
    this.setState({ errors: new Errors() });

    try {
      const { email, password, confirm_password, reset_token } = this.state;
      const { data, status } = await this.props.resetPassword({ email, password, confirm_password, reset_token });

      if (status === 200) {
        this.props.history.push('/login');
        this.props.enqueueSnackbar('The password has been changed, please login.', {
          variant: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'center' }
        });
      } else if (status === 422) {
        this.setState({ errors: new Errors(data) });
      } else {
        this.props.enqueueSnackbar('The url is not valid or has expired!', {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'center' }
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.setState({ password: '', confirm_password: '' });
      this.props.setLoading(false);
    }
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { password, confirm_password, email, errors } = this.state;
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

          <Typography component="h1" variant="h5">Reset password</Typography>

          <form className={classes.form} onSubmit={this.submit}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input
                name="email"
                value={email}
                onChange={this.handleChange}
                id="email"
                autoFocus
                type="email"
                required
              />
              <FormTextError errors={errors} name="email"/>
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                name="password"
                value={password}
                onChange={this.handleChange}
                type="password" id="password"
                required
              />
              <FormTextError errors={errors} name="password"/>
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="confirm-password">Confirm password</InputLabel>
              <Input
                name="confirm_password"
                value={confirm_password}
                onChange={this.handleChange}
                type="password"
                id="confirm-password"
                requied
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
              Reset password
            </Button>
          </form>
        </Paper>
      </main>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    loading: state.global.loading
  }
};

const mapDispatchToProps = { resetPassword, setLoading };

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: 'ResetPassword'}),
  connect(mapStateToProps, mapDispatchToProps),
)(ResetPassword);
