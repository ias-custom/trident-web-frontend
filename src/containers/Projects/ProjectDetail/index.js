import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
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
  withStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Typography
} from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import { Edit, Delete } from "@material-ui/icons";
import {
  toggleItemMenu,
  selectedItemMenu
} from "../../../redux/actions/layoutActions";
import { fetchStructures, fetchSpams, deleteSpam, deleteStructure } from "../../../redux/actions/projectActions";
import Layout from "../../../components/Layout/index";
import SimpleBreadcrumbs from "../../../components/SimpleBreadcrumbs";
import Panel from "../../../components/Panel";
import styles from "./styles";
import SwipeableViews from 'react-swipeable-views';
import {
  CAN_CHANGE_USER,
  CAN_DELETE_USER
} from "../../../redux/permissions";

const breadcrumbs = [
  { name: "Home", to: "/home" },
  { name: "Projects", to: "/projects" },
  { name: "Project detail", to: null }
];

const fakeUsers = [
  {name: "Pepe", id: 1},
  {name: "Jose", id: 2},
  {name: "Luigui", id: 3},
]


class ProjectDetail extends React.Component {
  state = {
    search: "",
    open: false,
    itemId: null,
    value: 0
  };

  projectId = null
  componentDidMount() {
    this.projectId = this.props.match.params.id
    // VALIDO SI ES UN PROYECTO AL QUE PUEDO ACCEDER - LLAMADA AL ENDPOINT SI NO ES 200 MUESTRO 404
    const nameItem = "projects";  
    const open = true;
    this.props.toggleItemMenu({ nameItem, open });
    this.props.selectedItemMenu({ nameItem, nameSubItem: "detail" });
  }

  handleSearch = event => {
    this.setState({ search: event.target.value });
  };

  filter = (list, keyword) => {
    if (keyword === "") return list;

    const fields = ["name"];
    const regex = new RegExp(keyword, "i");

    return list.filter(data => {
      const obj = { ...data };

      return (
        fields.filter(field => {
          return typeof obj[field] === "string" && obj[field].match(regex);
        }).length > 0
      );
    });
  };

  handleDelete = async () => {
    this.setState({ open: false });
    let response = ""
    let itemName = ""
    if (this.state.value === 0) {
      itemName= "User"
      response = await this.props.deleteUser(this.projectId, this.state.itemId);
    }
    if (this.state.value === 1) {
      itemName= "Structure"
      response = await this.props.deleteStructure(this.projectId, this.state.itemId);
    }
    if (this.state.value === 2) {
      itemName= "Spam"
      response = await this.props.deleteSpam(this.projectId, this.state.itemId);
    }
    if (response.status === 200 || response.status === 204) {
      // SHOW NOTIFICACION SUCCCESS
      console.log(this.props)
      const text = `${itemName} successfully removed!`
      this.props.enqueueSnackbar( text, {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    }
  };

  showModal(itemId) {
    this.setState({ open: true, itemId });
  }

  closeModal = () => {
    this.setState({ open: false });
  };

  handleChange (event, newValue) {
    this.setState({value: newValue, search: ""});
    if (newValue === 0) {
      // ENDPOINT TO USERS OF PROJECT
    }
    if (newValue === 1) {
      this.props.fetchStructures(this.projectId)
      return
    }
    if (newValue === 2) {
      this.props.fetchSpams(this.projectId)
      return
    }
  }

  handleChangeIndex(index) {
    this.setState({value: index});
  }

  render() {
    const { classes, loading, is_superuser, permissions, structures, spams } = this.props;
    const canChangeUser = permissions.includes(CAN_CHANGE_USER);
    const canDeleteUser = permissions.includes(CAN_DELETE_USER);
    const { search, open, value } = this.state;

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
          <Typography component="h1" variant="h5">Project Name </Typography>
          <Grid className={classes.divTabs}>
            <Tabs
              value={value}
              onChange={ (e, newValue) => {
                  this.handleChange(e, newValue)
                }
              }
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Users" />
              <Tab label="Structures" />
              <Tab label="Spams" />
            </Tabs>
          </Grid>
          <Panel>
            
              <SwipeableViews
                index={value}
                onChangeIndex={this.handleChangeIndex}
              >
                <Grid>
                  <div
                    className={classes.headerCenter}
                  >
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
                      {this.filter(fakeUsers, search).map(user => (
                        <TableRow key={user.id}>
                          <TableCell component="td" style={{ width: "80%" }}>
                          {user.name}
                          </TableCell>
                          <TableCell>
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
                                aria-label="Delete"
                                className={classes.iconDelete}
                                disabled={
                                  loading || (!canDeleteUser && !is_superuser)
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
                  </Table>
                  {fakeUsers.length === 0 ? (
                    <Typography variant="display1" align="center" className={classes.emptyText}>NO EXISTEN USUARIOS</Typography>
                  ): null}
                </Grid>
                <Grid>
                  <div
                    className={classes.header}
                  >
                    <Link
                      component={RouterLink}
                      color="inherit"
                      to="/structures/create"
                    >
                      <Button variant="outlined" color="primary">
                        Create Structure
                      </Button>
                    </Link>
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
                      {this.filter(structures, search).map(structure => (
                        <TableRow key={structure.id}>
                          <TableCell component="td" style={{ width: "80%" }}>
                          <Link component={RouterLink} to={`/projects/${this.projectId}/structures/${structure.id}`}>{structure.name}</Link>
                          </TableCell>
                          <TableCell>
                            <div style={{ display: "flex" }}>
                              {is_superuser ? (
                                <Link component={RouterLink} to={`/projects/${this.projectId}/structures/${structure.id}`}>
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
                                    loading || !is_superuser
                                  }
                                >
                                  <Edit />
                                </IconButton>
                              )}
                              <IconButton
                                aria-label="Delete"
                                className={classes.iconDelete}
                                disabled={
                                  loading || (!is_superuser)
                                }
                                onClick={() => this.showModal(structure.id)}
                              >
                                <Delete />
                              </IconButton>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {structures.length === 0 ? (
                    <Typography variant="display1" align="center" className={classes.emptyText}>NO EXISTEN STRUCTURES</Typography>
                  ): null}
                </Grid>
                <Grid>
                  <div
                    className={classes.header}
                  >
                    <Link
                      component={RouterLink}
                      color="inherit"
                      to="/spams/create"
                    >
                      <Button variant="outlined" color="primary">
                        Create Spam
                      </Button>
                    </Link>
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
                        <TableCell style={{ width: "80%" }}>ID</TableCell>
                        <TableCell colSpan={1}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.filter(spams, search).map(spam => (
                        <TableRow key={spam.id}>
                          <TableCell component="td" style={{ width: "80%" }}>
                          <Link component={RouterLink} to={`/projects/${this.projectId}/spams/${spam.id}`}>{spam.id}</Link>
                          </TableCell>
                          <TableCell>
                            <div style={{ display: "flex" }}>
                              {is_superuser ? (
                                <Link component={RouterLink} to={`/projects/${this.projectId}/spams/${spam.id}`}>
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
                                    loading || !is_superuser
                                  }
                                >
                                  <Edit />
                                </IconButton>
                              )}
                              <IconButton
                                aria-label="Delete"
                                className={classes.iconDelete}
                                disabled={
                                  loading || (!is_superuser)
                                }
                                onClick={() => this.showModal(spam.id)}
                              >
                                <Delete />
                              </IconButton>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {spams.length === 0 ? (
                    <Typography variant="display1" align="center" className={classes.emptyText}>NO EXISTEN SPAMS</Typography>
                  ): null}
                </Grid>
              </SwipeableViews>
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
    structures: state.projects.structures,
    spams: state.projects.spams,
    permissions: state.auth.permissions,
    is_superuser: state.auth.is_superuser
  };
};

const mapDispatchToProps = {
  fetchSpams,
  fetchStructures,
  deleteSpam,
  deleteStructure,
  toggleItemMenu,
  selectedItemMenu
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "ProjectDetail" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ProjectDetail);
