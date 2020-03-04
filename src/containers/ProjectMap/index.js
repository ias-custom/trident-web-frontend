import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  withStyles, Grid,
} from "@material-ui/core";
import { withSnackbar } from "notistack";
import { withRouter } from "react-router-dom";
import styles from "./styles";
import { compose } from "recompose";
import { Layout, SimpleBreadcrumbs, MapBox } from "../../components";
import { getProject } from "../../redux/actions/projectActions";

const ProjectMap = ({ ...props }) => {
  const { classes } = props;
  const projectId = props.match.params.id
  const [type, setType] = useState("")
  const breadcrumbs = [
    { name: "Home", to: "/home" },
    { name: " Project Dashboard", to: "/projects/dashboard" },
    { name: " Project Map", to: null }
  ];

  useEffect(() => {
    async function detailProject() {
      const response = await props.getProject(projectId);
      if (response.status === 200) {
        setType(response.data.inspection_id)
      }
    }
    detailProject();
    return () => {};
  }, []);

  return (
    <Layout title="Project Map">
      {openDrawer => (
        <div>
          <SimpleBreadcrumbs
            routes={breadcrumbs}
            classes={{ root: classes.breadcrumbs }}
          />
          <Grid style={{ height: "calc(100vh - 160px)" }}>
            {type !== "" && <MapBox
              projectId={projectId}
              openMenu={openDrawer}
              tab={type === 1 ? 5 : 4}
              type={type}
              enabledMap
            />}
          </Grid>
          
        </div>
      )}
    </Layout>
  );
};

const mapStateToProps = state => {
  return {
    loading: state.global.loading
  };
};

const mapDispatchToProps = {
  getProject,
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(ProjectMap);
