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
  Checkbox
} from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Edit, Delete, Save, Cancel, CloudUpload } from "@material-ui/icons";
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
  setPoint,
  addSet,
  setFromMap,
  deleteStructures
} from "../../../redux/actions/projectActions";
import {
  deleteStructure,
  uploadStructures
} from "../../../redux/actions/structureActions";
import { deleteSpan, setStructures } from "../../../redux/actions/spanActions";
import { deleteInteraction } from "../../../redux/actions/interactionActions";
import { getUsers } from "../../../redux/actions/userActions";
import { setLoading } from "../../../redux/actions/globalActions";
import { fetchSets, getSet } from "../../../redux/actions/setsActions";
import Layout from "../../../components/Layout/index";
import SimpleBreadcrumbs from "../../../components/SimpleBreadcrumbs";
import Panel from "../../../components/Panel";
import styles from "./styles";
import SwipeableViews from "react-swipeable-views";
import {
  InfoSetView,
  TextEmpty,
  DialogDelete,
  ShowErrors,
  MapBox
} from "../../../components";
import InputFiles from "react-input-files";
import { fetchLines } from "../../../redux/actions/LineActions";
import ReactLoading from "react-loading";

const breadcrumbs = [
  { name: "Home", to: "/home" },
  { name: "Projects", to: "/projects" },
  { name: "Project edit", to: null }
];

const status = [
  { id: 1, name: "ACTIVE" },
  { id: 2, name: "COMPLETED" },
  { id: 3, name: "PLANNED" }
];
class ProjectEdit extends React.Component {
  state = {
    search: "",
    open: false,
    openUser: false,
    itemId: null,
    value: 0,
    projectStatus: "",
    projectName: "",
    inputProjectName: "",
    editName: false,
    userSelected: "",
    openSet: false,
    setId: "",
    set: null,
    setIdSelected: "",
    setSelected: null,
    itemName: "",
    openFile: false,
    fileName: "",
    type: "",
    enabledMap: false,
    projectLine: "",
    lineDialog: false,
    newLine: "",
    structureIds: []
  };

  projectId = null;

  componentDidMount = async () => {
    try {
      const url = new URL(window.location.href);
      const fromMap = url.searchParams.get("map");
      this.projectId = this.props.match.params.id;
      const response = await this.props.getProject(this.projectId);
      if (response.status === 200) {
        console.log(response.data);
        await this.props.fetchLines();
        this.setState({
          projectName: response.data.name,
          projectStatus: response.data.state_id || "",
          projectLine: response.data.line_id || "",
          newLine: response.data.line_id || "",
          inputProjectName: response.data.name,
          set: response.data.set,
          setId: response.data.set_id,
          value:
            fromMap === "true"
              ? response.data.inspection_id === 1
                ? 5
                : 4
              : 0,
          type: response.data.inspection_id,
          enabledMap: true
        });
        this.props.fetchSets();
        this.props.getUsers();

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
    let fields = [];
    if (tab === "users") {
      fields = ["first_name", "last_name", "username", "email"];
    }
    if (tab === "structures") {
      fields = ["number", "line"];
    }
    if (tab === "spans") {
      fields = ["id"];
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
    const { value } = this.state;
    let response = "";
    let itemName = "";
    try {
      if (value === 0) {
        itemName = "User";
        response = await this.props.deleteUser(
          this.projectId,
          this.state.itemId
        );
      }
      if (value === 1) {
        itemName = "Structure";
        response = await this.props.deleteStructure(
          this.projectId,
          this.state.itemId
        );
      }
      if (value === 2) {
        itemName = "Span";
        response = await this.props.deleteSpan(
          this.projectId,
          this.state.itemId
        );
      }

      if (value === 4) {
        itemName = "Interaction";
        response = await this.props.deleteInteraction(
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

  showModal = async (itemId, item, itemName = "") => {
    let form = { [item]: true, itemId, itemName };
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
    this.closeModal("openUser", null);
    const form = { user_id: this.state.userSelected };
    try {
      const response = await this.props.addUser(this.projectId, form);
      if (response.status === 200 || response.status === 201) {
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

  /* addDeficiency = async () => {
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
  }; */

  addSet = async () => {
    const { setSelected, set, setId } = this.state;
    this.setState({ openSet: false, set: setSelected, setId: setSelected.id });

    const form = { set_id: setSelected.id };
    const response = await this.props.updateProject(this.projectId, form);
    if (response.status === 200) {
      this.props.enqueueSnackbar("¡The set was updated successfully!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    } else {
      this.setState({ set, setId });
      this.props.enqueueSnackbar("The request could not be processed!", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    }
  };

  dataPorcentage = items => {
    const { classes } = this.props;
    const total = items.length;
    const collected = items.filter(({ state_id }) => state_id === 1).length;
    const not_collected = items.filter(({ state_id }) => state_id !== 1).length;
    return total !== 0 ? (
      <p className={classes.dataPorcentage}>
        Collected: {((collected / total) * 100).toFixed(2)}% / No collected:{" "}
        {((not_collected / total) * 100).toFixed(2)}%
      </p>
    ) : (
      <p className={classes.dataPorcentage}>Collected: 0% / No collected: 0%</p>
    );
  };

  openConfirmSet = async setId => {
    const response = await this.props.getSet(setId);
    this.setState({ setSelected: response.data, openSet: true });
  };

  uploadFile = async file => {
    this.setState({ fileName: file.name, openFile: true });
    const formData = new FormData();
    formData.append("file", file);
    const response = await this.props.uploadStructures(
      this.projectId,
      formData
    );
    this.setState({ openFile: false, fileName: "" });
    if (response.status === 201) {
      this.props.enqueueSnackbar("The structures were succesfully loaded!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    } else {
      const errors = response.data;
      console.log(errors);
      this.props.enqueueSnackbar("", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
        content: key => <ShowErrors id={key} errors={errors} />
      });
    }
  };

  changeStatus = async state_id => {
    const form = { state_id };
    const response = await this.props.updateProject(this.projectId, form);
    if (response.status === 200 || response.status === 204) {
      // SHOW NOTIFICACION SUCCCESS
      this.props.enqueueSnackbar("¡Project updated successfully!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    } else {
      this.setState({ projectStatus: "" });
      this.props.enqueueSnackbar("The request could not be processed!", {
        variant: "error"
      });
    }
  };

  changeLine = async () => {
    this.setState({ lineDialog: false });
    const { newLine, projectLine } = this.state;
    const form = { line_id: newLine };
    const response = await this.props.updateProject(this.projectId, form);
    if (response.status === 200 || response.status === 204) {
      // SHOW NOTIFICACION SUCCCESS
      this.setState({ projectLine: newLine });
      this.props.enqueueSnackbar("¡Project updated successfully!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    } else {
      this.setState({ newLine: projectLine });
      this.props.enqueueSnackbar("The request could not be processed!", {
        variant: "error"
      });
    }
  };

  onSelectAllStructures = e => {
    const { structures } = this.props;
    if (e.target.checked) {
      this.setState({ structureIds: structures.map(({ id }) => id) });
      return;
    }
    this.setState({ structureIds: [] });
  };

  onSelectStructure = (e, structureId) => {
    const { structureIds } = this.state;
    if (e.target.checked) {
      structureIds.push(structureId);
      this.setState({
        structureIds: Array.from(new Set(structureIds))
      });
      return;
    }
    this.setState({
      structureIds: Array.from(
        new Set(structureIds.filter(id => id !== structureId))
      )
    });
  };

  deleteStructuresSelected = async () => {
    const { structureIds } = this.state;
    const response = await this.props.deleteStructures(
      this.projectId,
      structureIds
    );
    if (response.status === 200 || response.status === 204) {
      // SHOW NOTIFICACION SUCCCESS
      this.setState({ structureIds: [] });
      this.props.enqueueSnackbar("Structures removed successfully!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    } else {
      this.props.enqueueSnackbar("The request could not be processed!", {
        variant: "error"
      });
    }
  };

  render() {
    const {
      classes,
      loading,
      structures,
      spans,
      users,
      users_customer,
      interactions,
      lines
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
      openFile,
      openSet,
      set,
      setSelected,
      itemName,
      fileName,
      type,
      enabledMap,
      projectStatus,
      projectLine,
      lineDialog,
      newLine,
      structureIds
    } = this.state;
    const usersAvailable = users_customer.filter(({ id }) => {
      return !users.includes(id);
    });
    return (
      <Layout title="Projects">
        {openDrawer => (
          <div>
            <DialogDelete
              item={itemName}
              open={open}
              closeModal={() => this.closeModal("open", null)}
              remove={this.handleDelete}
            />
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
              <DialogTitle id="alert-dialog-title">
                {"Add inspector"}
              </DialogTitle>
              <DialogContent>
                <TextField
                  name="user_selected"
                  select
                  label="Inspectors"
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
              open={openSet}
              classes={{ paper: classes.dialogSet }}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              onBackdropClick={() => {
                this.setState({ openSet: false });
              }}
              onEscapeKeyDown={() => {
                this.setState({ openSet: false });
              }}
            >
              <DialogTitle id="alert-dialog-title">
                {`Set ${setSelected && setSelected.name}`}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Below is the set information
                </DialogContentText>
                {setSelected && (
                  <InfoSetView
                    inspections={setSelected.inspections}
                    type={setSelected.inspection_id || 1}
                  />
                )}
              </DialogContent>
              <DialogActions>
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.buttonCancel}
                  onClick={() => {
                    this.setState({ openSet: false });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.buttonAccept}
                  onClick={this.addSet}
                >
                  Add set
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={openFile}
              classes={{ paper: classes.dialogSet }}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              disableBackdropClick={true}
              disableEscapeKeyDown={true}
            >
              <DialogTitle id="alert-dialog-title">UPLOAD FILE</DialogTitle>
              <DialogContent>
                <p style={{ wordBreak: "break-all" }}>
                  <span style={{ fontWeight: "bold", marginRight: 10 }}>
                    File:
                  </span>
                  {fileName}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column"
                  }}
                >
                  <ReactLoading
                    type={"spin"}
                    color={"#3f51b5"}
                    height={"40px"}
                    width={"40px"}
                  />
                  <span style={{ color: "#3f51b5", marginTop: 5 }}>
                    LOADING...
                  </span>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog
              open={lineDialog}
              classes={{ paper: classes.dialog }}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              onBackdropClick={() => {
                this.setState({ lineDialog: false, newLine: projectLine });
              }}
              onEscapeKeyDown={() => {
                this.setState({ lineDialog: false, newLine: projectLine });
              }}
            >
              <DialogTitle id="alert-dialog-title">
                Add structures from line
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Select the line
                </DialogContentText>
                <TextField
                  name="line_id"
                  select
                  label="Line"
                  value={newLine}
                  margin="none"
                  fullWidth
                  onChange={e => {
                    const value = e.target.value;
                    this.setState({ newLine: value });
                  }}
                  required
                >
                  {lines.map(line => {
                    return (
                      <MenuItem key={line.id} value={line.id}>
                        {line.name}
                      </MenuItem>
                    );
                  })}
                </TextField>
                {newLine !== "" && (
                  <p
                    className={classes.paragraphLine}
                  >{`Are you sure you want to add the structures from the Line ${
                    lines.length > 0
                      ? lines.find(({ id }) => id === newLine).name
                      : ""
                  } ?`}</p>
                )}
              </DialogContent>
              <DialogActions style={{ padding: "0 10px 14px 10px", margin: 0 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.buttonCancel}
                  onClick={() => {
                    this.setState({ lineDialog: false, newLine: projectLine });
                  }}
                >
                  No
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.buttonAccept}
                  onClick={this.changeLine}
                >
                  Yes, I'm Sure
                </Button>
              </DialogActions>
            </Dialog>
            <div className={classes.root}>
              <SimpleBreadcrumbs
                routes={breadcrumbs}
                classes={{ root: classes.breadcrumbs }}
              />
              <Grid container style={{ marginBottom: 20 }}>
                <Grid style={{ paddingTop: 12 }}>
                  {editName ? (
                    <Grid style={{ display: "flex" }}>
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
                        style={{ minWidth: 150, maxWidth: 250 }}
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
                </Grid>
                <Grid style={{ marginLeft: 40 }}>
                  <TextField
                    name="status"
                    select
                    label="Status"
                    value={projectStatus}
                    margin="none"
                    onChange={e => {
                      const value = e.target.value;
                      this.setState({ projectStatus: value });
                      this.changeStatus(value);
                    }}
                    style={{ width: 250 }}
                    required
                  >
                    {status.map(state => {
                      return (
                        <MenuItem key={state.id} value={state.id}>
                          {state.name}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                </Grid>
              </Grid>

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
                  <Tab label="Inspectors" disabled={loading} />
                  <Tab label="Structures" disabled={loading} />
                  {type === 1 ? <Tab label="Spans" disabled={loading} /> : null}
                  <Tab label="Inspection Sets" disabled={loading} />
                  <Tab label="Interactions" disabled={loading} />
                  <Tab label="Map" disabled={loading} />
                </Tabs>
              </Grid>
              <Panel>
                <SwipeableViews
                  index={value}
                  onChangeIndex={this.handleChangeIndex}
                  slideStyle={{
                    overflowX: "hidden",
                    overflowY: "hidden",
                    padding: "0 2px",
                    minHeight: "500px",
                    height:
                      (type === 1 && value === 3) || (type === 2 && value === 2)
                        ? "auto"
                        : "calc(100vh - 330px)"
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
                        Add Inspector
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
                    <div className={classes.divTable}>
                      <Table className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell colSpan={1}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        {!loading && (
                          <TableBody>
                            {this.filter(
                              users_customer.filter(({ id }) =>
                                users.includes(id)
                              ),
                              search,
                              "users"
                            ).map(user => (
                              <TableRow key={user.id}>
                                <TableCell component="td">
                                  {user.first_name} {user.last_name}
                                </TableCell>
                                <TableCell component="td">
                                  {user.username}
                                </TableCell>
                                <TableCell component="td">
                                  {user.email}
                                </TableCell>
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
                                        this.showModal(user.id, "open", "user")
                                      }
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
                      <TextEmpty
                        itemName="INSPECTORS"
                        empty={users.length === 0}
                      />
                    </div>
                  </Grid>
                  <Grid>
                    <div className={classes.header}>
                      <div>
                        <Button
                          variant="outlined"
                          color="primary"
                          disabled={loading}
                          style={{ fontSize: 12 }}
                          onClick={() => {
                            this.props.setPoint("", "");
                            this.props.setFromMap(false);
                            this.props.history.push(
                              `/projects/${this.projectId}/structures/create`
                            );
                          }}
                        >
                          Add Structure
                        </Button>
                        <InputFiles
                          name="file"
                          accept=".csv"
                          onChange={(files, e) => {
                            this.uploadFile(files[0]);
                            e.target.value = "";
                          }}
                        >
                          <Button
                            variant="outlined"
                            disabled={loading}
                            className={classes.upload}
                          >
                            <CloudUpload />
                            Multiple structures
                          </Button>
                        </InputFiles>
                        <Button
                          variant="outlined"
                          color="primary"
                          style={{ fontSize: 12 }}
                          disabled={loading}
                          onClick={() => this.setState({ lineDialog: true })}
                        >
                          Add Structures from a line
                        </Button>
                      </div>
                      <Input
                        defaultValue=""
                        className={classes.search}
                        inputProps={{
                          placeholder: "Search...",
                          onChange: this.handleSearch
                        }}
                      />
                    </div>
                    <Grid>{this.dataPorcentage(structures)}</Grid>
                    {structureIds.length > 0 && (
                      <Grid
                        container
                        justify="flex-end"
                        style={{ marginBottom: "10px" }}
                      >
                        <Button
                          variant="outlined"
                          disabled={loading}
                          className={classes.upload}
                          onClick={this.deleteStructuresSelected}
                        >
                          <Delete />
                          Delete structures
                        </Button>
                      </Grid>
                    )}

                    <div className={classes.divTable}>
                      <Table className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell
                              padding="checkbox"
                              style={{ width: "10%" }}
                            >
                              <Checkbox
                                checked={
                                  structures.length > 0
                                    ? structures.length === structureIds.length
                                    : false
                                }
                                onChange={this.onSelectAllStructures}
                              />
                            </TableCell>
                            <TableCell style={{ width: "25%" }}>
                              Number
                            </TableCell>
                            <TableCell style={{ width: "20%" }}>
                              State
                            </TableCell>
                            <TableCell style={{ width: "25%" }}>Line</TableCell>
                            <TableCell colSpan={1}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        {!loading && (
                          <TableBody>
                            {this.filter(structures, search, "structures").map(
                              structure => (
                                <TableRow key={structure.id}>
                                  <TableCell padding="checkbox" component="td">
                                    <Checkbox
                                      checked={structureIds.includes(
                                        structure.id
                                      )}
                                      onChange={e =>
                                        this.onSelectStructure(e, structure.id)
                                      }
                                    />
                                  </TableCell>
                                  <TableCell component="td">
                                    {structure.number}
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
                                  <TableCell component="td">
                                    {structure.line_id && lines.length > 0
                                      ? lines.find(
                                          ({ id }) => id === structure.line_id
                                        ).name
                                      : "-"}
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
                                          this.showModal(
                                            structure.id,
                                            "open",
                                            "structure"
                                          )
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
                        )}
                      </Table>
                      <TextEmpty
                        itemName="STRUCTURES"
                        empty={structures.length === 0}
                      />
                    </div>
                  </Grid>
                  {type === 1 ? (
                    <Grid>
                      <div className={classes.header}>
                        <Button
                          variant="outlined"
                          color="primary"
                          disabled={loading}
                          onClick={() => {
                            this.props.setStructures("", "");
                            this.props.setFromMap(false);
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
                      <div className={classes.divTable}>
                        <Table className={classes.table}>
                          <TableHead>
                            <TableRow>
                              <TableCell style={{ width: "50%" }}>
                                Number
                              </TableCell>
                              <TableCell style={{ width: "30%" }}>
                                State
                              </TableCell>
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
                                    {span.number}
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
                                        this.showModal(span.id, "open", "span")
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
                      </div>
                      <TextEmpty itemName="SPANS" empty={spans.length === 0} />
                    </Grid>
                  ) : (
                    <Grid style={{ height: "100%" }}>
                      {/* <Grid item className={classes.divSelectSet} xs>
                        <Typography
                          variant="subtitle1"
                          className={classes.textSelect}
                        >
                          SELECT THE SET:
                        </Typography>
                        <TextField
                          name="set_id"
                          select
                          label="Sets"
                          value={setId}
                          onChange={e => this.openConfirmSet(e.target.value)}
                          margin="none"
                          fullWidth
                        >
                          {sets.filter(({inspection_id}) => inspection_id === type).map(set => {
                            return (
                              <MenuItem key={set.id} value={set.id}>
                                {set.name}
                              </MenuItem>
                            );
                          })}
                          {set && setId === 1 && (
                            <MenuItem key={set.id} value={set.id}>
                              {set.name}
                            </MenuItem>
                          )}
                        </TextField>
                      </Grid> */}
                      {set && (
                        <InfoSetView
                          inspections={set.inspections}
                          type={set.inspection_id}
                        />
                      )}
                    </Grid>
                  )}
                  {type === 1 ? (
                    <Grid style={{ height: "100%" }}>
                      {/* <Grid item className={classes.divSelectSet} xs>
                        <Typography
                          variant="subtitle1"
                          className={classes.textSelect}
                        >
                          SELECT THE SET:
                        </Typography>
                        <TextField
                          name="set_id"
                          select
                          label="Sets"
                          value={setId}
                          onChange={e => this.openConfirmSet(e.target.value)}
                          margin="none"
                          fullWidth
                        >
                          {sets.map(set => {
                            return (
                              <MenuItem key={set.id} value={set.id}>
                                {set.name}
                              </MenuItem>
                            );
                          })}
                          {set && setId === 1 && (
                            <MenuItem key={set.id} value={set.id}>
                              {set.name}
                            </MenuItem>
                          )}
                        </TextField>
                      </Grid> */}
                      {set && (
                        <InfoSetView
                          inspections={set.inspections}
                          type={set.inspection_id}
                        />
                      )}
                    </Grid>
                  ) : (
                    <Grid>
                      <div className={classes.header}>
                        <Link
                          component={RouterLink}
                          color="inherit"
                          to={`/projects/${this.projectId}/interactions/create`}
                        >
                          <Button variant="outlined" color="primary">
                            Create Interaction
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
                      <div style={{ overflowX: "auto" }}>
                        <Table className={classes.table}>
                          <TableHead>
                            <TableRow>
                              <TableCell style={{ minWidth: 180 }}>
                                Name
                              </TableCell>
                              <TableCell style={{ minWidth: 120 }}>
                                Title
                              </TableCell>
                              <TableCell style={{ minWidth: 120 }}>
                                Type
                              </TableCell>
                              <TableCell>Latitude</TableCell>
                              <TableCell>Longitude</TableCell>
                              <TableCell>Contact Info</TableCell>
                              <TableCell>Notes</TableCell>
                              <TableCell style={{ minWidth: 160 }}>
                                Actions
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {this.filter(interactions, search).map(
                              interaction => (
                                <TableRow key={interaction.id}>
                                  <TableCell
                                    component="td"
                                    className={classes.cellDescription}
                                  >
                                    {interaction.name}
                                  </TableCell>
                                  <TableCell>{interaction.title}</TableCell>
                                  <TableCell>{interaction.type}</TableCell>
                                  <TableCell>{interaction.latitude}</TableCell>
                                  <TableCell>{interaction.longitude}</TableCell>
                                  <TableCell>
                                    {interaction.contact_info || "-"}
                                  </TableCell>
                                  <TableCell>
                                    {interaction.notes || "-"}
                                  </TableCell>
                                  <TableCell>
                                    <div>
                                      <Link
                                        component={RouterLink}
                                        color="inherit"
                                        to={`/projects/${this.projectId}/interactions/${interaction.id}`}
                                      >
                                        <IconButton color="primary">
                                          <Edit />
                                        </IconButton>
                                      </Link>
                                      <IconButton
                                        aria-label="Delete"
                                        className={classes.iconDelete}
                                        disabled={loading}
                                        onClick={() =>
                                          this.showModal(
                                            interaction.id,
                                            "open",
                                            "interaction"
                                          )
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
                        <TextEmpty
                          itemName="INTERACTIONS"
                          empty={interactions.length === 0}
                        />
                      </div>
                    </Grid>
                  )}
                  {type === 1 ? (
                    <Grid>
                      <div className={classes.header}>
                        <Link
                          component={RouterLink}
                          color="inherit"
                          to={`/projects/${this.projectId}/interactions/create`}
                        >
                          <Button variant="outlined" color="primary">
                            Create Interaction
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
                      <div style={{ overflowX: "auto" }}>
                        <Table className={classes.table}>
                          <TableHead>
                            <TableRow>
                              <TableCell style={{ minWidth: 180 }}>
                                Name
                              </TableCell>
                              <TableCell style={{ minWidth: 120 }}>
                                Title
                              </TableCell>
                              <TableCell style={{ minWidth: 120 }}>
                                Type
                              </TableCell>
                              <TableCell>Latitude</TableCell>
                              <TableCell>Longitude</TableCell>
                              <TableCell>Contact Info</TableCell>
                              <TableCell>Notes</TableCell>
                              <TableCell style={{ minWidth: 160 }}>
                                Actions
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {this.filter(interactions, search).map(
                              interaction => (
                                <TableRow key={interaction.id}>
                                  <TableCell
                                    component="td"
                                    className={classes.cellDescription}
                                  >
                                    {interaction.name}
                                  </TableCell>
                                  <TableCell>{interaction.title}</TableCell>
                                  <TableCell>{interaction.type}</TableCell>
                                  <TableCell>{interaction.latitude}</TableCell>
                                  <TableCell>{interaction.longitude}</TableCell>
                                  <TableCell>
                                    {interaction.contact_info || "-"}
                                  </TableCell>
                                  <TableCell>
                                    {interaction.notes || "-"}
                                  </TableCell>
                                  <TableCell>
                                    <div>
                                      <Link
                                        component={RouterLink}
                                        color="inherit"
                                        to={`/projects/${this.projectId}/interactions/${interaction.id}`}
                                      >
                                        <IconButton color="primary">
                                          <Edit />
                                        </IconButton>
                                      </Link>
                                      <IconButton
                                        aria-label="Delete"
                                        className={classes.iconDelete}
                                        disabled={loading}
                                        onClick={() =>
                                          this.showModal(
                                            interaction.id,
                                            "open",
                                            "interaction"
                                          )
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
                        <TextEmpty
                          itemName="INTERACTIONS"
                          empty={interactions.length === 0}
                        />
                      </div>
                    </Grid>
                  ) : (
                    <Grid style={{ height: "100%" }}>
                      {enabledMap && (
                        <MapBox
                          projectId={this.projectId}
                          openMenu={openDrawer}
                          tab={value}
                          type={type}
                          enabledMap={enabledMap}
                        />
                      )}
                    </Grid>
                  )}
                  {type === 1 && (
                    <Grid style={{ height: "100%" }}>
                      {enabledMap && (
                        <MapBox
                          projectId={this.projectId}
                          openMenu={openDrawer}
                          tab={value}
                          type={type}
                          enabledMap={enabledMap}
                        />
                      )}
                    </Grid>
                  )}
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
    structures: state.structures.structures,
    spans: state.spans.spans,
    interactions: state.interactions.list,
    deficiencies: state.projects.deficiencies,
    sets: state.sets.list,
    lines: state.lines.list
  };
};

const mapDispatchToProps = {
  getUsersProject,
  getProject,
  updateProject,
  getUsers,
  addUser,
  deleteUser,
  deleteSpan,
  deleteStructure,
  toggleItemMenu,
  selectedItemMenu,
  setLoading,
  setPoint,
  setStructures,
  fetchSets,
  addSet,
  getSet,
  deleteInteraction,
  setFromMap,
  uploadStructures,
  fetchLines,
  deleteStructures
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "ProjectEdit" }),
  connect(mapStateToProps, mapDispatchToProps)
)(ProjectEdit);
