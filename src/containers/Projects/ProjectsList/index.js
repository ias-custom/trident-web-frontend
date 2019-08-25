import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { fetchProjects } from "../../../redux/actions/projectActions";
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
import { deleteProject } from "../../../redux/actions/projectActions";
import Layout from "../../../components/Layout/index";
import SimpleBreadcrumbs from "../../../components/SimpleBreadcrumbs";
import Panel from "../../../components/Panel";
import styles from "./styles";
import {
  CAN_ADD_PROJECT,
  CAN_CHANGE_PROJECT,
  CAN_DELETE_PROJECT
} from "../../../redux/permissions";

const breadcrumbs = [
  { name: "Home", to: "/home" },
  { name: "Projects", to: null }
];

class ProjectsList extends React.Component {
  state = {
    search: "",
    open: false,
    projectId: ""
  };

  componentDidMount() {
    this.props.fetchProjects();
    const nameItem = "projects";
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
    const response = await this.props.deleteProject(this.state.projectId);
    if (response.status === 200 || response.status === 204) {
      // SHOW NOTIFICACION SUCCCESS
      this.props.enqueueSnackbar("Project successfully removed!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    }
  };

  showModal(projectId) {
    this.setState({ open: true, projectId });
  }

  closeModal = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, loading, is_superuser, permissions, projects } = this.props;
    const canCreateProject = permissions.includes(CAN_ADD_PROJECT);
    const canChangeProject = permissions.includes(CAN_CHANGE_PROJECT);
    const canDeleteProject = permissions.includes(CAN_DELETE_PROJECT);
    const { search, open } = this.state;

    return (
      <Layout title="Projects">
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
                canCreateProject || is_superuser
                  ? classes.header
                  : classes.headerRight
              }
            >
              {canCreateProject || is_superuser ? (
                <Link component={RouterLink} color="inherit" to="/projects/create">
                  <Button variant="outlined" color="primary">
                    Create Project
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
                {this.filter(projects, search).map(project => (
                  <TableRow key={project.id}>
                    <TableCell component="td" style={{ width: "80%" }}>
                      <Link component={RouterLink} to={`/detail-project/${project.id}`}>{project.name}</Link>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: "flex" }}>
                        {canChangeProject || is_superuser ? (
                          <Link component={RouterLink} to={`/projects/${project.id}`}>
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
                              loading || !canChangeProject || !is_superuser
                            }
                          >
                            <Edit />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="Delete"
                          className={classes.iconDelete}
                          disabled={
                            loading || (!canDeleteProject && !is_superuser)
                          }
                          onClick={() => this.showModal(project.id)}
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
    projects: state.projects.projects,
    permissions: state.auth.permissions,
    is_superuser: state.auth.is_superuser
  };
};

const mapDispatchToProps = {
  fetchProjects,
  deleteProject,
  toggleItemMenu,
  selectedItemMenu
};

export default compose(
  withRouter,
  withStyles(styles, { name: "ProjectsList" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ProjectsList);
