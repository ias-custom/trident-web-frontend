import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
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
  Avatar
} from "@material-ui/core";
import { Edit, Delete } from "@material-ui/icons";
import {
  toggleItemMenu,
  selectedItemMenu
} from "../../../redux/actions/layoutActions";
import {
  getCustomers,
  deleteCustomer
} from "../../../redux/actions/customerActions";
import Layout from "../../../components/Layout/index";
import SimpleBreadcrumbs from "../../../components/SimpleBreadcrumbs";
import Panel from "../../../components/Panel";
import styles from "./styles";
import { withSnackbar } from "notistack";
import { DialogDelete } from "../../../components";

const breadcrumbs = [
  { name: "Home", to: "/home" },
  { name: "Utility", to: null }
];

class CustomersList extends React.Component {
  state = {
    search: "",
    open: false,
    customerId: ""
  };

  componentDidMount() {
    this.props.getCustomers();
    const nameItem = "admin";
    const nameSubItem = "customers";
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
    const response = await this.props.deleteCustomer(this.state.customerId);
    if (response.status === 200 || response.status === 204) {
      // SHOW NOTIFICACION SUCCCESS
      this.props.enqueueSnackbar("Customer successfully removed!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    }
  };

  showModal(customerId) {
    this.setState({ open: true, customerId });
  }

  closeModal = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, customers, loading, customerSelectedId } = this.props;
    const { search, open } = this.state;

    return (
      <Layout title="Utility">
        {() => (
          <div>
            <DialogDelete
              item="utility"
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
                <div className={classes.header}>
                  <Link
                    component={RouterLink}
                    color="inherit"
                    to="/customers/create"
                  >
                    <Button variant="outlined" color="primary">
                      Create Utility
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
                      <TableCell>Name</TableCell>
                      <TableCell>Logo</TableCell>
                      <TableCell colSpan={1}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.filter(customers, search).map(customer => (
                      <TableRow key={customer.id}>
                        <TableCell component="td" style={{ width: "50%" }}>
                          {customer.name}
                        </TableCell>
                        <TableCell component="td" style={{ width: "30%" }}>
                          <Avatar src={customer.thumbnail} />
                        </TableCell>
                        <TableCell>
                          <div style={{ display: "flex" }}>
                            <Link
                              component={RouterLink}
                              to={`/customers/${customer.id}`}
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
                              disabled={
                                loading || customer.id === customerSelectedId
                              }
                              onClick={() => this.showModal(customer.id)}
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
    loading: state.global.loading,
    customers: state.customers.customers,
    customerSelectedId: state.customers.customerSelectedId
  };
};

const mapDispatchToProps = {
  getCustomers,
  deleteCustomer,
  toggleItemMenu,
  selectedItemMenu
};

export default compose(
  withSnackbar,
  withRouter,
  withStyles(styles, { name: "CustomersList" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(CustomersList);
