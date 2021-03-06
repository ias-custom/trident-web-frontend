import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { fetchRoles } from "../../../redux/actions/roleActions";
import { Link as RouterLink, withRouter } from "react-router-dom";
import { withSnackbar } from "notistack";
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
  withStyles
} from "@material-ui/core";
import { Edit, Delete } from "@material-ui/icons";
import {
  toggleItemMenu,
  selectedItemMenu
} from "../../../redux/actions/layoutActions";
import { deleteRole } from "../../../redux/actions/roleActions";
import Layout from "../../../components/Layout/index";
import SimpleBreadcrumbs from "../../../components/SimpleBreadcrumbs";
import Panel from "../../../components/Panel";
import styles from "./styles";
import {
  CAN_ADD_ROLE,
  CAN_CHANGE_ROLE,
  CAN_DELETE_ROLE
} from "../../../redux/permissions";
import TextEmpty from "../../../components/TextEmpty";
import { DialogDelete } from "../../../components";

const breadcrumbs = [
  { name: "Home", to: "/home" },
  { name: "Roles", to: null }
];

class RolesList extends React.Component {
  state = {
    search: "",
    open: false,
    roleId: ""
  };

  componentDidMount() {
    this.props.fetchRoles();
    const nameItem = "admin";
    const nameSubItem = "roles";
    const open = true;
    this.props.toggleItemMenu({ nameItem, open });
    this.props.selectedItemMenu({ nameItem, nameSubItem });
  }

  handleSearch = event => {
    this.setState({ search: event.target.value });
  };

  filter = (roles, keyword) => {
    if (keyword === "") return roles;

    const fields = ["name"];
    const regex = new RegExp(keyword, "i");

    return roles.filter(role => {
      const obj = { ...role };

      return (
        fields.filter(field => {
          return typeof obj[field] === "string" && obj[field].match(regex);
        }).length > 0
      );
    });
  };

  handleDelete = async () => {
    this.setState({ open: false });
    const response = await this.props.deleteRole(this.state.roleId);
    if (response.status === 200 || response.status === 204) {
      // SHOW NOTIFICACION SUCCCESS
      this.props.enqueueSnackbar("Role successfully removed!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    } else {
      this.props.enqueueSnackbar("The request could not be processed!", {
        variant: "error"
      });
    }
  };

  showModal(roleId) {
    this.setState({ open: true, roleId });
  }

  closeModal = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, roles, loading, is_superuser, permissions } = this.props;
    const canCreateRole = permissions.includes(CAN_ADD_ROLE);
    const canChangeRole = permissions.includes(CAN_CHANGE_ROLE);
    const canDeleteRole = permissions.includes(CAN_DELETE_ROLE);
    const { search, open } = this.state;
    console.log(canChangeRole)
    console.log(loading || !canChangeRole || !is_superuser)
    return (
      <Layout title="Roles">
        {() => (
          <div>
            <DialogDelete
              item="rol"
              open={open}
              closeModal={() => this.setState({ open: false })}
              remove={this.handleDelete}
            />
            <div className={classes.root}>
              <SimpleBreadcrumbs routes={breadcrumbs} classes={{root: classes.breadcrumbs}}/>

              <Panel>
                <div
                  className={
                    canCreateRole || is_superuser
                      ? classes.header
                      : classes.headerRight
                  }
                >
                  {canCreateRole || is_superuser ? (
                    <Link component={RouterLink} color="inherit" to="/roles/create">
                      <Button variant="outlined" color="primary">
                        Create Role
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
                      <TableCell style={{ width: "80%" }}>Name</TableCell>
                      <TableCell colSpan={1}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  { !loading &&
                    <TableBody>
                      {this.filter(roles, search).map(role => (
                        <TableRow key={role.id}>
                          <TableCell component="td" style={{ width: "80%" }}>
                            {role.name}
                          </TableCell>
                          <TableCell>
                            <div style={{ display: "flex" }}>
                              {canChangeRole || is_superuser ? (
                                <Link component={RouterLink} to={`/roles/${role.id}`}>
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
                                    loading || !canChangeRole || !is_superuser
                                  }
                                >
                                  <Edit />
                                </IconButton>
                              )}
                              <IconButton
                                aria-label="Delete"
                                className={classes.iconDelete}
                                disabled={
                                  loading || (!canDeleteRole && !is_superuser)
                                }
                                onClick={() => this.showModal(role.id)}
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
                <TextEmpty itemName="ROLES" empty={roles.length === 0}/>
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
    loading: state.global.loading,
    roles: state.roles.roles,
    permissions: state.auth.permissions,
    is_superuser: state.auth.is_superuser
  };
};

const mapDispatchToProps = {
  fetchRoles,
  deleteRole,
  toggleItemMenu,
  selectedItemMenu
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "RolesList" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(RolesList);
