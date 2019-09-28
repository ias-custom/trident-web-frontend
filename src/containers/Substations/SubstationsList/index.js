import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import {
  toggleItemMenu,
  selectedItemMenu
} from "../../../redux/actions/layoutActions";
import {
    getSubstations,
    deleteSubstation
} from "../../../redux/actions/substationActions";
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
  withStyles
} from "@material-ui/core";
import { Edit, Delete } from "@material-ui/icons";
import Layout from "../../../components/Layout/index";
import SimpleBreadcrumbs from "../../../components/SimpleBreadcrumbs";
import Panel from "../../../components/Panel";
import styles from "./styles";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withSnackbar } from "notistack";
import {
  CAN_ADD_SUBSTATION,
  CAN_CHANGE_SUBSTATION,
  CAN_DELETE_SUBSTATION
} from "../../../redux/permissions";

const breadcrumbs = [
  { name: "Home", to: "/home" },
  { name: "Substations", to: null }
];

class SubstationsList extends React.Component {
  state = {
    search: "",
    open: false,
    substationId: null
  };

  componentDidMount() {
    const nameItem = "substations";
    const nameSubItem = "list";
    const open = true;
    this.props.toggleItemMenu({ nameItem, open });
    this.props.selectedItemMenu({ nameItem, nameSubItem });
    //this.props.getSubstations();
  }

  handleSearch = event => {
    this.setState({ search: event.target.value });
  };

  showModal(substationId) {
    this.setState({ open: true, substationId });
  }

  closeModal = () => {
    this.setState({ open: false });
  };
  filter = (users, keyword) => {
    if (keyword === "") return users;

    const fields = ["first_name", "last_name", "email", "username"];
    const regex = new RegExp(keyword, "i");

    return users.filter(user => {
      const obj = { ...user };

      return (
        fields.filter(field => {
          return typeof obj[field] === "string" && obj[field].match(regex);
        }).length > 0
      );
    });
  };

  handleDelete = async () => {
    this.setState({ open: false });
    const response = await this.props.deleteSubstation(this.state.substationId);
    if (response.status === 200 || response.status === 204) {
        // SHOW NOTIFICACION SUCCCESS
        this.props.enqueueSnackbar("¡Substation successfully removed!", {
            variant: "success",
            anchorOrigin: { vertical: "top", horizontal: "center" }
        });
    } else {
        this.props.enqueueSnackbar("¡The request could not be processed!!", {
            variant: "error",
            anchorOrigin: { vertical: "top", horizontal: "center" }
        });
    }
  };

  render() {
    const {
      classes,
      loading,
      is_superuser,
      permissions,
      substations
    } = this.props;
    const canCreateSubstation = permissions.includes(CAN_ADD_SUBSTATION);
    const canChangeSubstation = permissions.includes(CAN_CHANGE_SUBSTATION);
    const canDeleteSubstation = permissions.includes(CAN_DELETE_SUBSTATION);
    const { search, open } = this.state;

    return (
      <Layout title="Substations">
        {() => (
          <div>
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
              If you delete the substation it will be permanently.
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
              <SimpleBreadcrumbs routes={breadcrumbs} classes={{root: classes.breadcrumbs}}/>

              <Panel>
                <div
                  className={
                    canCreateSubstation || is_superuser
                      ? classes.header
                      : classes.headerRight
                  }
                >
                  {canCreateSubstation || is_superuser ? (
                    <Link component={RouterLink} color="inherit" to="/substations/create">
                      <Button variant="outlined" color="primary">
                        Create Substation
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
                      <TableCell align="left">Customer</TableCell>
                      <TableCell align="left">Number</TableCell>
                      <TableCell align="left">Latitude</TableCell>
                      <TableCell align="left">Longitude</TableCell>
                      <TableCell align="left">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.filter(substations, search).map(station => (
                      <TableRow key={station.id}>
                        <TableCell component="th" scope="row">
                          {station.name}
                        </TableCell>
                        <TableCell>{station.customer_name}</TableCell>
                        <TableCell>{station.number}</TableCell>
                        <TableCell>{station.latitude}</TableCell>
                        <TableCell>{station.longitude}</TableCell>
                        <TableCell align="center">
                          <div style={{ display: "flex" }}>
                            {canChangeSubstation || is_superuser ? (
                              <Link component={RouterLink} to={`/substations/${station.id}`}>
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
                                  loading || !canChangeSubstation || !is_superuser
                                }
                              >
                                <Edit />
                              </IconButton>
                            )}
                            <IconButton
                              aria-label="Edit"
                              className={classes.iconDelete}
                              disabled={
                                loading ||
                                (!canDeleteSubstation && !is_superuser)
                              }
                              onClick={() => this.showModal(station.id)}
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
    substations: state.substations.list,
    permissions: state.auth.permissions,
    is_superuser: state.auth.is_superuser
  };
};

const mapDispatchToProps = {
  toggleItemMenu,
  selectedItemMenu,
  getSubstations,
  deleteSubstation
};

export default compose(
  withRouter,
  withStyles(styles, { name: "SubstationsList" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withSnackbar
)(SubstationsList);
