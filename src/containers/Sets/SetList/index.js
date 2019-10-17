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
  withStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Grid
} from "@material-ui/core";
import { Edit, Delete, FileCopy } from "@material-ui/icons";
import {
  toggleItemMenu,
  selectedItemMenu
} from "../../../redux/actions/layoutActions";
import { deleteSet, fetchSets, duplicateSet } from "../../../redux/actions/setsActions";
import Layout from "../../../components/Layout/index";
import SimpleBreadcrumbs from "../../../components/SimpleBreadcrumbs";
import Panel from "../../../components/Panel";
import styles from "./styles";
import {
  CAN_ADD_SET,
  CAN_CHANGE_SET,
  CAN_DELETE_SET
} from "../../../redux/permissions";

const breadcrumbs = [{ name: "Home", to: "/home" }, { name: "Sets", to: null }];

class SetList extends React.Component {
  state = {
    search: "",
    open: false,
    openDuplicate: false,
    setId: "",
    name: ""
  };

  componentDidMount() {
    try {
      this.props.fetchSets();
      const nameItem = "sets";
      const nameSubItem = "list";
      const open = true;
      this.props.toggleItemMenu({ nameItem, open });
      this.props.selectedItemMenu({ nameItem, nameSubItem });
    } catch (error) {
      console.log(error)
    }
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
    const response = await this.props.deleteSet(this.state.setId);
    if (response.status === 200 || response.status === 204) {
      // SHOW NOTIFICACION SUCCCESS
      this.props.enqueueSnackbar("Set successfully removed!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    }
  };

  showModal(setId) {
    this.setState({ open: true, setId });
  }

  closeDuplicate() {
    this.setState({name: "", openDuplicate: false})
  }

  duplicateSet = async () => {
    const { name, setId } = this.state
    const form = {
      name,
      id: setId
    }
    this.setState({name: "", openDuplicate: false})

    const response = await this.props.duplicateSet(form)
    if (response.status === 201) {
      this.props.enqueueSnackbar("Set successfully duplicated!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    } else {
      this.props.enqueueSnackbar("The request could not be processed!", {
        variant: "error"
      });
    }
  }

  render() {
    const { classes, loading, is_superuser, permissions, sets } = this.props;
    const canCreateSet = permissions.includes(CAN_ADD_SET);
    const canChangeSet = permissions.includes(CAN_CHANGE_SET);
    const canDeleteSet = permissions.includes(CAN_DELETE_SET);
    const { search, open, openDuplicate, name } = this.state;

    return (
      <Layout title="Sets">
        {() => (
          <div>
            <Dialog
              open={open}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              onBackdropClick={() => !loading ? this.setState({open: false}) : null}
              onEscapeKeyDown={() => !loading ? this.setState({open: false}) : null}
            >
              <DialogTitle id="alert-dialog-title">
                {"Are you sure you want to delete?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  If you delete the set it will be permanently.
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
            <Dialog
              open={openDuplicate}
              classes={{paper: classes.dialog}}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              onBackdropClick={() => !loading ? this.closeDuplicate() : null}
              onEscapeKeyDown={() => !loading ? this.closeDuplicate() : null}
            >
              <DialogTitle id="alert-dialog-title">
                {"Duplicate Set"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Enter the new set name.
                </DialogContentText>
                <Grid>
                  <TextField
                    name="name"
                    label="Name"
                    value={name}
                    disabled={loading}
                    onChange={e => this.setState({name: e.target.value})}
                    fullWidth
                  />
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="outlined"
                  className={classes.buttonCancel}
                  onClick={this.closeDuplicate}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.buttonAccept}
                  onClick={this.duplicateSet}
                  disabled={loading || name === ""}
                >
                  Agree
                </Button>
              </DialogActions>
            </Dialog>
            <div className={classes.root}>
              <SimpleBreadcrumbs
                routes={breadcrumbs}
                classes={{ root: classes.breadcrumbs }}
              />

              <Panel>
                <div
                  className={
                    canCreateSet || is_superuser
                      ? classes.header
                      : classes.headerRight
                  }
                >
                  {canCreateSet || is_superuser ? (
                    <Link
                      component={RouterLink}
                      color="inherit"
                      to="/sets/create"
                    >
                      <Button variant="outlined" color="primary">
                        Create Set
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
                    {this.filter(sets, search).map(set => (
                      <TableRow key={set.id}>
                        <TableCell component="td" style={{ width: "80%" }}>
                          {set.name}
                        </TableCell>
                        <TableCell>
                          <div style={{ display: "flex" }}>
                            {canChangeSet || is_superuser ? (
                              <Link
                                component={RouterLink}
                                to={`/sets/${set.id}`}
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
                                  loading || !canChangeSet || !is_superuser
                                }
                              >
                                <Edit />
                              </IconButton>
                            )}
                            <IconButton
                              aria-label="Delete"
                              className={classes.iconDelete}
                              disabled={
                                loading || (!canDeleteSet && !is_superuser)
                              }
                              onClick={() => this.showModal(set.id)}
                            >
                              <Delete />
                            </IconButton>
                            <IconButton
                              aria-label="Duplicate"
                              className={classes.iconCopy}
                              disabled={
                                loading
                              }
                              onClick={() => this.setState({openDuplicate: true, setId: set.id})}
                            >
                              <FileCopy />
                            </IconButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
    sets: state.sets.list,
    permissions: state.auth.permissions,
    is_superuser: state.auth.is_superuser
  };
};

const mapDispatchToProps = {
  fetchSets,
  deleteSet,
  duplicateSet,
  toggleItemMenu,
  selectedItemMenu
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "SetList" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SetList);
