import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, Grid, TextField, Tabs, Tab, Button, InputAdornment, IconButton } from "@material-ui/core";
import { compose } from "recompose";
import { withRouter, Prompt } from "react-router-dom";
import { connect } from "react-redux";
import { withSnackbar } from 'notistack';
import Layout from '../../../components/Layout/index';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';
import SimpleBreadcrumbs from '../../../components/SimpleBreadcrumbs';
import TabContainer from "../../../components/TabContainer";
import Panel from "../../../components/Panel";
import Errors from "../../../components/Errors";
import { fetchRoles, fetchStates, setHandleForm, setLoading } from "../../../redux/actions/globalActions";
import { getUser, updateUser } from "../../../redux/actions/userActions";
import FormTextError from "../../../components/FormTextError";
import CalendarIcon from "@material-ui/icons/Today";
import { DatePicker } from 'material-ui-pickers';
import { datePickerFormatToParseDate } from '../../../common/Helpers/DateHelper';
import moment from 'moment';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

const breadcrumbs = [
  {name: 'Home', to: '/home'},
  {name: 'Users', to: '/users'},
  {name: 'Edit User', to: null},
];

class UserEdit extends React.Component {

  state = {
    tab: 0,
    form: {
      username: '',
      email: '',
      password: '',
      role_id: 1,
      is_active: true,
      first_name: '',
      middle_name: '',
      last_name: '',
      address_1: '',
      address_2: '',
      city: '',
      zip: '',
      phone: '',
      mobile: '',
      fax: '',
      birthdate: null,
      state_id: '',
    },
    user: {}
  };

  componentDidMount = async () => {
    await this.props.fetchRoles();
    await this.props.fetchStates();

    try {
      const userId = this.props.match.params.id;
      const response = await this.props.getUser(userId);

      if (response.status === 200) {
        this.loadForm(response.data);
      } else {
        this.props.history.push('/404');
      }
    } catch (error) {
      console.error(error);
    }
  };

  loadForm = (data) =>{
    const { form } = this.state;
    const { role, profile, ...user } = data;
    const { state } = profile;

    form.username = user.username;
    form.email = user.email;
    form.role_id = role ? role.id : '';
    form.is_active = user.is_active;
    form.first_name = profile.first_name || '';
    form.middle_name = profile.middle_name || '';
    form.last_name = profile.last_name || '';
    form.address_1 = profile.address_1 || '';
    form.address_2 = profile.address_2 || '';
    form.city = profile.city || '';
    form.zip = profile.zip || '';
    form.phone = profile.phone || '';
    form.mobile = profile.mobile || '';
    form.fax = profile.fax || '';
    form.birthdate = profile.birthdate && moment(profile.birthdate);
    form.state_id = state ? state.id : '';

    this.setState({ form });
  };

  handleChange = (event) => {
    const form = this.state.form;
    form[event.target.name] = event.target.value;

    this.setState({ form });
  };

  handleTab = (event, tab) => {
    this.setState({tab});
  };

  handleSubmit = async (values, formikActions) => {
    const { setSubmitting } = formikActions;
    this.props.setLoading(true);
    try {
      const userId = this.props.match.params.id;
      const { username, email, password, role_id, is_active, ...profile } = values;
      profile.birthdate= profile.birthdate?datePickerFormatToParseDate(profile.birthdate):null;
      const form = { username, email, password, role_id, is_active, profile };
      
      const response = await this.props.updateUser(userId, form);

      if (response.status === 200) {
        this.props.enqueueSnackbar('The user has been updated!', {variant: 'success'});
      } else {
        this.props.enqueueSnackbar('The request could not be processed!', {variant: 'error'});
      }
    } catch (error) {
      this.props.enqueueSnackbar(error.message, {variant: 'error'});
      console.error(error);
    }
    setSubmitting(false);
    this.props.setLoading(false);
  };

  render() {
    const { classes, errors, loading, us_states, roles, auth, user, handleForm, setHandleForm } = this.props;
    const { tab, form } = this.state;

    return (
      <Layout title="Edit User">

        <div className={classes.root}>
          <SimpleBreadcrumbs routes={breadcrumbs}/>
          <Formik
            onSubmit={this.handleSubmit}
            initialValues={{
              ...form
            }}
            enableReinitialize
            validationSchema={{
              username: Yup.string().required("Username is required"),
              email: Yup.string().email("Must be a valid mail").required("Email is required"),
              password: Yup.string(),
              role_id: Yup.mixed(),
              is_active: Yup.boolean(),
              first_name: Yup.string().required("First name is required"),
              middle_name: Yup.string(),
              last_name: Yup.string().required("Last Name is required"),
              address_1: Yup.string(),
              address_2: Yup.string(),
              city: Yup.string(),
              zip: Yup.string(),
              phone: Yup.string(),
              mobile: Yup.string(),
              fax: Yup.string(),
              birthdate: Yup.mixed(),
              state_id: Yup.mixed(),
            }}
          >
            {(props)=>{
              const {
                isSubmitting,
                values,
                touched,
                errors,
                handleChange,
                handleBlur,
                setFieldValue,
                dirty,
                isValid,
                handleSubmit
              } = props;
              if(handleForm !== dirty) setHandleForm(dirty);
              return (
                <Form >
                  <Prompt
                    when={dirty}
                    message="Are you sure you want to leave?, You will lose your changes"    
                  />
                  <Grid container spacing={16}>
                    <Grid item sm={12} md={6}>

                      <Panel>

                        <Grid container spacing={16}>
                          <Grid item xs>
                            <TextField
                              name="first_name"
                              value={values.first_name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={!!touched.first_name&&!!errors.first_name}
                              helperText={!!touched.first_name&&!!errors.first_name&&errors.first_name}
                              label="First Name"
                              fullWidth
                              margin="normal"
                              required
                            />
                          </Grid>
                          <Grid item xs>
                            <TextField
                              name="middle_name"
                              value={values.middle_name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={!!touched.middle_name&&!!errors.middle_name}
                              helperText={!!touched.middle_name&&!!errors.middle_name&&errors.middle_name}
                              label="Middle Name"
                              fullWidth
                              margin="normal"
                            />
                          </Grid>
                        </Grid>

                        <Grid container spacing={16}>
                          <Grid item xs>
                            <TextField
                              label="Last Name"
                              name="last_name"
                              value={values.last_name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={!!touched.last_name&&!!errors.last_name}
                              helperText={!!touched.last_name&&!!errors.last_name&&errors.last_name}
                              fullWidth
                              margin="normal"
                            />
                          </Grid>
                          <Grid item xs>
                            <TextField
                              label="Username"
                              name="username"
                              value={values.username}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={!!touched.username&&!!errors.username}
                              helperText={!!touched.username&&!!errors.username&&errors.username}
                              fullWidth
                              margin="normal"
                            />
                          </Grid>
                        </Grid>

                        <TextField
                          label="Email"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!touched.email&&!!errors.email}
                          helperText={!!touched.email&&!!errors.email&&errors.email}
                          fullWidth
                          margin="normal"
                          type="email"
                        />

                        <TextField
                          label="New Password"
                          name="password"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!touched.password&&!!errors.password}
                          helperText={!!touched.password&&!!errors.password&&errors.password}
                          fullWidth
                          margin="normal"
                        />

                        <Grid container spacing={16}>
                          <Grid item xs>
                            <TextField
                              label="Phone"
                              name="phone"
                              value={values.phone}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={!!touched.phone&&!!errors.phone}
                              helperText={!!touched.phone&&!!errors.phone&&errors.phone}
                              fullWidth
                              margin="normal"
                            />
                          </Grid>
                          <Grid item xs>
                            <TextField
                              label="Mobile"
                              name="mobile"
                              value={values.mobile}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={!!touched.mobile&&!!errors.mobile}
                              helperText={!!touched.mobile&&!!errors.mobile&&errors.mobile}
                              fullWidth
                              margin="normal"
                            />
                          </Grid>
                        </Grid>
                        
                        <DatePicker
                          name="birthdate"
                          label="Birthdate"
                          value={values.birthdate || null}
                          margin="normal"
                          format={"MM/DD/YYYY"}
                          onChange={(date) => {
                            setFieldValue("birthdate",date);
                          }}
                          onBlur={handleBlur}
                          fullWidth
                          animateYearScrolling
                          error={!!touched.birthdate&&!!errors.birthdate}
                          helperText={!!touched.birthdate&&!!errors.birthdate&&errors.birthdate}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="calendar"
                                >
                                  <CalendarIcon />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />

                        <Grid container spacing={16}>
                          
                          <Grid item xs>
                            <TextField
                              name="role_id"
                              select
                              label="Role"
                              value={values.role_id}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={!!touched.role_id&&!!errors.role_id}
                              helperText={!!touched.role_id&&!!errors.role_id&&errors.role_id}
                              margin="normal"
                              fullWidth
                            >
                              {
                                roles.map(role => {
                                  return <MenuItem key={role.id} value={role.id}>{role.label}</MenuItem>
                                })
                              }
                            </TextField>
                          </Grid>
                          <Grid item xs>
                            <TextField
                              name="is_active"
                              select
                              disabled={auth.id === user.id}
                              label="Status"
                              value={values.is_active}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={!!touched.is_active && !!errors.is_active}
                              helperText={!!touched.is_active && !!errors.is_active && errors.is_active}
                              margin="normal"
                              fullWidth
                            >
                              <MenuItem value={true}>Active</MenuItem>
                              <MenuItem value={false}>Inactive</MenuItem>
                            </TextField>    
                              
                          </Grid>
                        </Grid>

                      </Panel>
                    </Grid>

                    <Grid item sm={12} md={6}>
                      <Panel>
                        <Tabs value={tab} onChange={this.handleTab}>
                          <Tab label="Address" />
                        </Tabs>

                        {
                          tab === 0 &&
                          <TabContainer>
                            <TextField
                              name="address_1"
                              label="Address 1"
                              name="address_1"
                              value={values.address_1}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={!!touched.address_1&&!!errors.address_1}
                              helperText={!!touched.address_1&&!!errors.address_1&&errors.address_1}
                              fullWidth
                              margin="normal"
                            />

                            <TextField
                              name="address_2"
                              label="Address 2"
                              value={values.address_2}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={!!touched.address_2&&!!errors.address_2}
                              helperText={!!touched.address_2&&!!errors.address_2&&errors.address_2}
                              fullWidth
                              margin="normal"
                            />

                            <TextField
                              name="city"
                              label="City"
                              value={values.city}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={!!touched.city&&!!errors.city}
                              handleBlur={!!touched.city&&!!errors.city&&errors.city}
                              fullWidth
                              margin="normal"
                            />

                            <TextField
                              name="zip"
                              label="Zip"
                              value={values.zip}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={!!touched.zip&&!!errors.zip}
                              helperText={!!touched.zip&&!!errors.zip&&errors.zip}
                              fullWidth
                              margin="normal"
                            />

                            <TextField
                              name="state_id"
                              select
                              label="State"
                              value={values.state_id}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={!!touched.state_id && !!errors.state_id}
                              helperText={!!touched.state_id && !!errors.state_id && errors.state_id}
                              margin="normal"
                              fullWidth
                            >
                              {
                                us_states.map(state => {
                                  return <MenuItem key={state.id} value={state.id}>{state.name}</MenuItem>
                                })
                              }    
                            </TextField>
                          </TabContainer>
                            
                        }
                      </Panel>
                    </Grid>

                  </Grid>

                  <br/>

                  <Button
                    disabled={loading||isSubmitting||!dirty||!isValid}
                    onClick={(e)=>{handleSubmit(e)}}
                    variant="contained"
                    color="primary"
                    fullWidth
                  >Update User</Button>
                </Form>
              );
            }}
          </Formik>

        </div>
      </Layout>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    user: state.users.user,
    loading: state.global.loading,
    handleForm: state.global.handleForm,
    roles: state.global.roles,
    us_states: state.global.us_states,
    errors: new Errors(state.users.errors)
  }
};

const mapDispatchToProps = { fetchRoles, fetchStates, getUser, updateUser, setHandleForm, setLoading};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, {name: 'UserEdit'}),
  connect(mapStateToProps, mapDispatchToProps)
)(UserEdit);