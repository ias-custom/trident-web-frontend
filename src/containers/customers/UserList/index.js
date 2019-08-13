import React from 'react';
import { connect } from 'react-redux';
import { compose } from "recompose";
import { getUsers, deleteUser } from '../../../redux/actions/userActions';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Input,
  IconButton,
  Link,
  Typography,
  withStyles
} from '@material-ui/core';
import { Edit, Delete } from '@material-ui/icons';
import Layout from '../../../components/Layout/index';
import SimpleBreadcrumbs from '../../../components/SimpleBreadcrumbs';
import Panel from '../../../components/Panel';
import styles from './styles';


const breadcrumbs = [
  {name: 'Home', to: '/home'},
  {name: 'Users', to: null},
];

class UserList extends React.Component {

  state = {
    search: ''
  };

  componentDidMount() {
    this.props.getUsers();
  }

  handleSearch = (event) => {
    this.setState({ search: event.target.value });
  };

  filter = (users, keyword) => {
    if (keyword === '') return users;

    const fields = ['first_name', 'last_name', 'middle_name', 'email', 'username'];
    const regex = new RegExp(keyword, 'i');

    return users.filter(user => {
      const obj = {...user};

      return fields.filter(field => {
        return typeof obj[field] === 'string' && obj[field].match(regex);
      }).length > 0;
    });
  };

  handleDelete = (id) => {
    if (this.props.auth.id !== id) {
      this.props.deleteUser(id);
    }
  };


  render() {
    const { classes, users, loading, auth } = this.props;
    const { search } = this.state;

    return (
      <Layout title="Users">
        <div className={classes.root}>
          <SimpleBreadcrumbs routes={breadcrumbs} />

          <Panel>

            <div className={classes.header}>
              <Link component={RouterLink} color="inherit" to="/users/create">
                <Button variant="outlined" color="primary">Create User</Button>
              </Link>

              <Input
                style={{width: 300}}
                defaultValue=""
                className={classes.search}
                inputProps={{
                  placeholder: 'Search...',
                  onChange: this.handleSearch
                }}
              />
            </div>


            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Email</TableCell>
                  <TableCell align="right">Username</TableCell>
                  <TableCell align="right">Status</TableCell>
                  <TableCell align="right">Role</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.filter(users, search).map((user) => (
                  <TableRow key={user.id}>
                    <TableCell component="th" scope="row">
                      {user.first_name || ' '} {user.middle_name || ' '} {user.last_name || ''}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell >
                      {
                        user.is_active ?
                        <Typography color="primary">Active</Typography> :
                        <Typography color="secondary">Inactive</Typography>
                      }
                    </TableCell>
                    <TableCell>{user.role ? user.role.label : '-'}</TableCell>
                    <TableCell align="center">
                      <div style={{display: 'flex'}}>
                        <Link component={RouterLink} to={`/users/${user.id}`}>
                          <IconButton aria-label="Edit" color="primary" disabled={loading}>
                            <Edit />
                          </IconButton>
                        </Link>
                        <IconButton aria-label="Edit" color="secondary" disabled={auth.id === user.id || loading}
                                    onClick={() => this.handleDelete(user.id)}
                        >
                          <Delete/>
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Panel>
        </div>
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    loading: state.global.loading,
    users: state.users.list
  }
};

const mapDispatchToProps = { getUsers, deleteUser };

export default compose(
  withRouter,
  withStyles(styles, {name: 'UserList'}),
  connect(mapStateToProps, mapDispatchToProps)
)(UserList);
