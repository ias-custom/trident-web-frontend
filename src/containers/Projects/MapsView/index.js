import React from 'react';
import Layout from '../../../components/Layout';
import Grid from '@material-ui/core/Grid/Grid';
import { withStyles } from '@material-ui/core/styles';
import { compose } from "recompose";
import { connect } from "react-redux";
import {
  toggleItemMenu,
  selectedItemMenu
} from "../../../redux/actions/layoutActions";
import {
  fetchProjects,
  getProject
} from "../../../redux/actions/projectActions";
import styles from './styles';
import { MapBox } from '../../../components';
import { TextField, MenuItem } from '@material-ui/core';

class MapsView extends React.Component {
  state = {
    projectId: ""
  }
  componentDidMount = async () => {
    try {
      await this.props.fetchProjects()
      console.log(this.props.id)
      if (this.props.id) {
        this.setState({projectId: this.props.id})
        this.props.getProject(this.props.id)
      }
      const open = false;
      this.props.toggleItemMenu({ nameItem: "users", open});
      this.props.toggleItemMenu({ nameItem: "roles", open});
      this.props.toggleItemMenu({ nameItem: "customers", open});
      this.props.toggleItemMenu({ nameItem: "projects", open: true});
      this.props.selectedItemMenu({ nameItem: "projects", nameSubItem: "maps" });
    } catch (error) {
      
    }
  }

  render() {
    const { classes, projects, loading } = this.props;
    const { projectId } = this.state;
    return (

      <Layout title="Map View">
        {(open) => (
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
                    this.props.getProject(e.target.value)
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
                <MapBox projectId={projectId} open={open}/>
              ) : null}
              {projectId === "" ? (
                <div className={classes.divEmpty}>
                  SELECT A PROJECT
                </div>
              ) : null}

            </Grid>
          </div>
        )}
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  return {
    loading: state.global.loading,
    projects: state.projects.projects,
    id: state.projects.id
  };
};

const mapDispatchToProps = {
  toggleItemMenu,
  selectedItemMenu,
  fetchProjects,
  getProject
};

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(MapsView);
