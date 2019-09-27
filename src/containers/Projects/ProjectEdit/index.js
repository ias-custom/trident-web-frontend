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
  Typography,
  TextField,
  MenuItem,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Edit, Delete, Save, Cancel, ExpandMore } from "@material-ui/icons";
import {
  toggleItemMenu,
  selectedItemMenu
} from "../../../redux/actions/layoutActions";
import {
  deleteUser,
  getUsersProject,
  getProject,
  updateProject,
  addUser,
  getInspectionsProject,
  updateCategoryInspection,
  updateItemCategory,
  getDeficiencies,
  addDeficiency,
  deleteDeficiency,
  setPoint
} from "../../../redux/actions/projectActions";
import {
  fetchStructures,
  deleteStructure
} from "../../../redux/actions/structureActions";
import {
  fetchSpans,
  deleteSpan,
  addSpan,
  setStructures
} from "../../../redux/actions/spanActions";
import { getUsers } from "../../../redux/actions/userActions";
import { setLoading } from "../../../redux/actions/globalActions";
import Layout from "../../../components/Layout/index";
import SimpleBreadcrumbs from "../../../components/SimpleBreadcrumbs";
import Panel from "../../../components/Panel";
import styles from "./styles";
import SwipeableViews from "react-swipeable-views";
import { Formik } from "formik";
import * as Yup from "yup";
import { FormSpanEdit } from "../../../components";

const breadcrumbs = [
  { name: "Home", to: "/home" },
  { name: "Projects", to: "/projects" },
  { name: "Project edit", to: null }
];

class ProjectEdit extends React.Component {
  state = {
    search: "",
    openId: 0,
    open: false,
    openUser: false,
    openDeficiency: false,
    itemId: null,
    value: 0,
    projectName: "",
    inputProjectName: "",
    editName: false,
    userSelected: "",
    deficiencyName: ""
  };

  projectId = null;

  componentDidMount = async () => {
    try {
      this.projectId = this.props.match.params.id;
      const response = await this.props.getProject(this.projectId);
      if (response.status === 200) {
        this.setState({
          projectName: response.data.name,
          inputProjectName: response.data.name
        });
        this.props.getUsersProject(this.projectId);
        this.props.getInspectionsProject(this.projectId);
        this.props.fetchStructures(this.projectId);
        this.props.fetchSpans(this.projectId);
        this.props.getUsers();
        this.props.getDeficiencies(this.projectId);

        const nameItem = "projects";
        const open = true;
        this.props.toggleItemMenu({ nameItem, open });
        this.props.selectedItemMenu({ nameItem, nameSubItem: "detail" });
      } else {
        this.props.history.push("/404");
      }
    } catch (error) {}
  };

  handleSearch = event => {
    this.setState({ search: event.target.value });
  };

  filter = (list, keyword, tab) => {
    if (keyword === "") return list;
    let fields = "";
    if (tab === "users") {
      fields = ["first_name", "last_name", "username", "email"];
    }
    if (tab === "structures") {
      fields = ["name"];
    }
    if (tab === "spans") {
      fields = ["id"];
    }
    if (tab === "deficiencies") {
      fields = ["name"];
    }
    const regex = new RegExp(keyword, "i");

    return list.filter(data => {
      const obj = { ...data };

      return (
        fields.filter(field => {
          return String(obj[field]).match(regex);
        }).length > 0
      );
    });
  };

  handleDelete = async () => {
    this.setState({ open: false });
    let response = "";
    let itemName = "";
    try {
      if (this.state.value === 0) {
        itemName = "User";
        response = await this.props.deleteUser(
          this.projectId,
          this.state.itemId
        );
      }
      if (this.state.value === 1) {
        itemName = "Structure";
        response = await this.props.deleteStructure(
          this.projectId,
          this.state.itemId
        );
      }
      if (this.state.value === 2) {
        itemName = "Span";
        response = await this.props.deleteSpan(
          this.projectId,
          this.state.itemId
        );
      }

      if (this.state.value === 4) {
        itemName = "Deficiency";
        response = await this.props.deleteDeficiency(
          this.projectId,
          this.state.itemId
        );
      }

      if (response.status === 200 || response.status === 204) {
        // SHOW NOTIFICACION SUCCCESS
        const text = `${itemName} successfully removed!`;
        this.props.enqueueSnackbar(text, {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "center" }
        });
      } else {
        this.props.enqueueSnackbar("The request could not be processed!", {
          variant: "error"
        });
      }
    } catch (error) {
      this.props.enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  showModal = async (itemId, item) => {
    let form = { [item]: true, itemId };
    if (item === "openSpan") {
      if (this.props.structures.length < 2) {
        this.props.enqueueSnackbar(
          "¡The project must have a minimum of 2 structures!",
          {
            variant: "error",
            anchorOrigin: { vertical: "top", horizontal: "center" }
          }
        );
        return;
      }
    }
    this.setState(form);
  };

  closeModal(item, resetForm) {
    let form = { [item]: !this.state[item], userSelected: "" };
    if (item === "openSpan") {
      resetForm();
      form["formStructureOrSpanType"] = { name: "", description: "" };
    }
    this.setState(form);
  }

  handleChange(event, newValue) {
    this.setState({ value: newValue, search: "" });
  }

  handleChangeIndex(index) {
    this.setState({ value: index });
  }

  showInputEdit() {
    this.setState({ editName: true });
  }

  saveName = async () => {
    const form = { name: this.state.inputProjectName };
    const response = await this.props.updateProject(this.projectId, form);
    if (response.status === 200 || response.status === 204) {
      this.setState({
        editName: false,
        projectName: this.state.inputProjectName
      });
      // SHOW NOTIFICACION SUCCCESS
      this.props.enqueueSnackbar("¡Project updated successfully!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    } else {
      this.props.enqueueSnackbar("The request could not be processed!", {
        variant: "error"
      });
    }
  };

  addUser = async () => {
    const form = { user_id: this.state.userSelected };
    try {
      const response = await this.props.addUser(this.projectId, form);
      if (response.status === 200 || response.status === 201) {
        this.closeModal("openUser", null);
        // SHOW NOTIFICACION SUCCCESS
        this.props.enqueueSnackbar("¡The user was added successfully!", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "center" }
        });
      } else {
        this.props.enqueueSnackbar("The request could not be processed!", {
          variant: "error"
        });
      }
    } catch (error) {
      this.props.enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  openCollapse(openId, category) {
    category.newName = "";
    this.props.categories_project.map(category => {
      category.items.map(item => {
        item.edit = false;
        return item;
      });
      return category;
    });
    if (openId === category.id) this.setState({ openId: 0 });
    else this.setState({ openId: category.id });
  }

  changeNameItem = async (item, categoryId) => {
    const form = { name: item.newName };
    const response = await this.props.updateItemCategory(
      categoryId,
      item.id,
      form
    );
    if (response.status === 200 || response.status === 204) {
      // SHOW NOTIFICACION SUCCCESS
      Object.assign(item, { name: item.newName, newName: "", edit: false });
      this.setState({});
      this.props.enqueueSnackbar("Item updated successfully!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    } else {
      this.props.enqueueSnackbar("The request could not be processed!", {
        variant: "error"
      });
    }
  };

  changeNameCategory = async (category, inspectionId) => {
    const form = { name: category.newName };
    const response = await this.props.updateCategoryInspection(
      category.id,
      inspectionId,
      form
    );
    if (response.status === 200 || response.status === 204) {
      // SHOW NOTIFICACION SUCCCESS
      Object.assign(category, { name: category.newName, newName: "" });
      this.setState({});
      this.props.enqueueSnackbar("Inspection updated successfully!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    } else {
      this.props.enqueueSnackbar("The request could not be processed!", {
        variant: "error"
      });
    }
  };

  addDeficiency = async () => {
    this.setState({ openDeficiency: false });
    const form = { name: this.state.deficiencyName };
    try {
      const response = await this.props.addDeficiency(this.projectId, form);
      if (response.status === 200 || response.status === 201) {
        this.setState({ deficiencyName: "" });
        // SHOW NOTIFICACION SUCCCESS
        this.props.enqueueSnackbar("¡The deficiency was added successfully!", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "center" }
        });
      } else {
        this.props.enqueueSnackbar("The request could not be processed!", {
          variant: "error"
        });
      }
    } catch (error) {
      this.props.enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  dataPorcentage = items => {
    const {classes} = this.props
    const total = items.length;
    const collected = items.filter( ({state_id}) => state_id === 1).length;
    const not_collected = items.filter( ({state_id}) => state_id !== 1).length;
    return (
      <p className={classes.dataPorcentage}>
        Collected: {((collected / total) * 100).toFixed(2)}% / No collected:{" "}
        {((not_collected / total) * 100).toFixed(2)}%
      </p>
    );
  };

  render() {
    const {
      classes,
      loading,
      structures,
      spans,
      users,
      users_customer,
      inspections,
      categories_project,
      deficiencies
    } = this.props;
    const {
      search,
      open,
      openUser,
      value,
      projectName,
      editName,
      inputProjectName,
      userSelected,
      openId,
      openDeficiency,
      deficiencyName
    } = this.state;
    const usersAvailable = users_customer.filter(({ id }) => {
      return !!!users.find(user => id === user.id);
    });

    return (
      <Layout title="Projects">
        {() => (
          <div>
            <Dialog
              open={open}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              onBackdropClick={() =>
                !loading ? this.closeModal("open", null) : false
              }
              onEscapeKeyDown={() =>
                !loading ? this.closeModal("open", null) : false
              }
            >
              <DialogTitle id="alert-dialog-title">
                {"Are you sure you want to delete?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  If you delete it will be permanently.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="outlined"
                  className={classes.buttonCancel}
                  onClick={() => this.closeModal("open", null)}
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
            <Dialog
              open={openUser}
              classes={{ paper: classes.dialog }}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              onBackdropClick={() =>
                !loading ? this.closeModal("openUser", null) : false
              }
              onEscapeKeyDown={() =>
                !loading ? this.closeModal("openUser", null) : false
              }
            >
              <DialogTitle id="alert-dialog-title">{"Add user"}</DialogTitle>
              <DialogContent>
                <TextField
                  name="user_selected"
                  select
                  label="Users"
                  value={userSelected}
                  margin="normal"
                  disabled={loading}
                  onChange={e =>
                    this.setState({ userSelected: e.target.value })
                  }
                  fullWidth
                >
                  {usersAvailable.map(user => {
                    return (
                      <MenuItem key={user.id} value={user.id}>
                        {user.first_name} {user.last_name}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="outlined"
                  className={classes.buttonCancel}
                  onClick={() => this.closeModal("openUser", null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.buttonAccept}
                  onClick={this.addUser}
                  disabled={
                    loading || userSelected === "" || userSelected === null
                  }
                >
                  Add User
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={openDeficiency}
              classes={{ paper: classes.dialog }}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Add deficiency"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Enter the required information
                </DialogContentText>
                <Grid container>
                  <TextField
                    name="name"
                    label="Name"
                    value={deficiencyName}
                    onChange={e => {
                      const value = e.target.value;
                      this.setState({ deficiencyName: value });
                    }}
                    margin="normal"
                    fullWidth
                    required
                  />
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.buttonCancel}
                  onClick={() =>
                    !loading ? this.closeModal("openDeficiency", null) : null
                  }
                >
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  disabled={deficiencyName.length === 0 || loading}
                  className={classes.buttonAccept}
                  onClick={this.addDeficiency}
                >
                  Add deficiency
                </Button>
              </DialogActions>
            </Dialog>

            <div className={classes.root}>
              <SimpleBreadcrumbs
                routes={breadcrumbs}
                classes={{ root: classes.breadcrumbs }}
              />
              {editName ? (
                <Grid item xs={6}>
                  <TextField
                    name="name"
                    value={inputProjectName}
                    label=""
                    required
                    autoFocus={editName}
                    inputProps={{ className: classes.inputName }}
                    onChange={e =>
                      this.setState({ inputProjectName: e.target.value })
                    }
                  />
                  <IconButton
                    className={classes.buttonSave}
                    aria-label="Save"
                    color="primary"
                    onClick={() => this.saveName()}
                    disabled={loading || inputProjectName.length === 0}
                  >
                    <Save />
                  </IconButton>
                  <IconButton
                    className={classes.iconDelete}
                    aria-label="Cancel"
                    onClick={() => {
                      this.setState({
                        inputProjectName: projectName,
                        editName: false
                      });
                    }}
                    disabled={loading}
                  >
                    <Cancel />
                  </IconButton>
                </Grid>
              ) : (
                <Typography component="h1" variant="h5">
                  {projectName}
                  <IconButton
                    aria-label="Edit"
                    color="primary"
                    onClick={() => this.showInputEdit()}
                    disabled={loading}
                  >
                    <Edit />
                  </IconButton>
                </Typography>
              )}

              <Grid className={classes.divTabs}>
                <Tabs
                  value={value}
                  onChange={(e, newValue) => {
                    this.handleChange(e, newValue);
                  }}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                >
                  <Tab label="Users"  disabled={loading}/>
                  <Tab label="Structures" disabled={loading}/>
                  <Tab label="Spans" disabled={loading}/>
                  <Tab label="Inspections" disabled={loading}/>
                  <Tab label="Deficiencies" disabled={loading}/>
                </Tabs>
              </Grid>
              <Panel>
                <SwipeableViews
                  index={value}
                  onChangeIndex={this.handleChangeIndex}
                  slideStyle={{
                    overflowX: "hidden",
                    overflowY: "hidden",
                    padding: "0 2px"
                  }}
                >
                  <Grid>
                    <div className={classes.header}>
                      <Button
                        variant="outlined"
                        color="primary"
                        disabled={loading}
                        onClick={() => this.showModal(null, "openUser")}
                      >
                        Add User
                      </Button>
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
                          <TableCell>Username</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell colSpan={1}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.filter(users, search, "users").map(user => (
                          <TableRow key={user.id}>
                            <TableCell component="td">
                              {user.first_name} {user.last_name}
                            </TableCell>
                            <TableCell component="td">
                              {user.username}
                            </TableCell>
                            <TableCell component="td">{user.email}</TableCell>
                            <TableCell>
                              <div style={{ display: "flex" }}>
                                {/* <Link
                                  component={RouterLink}
                                  to={`/users/${user.id}`}
                                >
                                  <IconButton
                                    aria-label="Edit"
                                    color="primary"
                                    disabled={loading}
                                  >
                                    <Edit />
                                  </IconButton>
                                </Link> */}

                                <IconButton
                                  aria-label="Delete"
                                  className={classes.iconDelete}
                                  disabled={loading}
                                  onClick={() =>
                                    this.showModal(user.relation_id, "open")
                                  }
                                >
                                  <Delete />
                                </IconButton>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {users.length === 0 ? (
                      <Typography
                        variant="display1"
                        align="center"
                        className={classes.emptyText}
                      >
                        THERE AREN'T USERS
                      </Typography>
                    ) : null}
                  </Grid>
                  <Grid>
                    <div className={classes.header}>
                      <Button
                        variant="outlined"
                        color="primary"
                        disabled={loading}
                        onClick={() => {
                          this.props.setPoint("", "");
                          this.props.history.push(
                            `/projects/${this.projectId}/structures/create`
                          );
                        }}
                      >
                        Add Structure
                      </Button>
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
                    <Grid>{this.dataPorcentage(structures)}</Grid>
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ width: "50%" }}>Name</TableCell>
                          <TableCell style={{ width: "30%" }}>State</TableCell>
                          <TableCell colSpan={1}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.filter(structures, search, "structures").map(
                          structure => (
                            <TableRow key={structure.id}>
                              <TableCell component="td">
                                {structure.name}
                              </TableCell>
                              <TableCell component="td">
                                {structure.state.name === "Collected" ? (
                                  <Typography color="primary">
                                    {structure.state.name}
                                  </Typography>
                                ) : (
                                  <Typography style={{ color: "#e44f4f" }}>
                                    {structure.state.name}
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell>
                                <div style={{ display: "flex" }}>
                                  <Link
                                    component={RouterLink}
                                    to={`/projects/${this.projectId}/structures/${structure.id}`}
                                  >
                                    <IconButton
                                      aria-label="Edit"
                                      color="primary"
                                      disabled={loading}
                                    >
                                      <Edit />
                                    </IconButton>
                                  </Link>

                                  <IconButton
                                    aria-label="Delete"
                                    className={classes.iconDelete}
                                    disabled={loading}
                                    onClick={() =>
                                      this.showModal(structure.id, "open")
                                    }
                                  >
                                    <Delete />
                                  </IconButton>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                    {structures.length === 0 ? (
                      <Typography
                        variant="display1"
                        align="center"
                        className={classes.emptyText}
                      >
                        THERE AREN'T STRUCTURES
                      </Typography>
                    ) : null}
                  </Grid>
                  <Grid>
                    <div className={classes.header}>
                      <Button
                        variant="outlined"
                        color="primary"
                        disabled={loading}
                        onClick={() => {
                          this.props.setStructures("", "");
                          this.props.history.push(
                            `/projects/${this.projectId}/spans/create`
                          );
                        }}
                      >
                        Add Span
                      </Button>
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
                    <Grid>{this.dataPorcentage(spans)}</Grid>
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ width: "50%" }}>ID</TableCell>
                          <TableCell style={{ width: "30%" }}>State</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.filter(spans, search, "spans").map(span => (
                          <TableRow key={span.id}>
                            <TableCell component="td">
                              <Link
                                component={RouterLink}
                                to={`/projects/${this.projectId}/spans/${span.id}`}
                              >
                                {span.id}
                              </Link>
                            </TableCell>
                            <TableCell>
                              {span.state ? (
                                span.state.name === "Collected" ? (
                                  <Typography color="primary">
                                    {span.state.name}
                                  </Typography>
                                ) : (
                                  <Typography style={{ color: "#e44f4f" }}>
                                    {span.state.name}
                                  </Typography>
                                )
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell>
                              <div style={{ display: "flex" }}>
                                <Link
                                  component={RouterLink}
                                  to={`/projects/${this.projectId}/spans/${span.id}`}
                                >
                                  <IconButton
                                    aria-label="Edit"
                                    color="primary"
                                    disabled={loading}
                                  >
                                    <Edit />
                                  </IconButton>
                                </Link>
                                <IconButton
                                  aria-label="Delete"
                                  className={classes.iconDelete}
                                  disabled={loading}
                                  onClick={() =>
                                    this.showModal(span.id, "open")
                                  }
                                >
                                  <Delete />
                                </IconButton>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {spans.length === 0 ? (
                      <Typography
                        variant="display1"
                        align="center"
                        className={classes.emptyText}
                      >
                        THERE AREN'T SPANS
                      </Typography>
                    ) : null}
                  </Grid>
                  <Grid container spacing={16}>
                    {inspections.map(({ id, name }) => (
                      <Grid item xs={6} key={id}>
                        <Typography
                          variant="h6"
                          align="center"
                          classes={{ h6: classes.categoryName }}
                        >
                          {name}
                        </Typography>
                        {categories_project
                          .filter(({ inspection_id }) => inspection_id === id)
                          .map(category => (
                            <div key={category.id}>
                              <ExpansionPanel
                                expanded={openId === category.id}
                                onChange={() => {
                                  this.openCollapse(openId, category);
                                }}
                                classes={{ root: classes.collapse }}
                              >
                                <ExpansionPanelSummary
                                  expandIcon={<ExpandMore />}
                                >
                                  {category.name}
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails
                                  classes={{ root: classes.collapseDetails }}
                                >
                                  <Grid>
                                    <TextField
                                      name="name"
                                      value={category.newName || ""}
                                      placeholder="Change category name"
                                      label=""
                                      required
                                      disabled={loading}
                                      inputProps={{
                                        className: classes.inputCategory
                                      }}
                                      onChange={e => {
                                        category.newName = e.target.value;
                                        this.setState({});
                                      }}
                                    />
                                    <IconButton
                                      className={classes.buttonSave}
                                      aria-label="Save"
                                      color="primary"
                                      onClick={() =>
                                        this.changeNameCategory(category, id)
                                      }
                                      disabled={
                                        loading ||
                                        !(
                                          category.newName &&
                                          category.newName.length > 0
                                        )
                                      }
                                    >
                                      <Save />
                                    </IconButton>
                                  </Grid>
                                  <Grid>
                                    <Typography
                                      variant="subtitle1"
                                      classes={{ subtitle1: classes.itemsText }}
                                    >
                                      ITEMS
                                    </Typography>
                                  </Grid>
                                  {category.items.map(item => (
                                    <div key={item.id}>
                                      {item.edit ? (
                                        <Grid>
                                          <TextField
                                            name="name"
                                            value={item.newName}
                                            label=""
                                            required
                                            disabled={loading}
                                            autoFocus={item.edit}
                                            inputProps={{
                                              className: classes.inputCategory
                                            }}
                                            onChange={e => {
                                              item.newName = e.target.value;
                                              this.setState({});
                                            }}
                                          />
                                          <IconButton
                                            className={classes.buttonSave}
                                            aria-label="Save"
                                            color="primary"
                                            onClick={() =>
                                              this.changeNameItem(
                                                item,
                                                category.id
                                              )
                                            }
                                            disabled={
                                              loading ||
                                              item.newName.length === 0
                                            }
                                          >
                                            <Save />
                                          </IconButton>
                                          <IconButton
                                            className={classes.iconDelete}
                                            aria-label="Cancel"
                                            onClick={() => {
                                              item.edit = false;
                                              this.setState({});
                                            }}
                                            disabled={loading}
                                          >
                                            <Cancel />
                                          </IconButton>
                                        </Grid>
                                      ) : (
                                        <Typography variant="subtitle1">
                                          {item.name}
                                          <IconButton
                                            aria-label="Edit"
                                            color="primary"
                                            onClick={() => {
                                              Object.assign(item, {
                                                edit: true,
                                                newName: item.name
                                              });
                                              this.setState({});
                                            }}
                                            disabled={loading}
                                          >
                                            <Edit />
                                          </IconButton>
                                        </Typography>
                                      )}
                                    </div>
                                  ))}
                                </ExpansionPanelDetails>
                              </ExpansionPanel>
                            </div>
                          ))}
                      </Grid>
                    ))}
                  </Grid>
                  <Grid>
                    <div className={classes.header}>
                      <Button
                        variant="outlined"
                        color="primary"
                        disabled={loading}
                        onClick={() => this.showModal(null, "openDeficiency")}
                      >
                        Add Deficiency
                      </Button>
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
                        {this.filter(deficiencies, search, "deficiencies").map(
                          deficiency => (
                            <TableRow key={deficiency.id}>
                              <TableCell component="td">
                                {deficiency.name}
                              </TableCell>
                              <TableCell>
                                <div style={{ display: "flex" }}>
                                  <IconButton
                                    aria-label="Delete"
                                    className={classes.iconDelete}
                                    disabled={loading}
                                    onClick={() =>
                                      this.showModal(deficiency.id, "open")
                                    }
                                  >
                                    <Delete />
                                  </IconButton>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                    {deficiencies.length === 0 ? (
                      <Typography
                        variant="display1"
                        align="center"
                        className={classes.emptyText}
                      >
                        THERE AREN'T DEFICIENCIES
                      </Typography>
                    ) : null}
                  </Grid>
                </SwipeableViews>
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
    states: state.global.states,
    permissions: state.auth.permissions,
    is_superuser: state.auth.is_superuser,
    users_customer: state.users.list,
    users: state.projects.users,
    inspections: state.projects.inspections,
    categories_project: state.projects.categories_project,
    structures: state.structures.structures,
    spans: state.spans.spans,
    deficiencies: state.projects.deficiencies
  };
};

const mapDispatchToProps = {
  fetchSpans,
  fetchStructures,
  getUsersProject,
  getDeficiencies,
  addDeficiency,
  deleteDeficiency,
  getInspectionsProject,
  updateCategoryInspection,
  updateItemCategory,
  getProject,
  updateProject,
  getUsers,
  addUser,
  addSpan,
  deleteUser,
  deleteSpan,
  deleteStructure,
  toggleItemMenu,
  selectedItemMenu,
  setLoading,
  setPoint,
  setStructures
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "ProjectEdit" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ProjectEdit);
