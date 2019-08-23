import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { fetchRoles } from "../../../redux/actions/globalActions";
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
  withStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
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
    const nameItem = "roles";
    const nameSubItem = "list";
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

    return (
      <Layout title="Roles">
        <Dialog
          open={open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onBackdropClick={this.closeModal}
          onEscapeKeyDown={this.closeModal}
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure you want to delete?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              If you delete the role it will be permanently.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              className={classes.buttonCancel}
              onClick={this.closeModal}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              color="primary"
              className={classes.buttonAccept}
              onClick={this.handleDelete}
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>
        <div className={classes.root}>
          <SimpleBreadcrumbs routes={breadcrumbs} />

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
            </Table>
          </Panel>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.global.loading,
    roles: state.global.roles,
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
  withStyles(styles, { name: "RolesList" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(RolesList);
