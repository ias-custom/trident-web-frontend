import React from 'react';
import { connect } from 'react-redux';
import { compose } from "recompose";
import { Link as RouterLink, withRouter, Redirect } from 'react-router-dom';
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
  Avatar
} from '@material-ui/core';
import { Edit, Delete } from '@material-ui/icons';
import {
  toggleItemMenu,
  selectedItemMenu
} from "../../../redux/actions/layoutActions";
import { getCustomers, deleteCustomer } from "../../../redux/actions/customerActions"
import Layout from '../../../components/Layout/index';
import SimpleBreadcrumbs from '../../../components/SimpleBreadcrumbs';
import Panel from '../../../components/Panel';
import styles from './styles';


const breadcrumbs = [
  {name: 'Home', to: '/home'},
  {name: 'Customers', to: null},
];

class CustomersList extends React.Component {

  state = {
    search: '',
    open: false,
    customerId: ''
  };

  componentDidMount() {
    this.props.getCustomers();
    const nameItem = "customers";
    const nameSubItem = "list";
    const open = true;
    this.props.toggleItemMenu({ nameItem, open });
    this.props.selectedItemMenu({ nameItem, nameSubItem });
  }

  handleSearch = (event) => {
    this.setState({ search: event.target.value });
  }

  filter = (roles, keyword) => {
    if (keyword === '') return roles;

    const fields = ['name'];
    const regex = new RegExp(keyword, 'i');

    return roles.filter(role => {
      const obj = {...role};

      return fields.filter(field => {
        return typeof obj[field] === 'string' && obj[field].match(regex);
      }).length > 0;
    });
  }

  handleDelete = async () => {
    this.setState({open: false})
    const response = await this.props.deleteCustomer(this.state.customerId);
    if(response.status === 200 || response.status === 204) {
      // SHOW NOTIFICACION SUCCCESS
      this.props.enqueueSnackbar('Customer successfully removed!', {
        variant: "success",
        anchorOrigin: {vertical: 'top', horizontal: 'center'}
      })
    }
  }

  showModal (customerId) {
    this.setState({open: true, customerId})
  }

  closeModal = () => {
    this.setState({open: false})
  }


  render() {
    const { classes, customers, loading, is_superuser } = this.props;
    const { search, open } = this.state;

    if (!is_superuser) {
      return <Redirect to="/home" />
    }

    return (
      <Layout title="Roles">
        <Dialog
          open={open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onBackdropClick= {this.closeModal}
          onEscapeKeyDown= {this.closeModal}
        >
          <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              If you delete the role it will be permanently.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" className={classes.buttonCancel} onClick= {this.closeModal}>
              Cancel
            </Button>
            <Button variant="outlined" color="primary" className={classes.buttonAccept} onClick={this.handleDelete}>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
        <div className={classes.root}>
          <SimpleBreadcrumbs routes={breadcrumbs} />

          <Panel>

            <div className={classes.header}>
              <Link component={RouterLink} color="inherit" to="/customers/create">
                <Button variant="outlined" color="primary">Create Customer</Button>
              </Link>

              <Input
                style={{width: 300}}
                defaultValue=""
                className={classes.search}
                inputProps={{
                  placeholder: 'Search...',
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
                {this.filter(customers, search).map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell component="td">
                      {customer.name}
                    </TableCell>
                    <TableCell component="td">
                    <Avatar src={customer.thumbnail}></Avatar>
                    </TableCell>
                    <TableCell>
                      <div style={{display: 'flex'}}>
                        <Link component={RouterLink} to={`/customers/${customer.id}`}>
                          <IconButton aria-label="Edit" color="primary" disabled={loading}>
                            <Edit />
                          </IconButton>
                        </Link>
                        <IconButton aria-label="Delete" className={classes.iconDelete} disabled={loading} onClick={() => this.showModal(customer.id)}
                        >
                          <Delete/>
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
    )
  }
}

const mapStateToProps = state => {
  return {
    loading: state.global.loading,
    customers: state.customers.customers,
    is_superuser: state.auth.is_superuser
  }
};

const mapDispatchToProps = { getCustomers, deleteCustomer, toggleItemMenu, selectedItemMenu };

export default compose(
  withRouter,
  withStyles(styles, {name: 'CustomersList'}),
  connect(mapStateToProps, mapDispatchToProps)
)(CustomersList);
