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
import {
  fetchProjects,
  getInfoProject
} from "../../redux/actions/projectActions";
import styles from './styles';
import { MapBox } from '../../components';
import { TextField, MenuItem } from '@material-ui/core';

class Home extends React.Component {
  state = {
    projectId: ""
  }
  componentDidMount () {
    try {
      const open = false;
      this.props.toggleItemMenu({ nameItem: "users", open});
      this.props.toggleItemMenu({ nameItem: "roles", open});
      this.props.toggleItemMenu({ nameItem: "customers", open});
      this.props.selectedItemMenu({ nameItem: "home", nameSubItem: "home" });
      this.props.fetchProjects()
    } catch (error) {
      
    }
  }

  render() {
    const { classes, projects, loading } = this.props;
    const { projectId } = this.state;
    return (

      <Layout title="Dashboard">
        <div className={classes.root}>


          <Grid container spacing={16} style={{height: "100%"}}>
            {/* <Grid item xs={6} sm={3} >
              <Link component={RouterLink} to="/users" className={classes.link}>
                <Card>
                  <CardContent className={classes.card}>
                    <UserIcon className={classes.icon} color="primary" />
                    <Typography component="p" variant="h6">Users</Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid> */}
            <Grid item xs={8} style={{margin: "15px auto"}}>
              <TextField
                name="project_id"
                select
                required
                value={projectId}
                label="Project"
                disabled={loading}
                fullWidth
                onChange={ e => {
                  this.setState({projectId: e.target.value})
                  this.props.getInfoProject(e.target.value)
                }}
              >
                {projects.map(project => {
                return (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                );
              })}
              </TextField>
            </Grid>
            { projectId && !loading ? (
              <MapBox projectId={projectId}/>
            ) : null}
            {projectId === "" ? (
              <div className={classes.divEmpty}>
                SELECT A PROJECT
              </div>
            ) : null}

          </Grid>
        </div>
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  return {
    loading: state.global.loading,
    projects: state.projects.projects
  };
};

const mapDispatchToProps = {
  toggleItemMenu,
  selectedItemMenu,
  fetchProjects,
  getInfoProject
};

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Home);
