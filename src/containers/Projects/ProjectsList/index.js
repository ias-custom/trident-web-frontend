import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { fetchProjects } from "../../../redux/actions/projectActions";
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
import TextEmpty from "../../../components/TextEmpty";
import { DialogDelete } from "../../../components";

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
    try {
      this.props.fetchProjects();
      const nameItem = "projects";
      const nameSubItem = "list";
      const open = true;
      this.props.toggleItemMenu({ nameItem, open });
      this.props.selectedItemMenu({ nameItem, nameSubItem });
    } catch (error) {}
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
    } else {
      this.props.enqueueSnackbar("The request could not be processed!", {
        variant: "error"
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
    const {
      classes,
      loading,
      is_superuser,
      permissions,
      projects
    } = this.props;
    const canCreateProject = permissions.includes(CAN_ADD_PROJECT);
    const canChangeProject = permissions.includes(CAN_CHANGE_PROJECT);
    const canDeleteProject = permissions.includes(CAN_DELETE_PROJECT);
    const { search, open } = this.state;

    return (
      <Layout title="Projects">
        {() => (
          <div>
            <DialogDelete
              item="project"
              open={open}
              closeModal={() => this.setState({ open: false })}
              remove={this.handleDelete}
            />
            <div className={classes.root}>
              <SimpleBreadcrumbs
                routes={breadcrumbs}
                classes={{ root: classes.breadcrumbs }}
              />

              <Panel>
                <div
                  className={
                    canCreateProject || is_superuser
                      ? classes.header
                      : classes.headerRight
                  }
                >
                  {canCreateProject || is_superuser ? (
                    <Link
                      component={RouterLink}
                      color="inherit"
                      to="/projects/create"
                    >
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
                  {!loading && (
                    <TableBody>
                      {this.filter(projects, search).map(project => (
                        <TableRow key={project.id}>
                          <TableCell component="td" style={{ width: "80%" }}>
                            {project.name}
                          </TableCell>
                          <TableCell>
                            <div style={{ display: "flex" }}>
                              {canChangeProject || is_superuser ? (
                                <Link
                                  component={RouterLink}
                                  to={`/projects/${project.id}`}
                                >
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
                                    loading ||
                                    !canChangeProject ||
                                    !is_superuser
                                  }
                                >
                                  <Edit />
                                </IconButton>
                              )}
                              <IconButton
                                aria-label="Delete"
                                className={classes.iconDelete}
                                disabled={
                                  loading ||
                                  (!canDeleteProject && !is_superuser)
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
                  )}
                </Table>
                <TextEmpty itemName="PROJECTS" empty={projects.length === 0} />
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
  withSnackbar,
  withStyles(styles, { name: "ProjectsList" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ProjectsList);
