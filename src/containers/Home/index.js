import React from 'react';
import Layout from '../../components/Layout';
import Typography from '@material-ui/core/Typography/Typography';
import Card from '@material-ui/core/Card/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid/Grid';
import UserIcon from '@material-ui/icons/GroupOutlined';
import { withStyles } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom'
import Link from '@material-ui/core/Link';
import { compose } from "recompose";
import { connect } from "react-redux";
import {
  toggleItemMenu,
  selectedItemMenu
} from "../../redux/actions/layoutActions";
import styles from './styles';

class Home extends React.Component {

  componentDidMount () {
    const open = false;
    this.props.toggleItemMenu({ nameItem: "users", open});
    this.props.toggleItemMenu({ nameItem: "roles", open});
    this.props.toggleItemMenu({ nameItem: "customers", open});
    this.props.selectedItemMenu({ nameItem: "home", nameSubItem: "home" });
  }

  render() {
    const { classes } = this.props;

    return (

      <Layout title="Dashboard">
        <div className={classes.root}>


          <Grid container spacing={16}>
            <Grid item xs={6} sm={3} >
              <Link component={RouterLink} to="/users" className={classes.link}>
                <Card>
                  <CardContent className={classes.card}>
                    <UserIcon className={classes.icon} color="primary" />
                    <Typography component="p" variant="h6">Users</Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>

          </Grid>
        </div>
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = {
  toggleItemMenu,
  selectedItemMenu
};

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Home);
