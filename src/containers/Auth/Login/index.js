import React from 'react';
import { connect } from 'react-redux';
import { login } from '../../../redux/actions/authActions';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import {Link as RouterLink, Redirect} from 'react-router-dom';

import styles from './styles';
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import MySnackbarContent from '../../../components/MySnackbarContent';
import LinearLoading from '../../../components/LinearLoading';
import Link from "@material-ui/core/Link/Link";

class Login extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      isLogged: !! props.auth.token,
      openSnackbar: false,
      snackbarMessage: ''
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  submit = async (event) => {
    event.preventDefault();

    try {
      const { username, password } = this.state;
      const response = await this.props.login(username, password);

      if (response.status === 200) {
        this._isMounted && this.setState({ isLogged: true });
      } else {
        this._isMounted && this.setState({ openSnackbar: true, snackbarMessage: '¡Incorrect credentials!' });
      }
    } catch (error) {
      console.error(error);
      this._isMounted && this.setState({ openSnackbar: true, snackbarMessage: error.message });
    } finally {
      this._isMounted && this.setState({ password: '' });
    }
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleCloseSnackbar = () => {
    this.setState({ openSnackbar: false });
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    if (this.state.isLogged) {
      return <Redirect to="/home"/>
    }

    const { username, password, openSnackbar, snackbarMessage } = this.state;
    const { classes, loading } = this.props;

    return (
      <main className={classes.main}>

        <LinearLoading loading={loading}/>

        <Snackbar
          anchorOrigin={{vertical: 'top', horizontal: 'center'}}
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={this.handleCloseSnackbar}
        >
          <MySnackbarContent
            onClose={this.handleCloseSnackbar}
            variant="error"
            message={snackbarMessage}
          />
        </Snackbar>

        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">Login</Typography>
          <form className={classes.form} onSubmit={this.submit}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Username</InputLabel>
              <Input
                name="username"
                value={username}
                onChange={this.handleChange}
                id="email"
                autoComplete="email"
                autoFocus
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                name="password"
                value={password}
                onChange={this.handleChange}
                type="password" id="password"
                autoComplete="current-password"
              />
            </FormControl>

            <FormControl margin="normal">
              <Link component={RouterLink} to="/forgot-password" color="primary">
                Forgot password?
              </Link>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={loading}
            >
              Login
            </Button>
          </form>
        </Paper>
      </main>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    loading: state.global.loading
  }
};

const mapDispatchToProps = { login };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Login));