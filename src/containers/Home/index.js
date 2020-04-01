import React from "react";
import Layout from "../../components/Layout";
import Typography from "@material-ui/core/Typography/Typography";
import Card from "@material-ui/core/Card/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid/Grid";
import UserIcon from "@material-ui/icons/GroupOutlined";
import { withStyles } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";
import { compose } from "recompose";
import ProjectIcon from "@material-ui/icons/Work";
import { connect } from "react-redux";
import BusinessIcon from '@material-ui/icons/Business'
import CustomersIcon from "@material-ui/icons/HowToReg";
import RolesIcon from "@material-ui/icons/AssignmentInd";
import {
  toggleItemMenu,
  selectedItemMenu
} from "../../redux/actions/layoutActions";
import styles from "./styles";
import {
  CAN_VIEW_USER,
  CAN_VIEW_ROLE,
  CAN_VIEW_PROJECT,
  CAN_VIEW_SUBSTATION,
  CAN_VIEW_SET
} from "../../redux/permissions";
import { FolderOpen } from "@material-ui/icons";

class Home extends React.Component {
  state = {
    projectId: ""
  };
  componentDidMount() {
    try {
      this.props.selectedItemMenu({ nameItem: "menu", nameSubItem: "apps" });
    } catch (error) {}
  }

  render() {
    const { classes, permissions, is_superuser } = this.props;
    return (
      <Layout title="Menu">
        {open => (
          <div className={classes.root}>
            <Grid container spacing={16} className={classes.divFirst}>
              {(permissions.includes(CAN_VIEW_USER) || is_superuser) && (
                <Grid item xs={6} sm={4}>
                  <Link
                    component={RouterLink}
                    to="/users"
                    className={classes.link}
                  >
                    <Card>
                      <CardContent className={classes.card}>
                        <UserIcon className={classes.icon} color="primary" />
                        <Typography component="p" variant="h6">
                          Users
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              )}
              {(permissions.includes(CAN_VIEW_ROLE) || is_superuser) && (
                <Grid item xs={6} sm={4}>
                  <Link
                    component={RouterLink}
                    to="/roles"
                    className={classes.link}
                  >
                    <Card>
                      <CardContent className={classes.card}>
                        <RolesIcon className={classes.icon} color="primary" />
                        <Typography component="p" variant="h6">
                          Roles
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              )}
              {is_superuser && (
                <Grid item xs={6} sm={4}>
                  <Link
                    component={RouterLink}
                    to="/customers"
                    className={classes.link}
                  >
                    <Card>
                      <CardContent className={classes.card}>
                        <CustomersIcon
                          className={classes.icon}
                          color="primary"
                        />
                        <Typography component="p" variant="h6">
                          Utility
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              )}
              {(permissions.includes(CAN_VIEW_PROJECT) || is_superuser) && (
                <Grid item xs={6} sm={4}>
                  <Link
                    component={RouterLink}
                    to="/projects"
                    className={classes.link}
                  >
                    <Card>
                      <CardContent className={classes.card}>
                        <ProjectIcon className={classes.icon} color="primary" />
                        <Typography component="p" variant="h6">
                          Project Setup
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              )}
              {(permissions.includes(CAN_VIEW_SUBSTATION) || is_superuser) && (
                <Grid item xs={6} sm={4}>
                  <Link
                    component={RouterLink}
                    to="/substations"
                    className={classes.link}
                  >
                    <Card>
                      <CardContent className={classes.card}>
                        <BusinessIcon className={classes.icon} color="primary" />
                        <Typography component="p" variant="h6">
                          Substations
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              )}
              {(permissions.includes(CAN_VIEW_SET) || is_superuser) && (
                <Grid item xs={6} sm={4}>
                  <Link
                    component={RouterLink}
                    to="/sets"
                    className={classes.link}
                  >
                    <Card>
                      <CardContent className={classes.card}>
                        <FolderOpen className={classes.icon} color="primary" />
                        <Typography component="p" variant="h6">
                          Sets
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              )}
            </Grid>
          </div>
        )}
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.global.loading,
    permissions: state.auth.permissions,
    is_superuser: state.auth.is_superuser
  };
};

const mapDispatchToProps = {
  toggleItemMenu,
  selectedItemMenu
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(Home);
