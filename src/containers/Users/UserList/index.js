import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { getUsers, deleteUser } from "../../../redux/actions/userActions";
import {
  toggleItemMenu,
  selectedItemMenu
} from "../../../redux/actions/layoutActions";
import { Link as RouterLink, withRouter } from "react-router-dom";
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
} from "@material-ui/core";
import { Edit, Delete } from "@material-ui/icons";
import Layout from "../../../components/Layout/index";
import SimpleBreadcrumbs from "../../../components/SimpleBreadcrumbs";
import Panel from "../../../components/Panel";
import styles from "./styles";

import { withSnackbar } from "notistack";
import {
  CAN_ADD_USER,
  CAN_CHANGE_USER,
  CAN_DELETE_USER
} from "../../../redux/permissions";
import { TextEmpty, DialogDelete } from "../../../components";

const breadcrumbs = [
  { name: "Home", to: "/home" },
  { name: "Users", to: null }
];

class UserList extends React.Component {
  state = {
    search: "",
    open: false,
    userId: null
  };

  componentDidMount() {
    const nameItem = "admin";
    const nameSubItem = "users";
    const open = true;
    this.props.toggleItemMenu({ nameItem, open });
    this.props.selectedItemMenu({ nameItem, nameSubItem });
    this.props.getUsers();
  }

  handleSearch = event => {
    this.setState({ search: event.target.value });
  };

  showModal(userId) {
    this.setState({ open: true, userId });
  }

  closeModal = () => {
    this.setState({ open: false });
  };
  filter = (users, keyword) => {
    if (keyword === "") return users;

    const fields = ["first_name", "last_name", "email", "username", "roles"];
    const regex = new RegExp(keyword, "i");

    return users.filter(user => {
      const obj = { ...user };

      return (
        fields.filter(field => {
          if (field !== "roles") {
            return typeof obj[field] === "string" && obj[field].match(regex)
          }
          return obj[field].length > 0 && obj[field][0].name.match(regex)
        }).length > 0
      );
    });
  };

  handleDelete = async () => {
    this.setState({ open: false });
    if (this.props.auth.id !== this.state.userId) {
      const response = await this.props.deleteUser(this.state.userId);
      if (response.status === 200 || response.status === 204) {
        // SHOW NOTIFICACION SUCCCESS
        this.props.enqueueSnackbar("¡User successfully removed!", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "center" }
        });
      }
    }
  };

  render() {
    const {
      classes,
      users,
      loading,
      auth,
      is_superuser,
      permissions
    } = this.props;
    const canCreateUser = permissions.includes(CAN_ADD_USER);
    const canChangeUser = permissions.includes(CAN_CHANGE_USER);
    const canDeleteUser = permissions.includes(CAN_DELETE_USER);
    const { search, open } = this.state;

    return (
      <Layout title="Users">
        {() => (
          <div>
            <DialogDelete
              item="user"
              open={open}
              closeModal={() => this.setState({ open: false })}
              remove={this.handleDelete}
            />
            <div className={classes.root}>
              <SimpleBreadcrumbs routes={breadcrumbs} classes={{root: classes.breadcrumbs}}/>

              <Panel>
                <div
                  className={
                    canCreateUser || is_superuser
                      ? classes.header
                      : classes.headerRight
                  }
                >
                  {canCreateUser || is_superuser ? (
                    <Link component={RouterLink} color="inherit" to="/users/create">
                      <Button variant="outlined" color="primary">
                        Create User
                      </Button>
                    </Link>
                  ) : null}
                  <Input
                    style={{ width: 300 }}
                    defaultValue=""
                    className={classes.search}
                    inputProps={{
                      placeholder: "Search...",
                      onChange: this.handleSearch
                    }}
                  />
                </div>

                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell align="left">Email</TableCell>
                      <TableCell align="left">Username</TableCell>
                      <TableCell align="left">Status</TableCell>
                      <TableCell align="left">Role</TableCell>
                      <TableCell align="left">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  {!loading &&
                    <TableBody>
                      {this.filter(users, search).map(user => (
                        <TableRow key={user.id}>
                          <TableCell component="th" scope="row">
                            {user.first_name || " "} {user.middle_name || " "}{" "}
                            {user.last_name || ""}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>
                            {user.is_active ? (
                              <Typography color="primary">Active</Typography>
                            ) : (
                              <Typography color="secondary">Inactive</Typography>
                            )}
                          </TableCell>
                          <TableCell>{user.roles.length > 0 ? user.roles[0].name : "-"}</TableCell>
                          <TableCell align="center">
                            <div style={{ display: "flex" }}>
                              {canChangeUser || is_superuser ? (
                                <Link component={RouterLink} to={`/users/${user.id}`}>
                                  <IconButton
                                    aria-label="Edit"
                                    color="primary"
                                    disabled={loading}
                                  >
                                    <Edit />
                                  </IconButton>
                                </Link>
                              ) : (
                                <IconButton
                                  aria-label="Edit"
                                  color="primary"
                                  disabled={
                                    loading || !canChangeUser || !is_superuser
                                  }
                                >
                                  <Edit />
                                </IconButton>
                              )}
                              <IconButton
                                aria-label="Edit"
                                className={classes.iconDelete}
                                disabled={
                                  auth.id === user.id ||
                                  loading ||
                                  (!canDeleteUser && !is_superuser)
                                }
                                onClick={() => this.showModal(user.id)}
                              >
                                <Delete />
                              </IconButton>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  }
                </Table>
                <TextEmpty itemName="USERS" empty={users.length === 0}/>
              </Panel>
            </div>
          </div>
        )}
        
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    loading: state.global.loading,
    users: state.users.list,
    permissions: state.auth.permissions,
    is_superuser: state.auth.is_superuser
  };
};

const mapDispatchToProps = {
  getUsers,
  deleteUser,
  toggleItemMenu,
  selectedItemMenu
};

export default compose(
  withRouter,
  withStyles(styles, { name: "UserList" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withSnackbar
)(UserList);
