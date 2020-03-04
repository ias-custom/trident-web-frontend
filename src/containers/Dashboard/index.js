import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { connect } from "react-redux";
import {
  withStyles,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Input,
  Link
} from "@material-ui/core";
import { withSnackbar } from "notistack";
import { withRouter } from "react-router-dom";
import styles from "./styles";
import { compose } from "recompose";
import { Layout, SimpleBreadcrumbs, Panel, TextEmpty } from "../../components";
import { fetchProjects } from "../../redux/actions/projectActions";
import { selectedItemMenu } from "../../redux/actions/layoutActions";

const Dashboard = ({ ...props }) => {
  const { classes, projects, loading } = props;
  const [search, setSearch] = useState("");
  const breadcrumbs = [
    { name: "Home", to: "/home" },
    { name: " Project Dashboard", to: null }
  ];

  useEffect(() => {
    props.fetchProjects();
    const nameItem = "dashboard";
    const nameSubItem = "main";
    props.selectedItemMenu({ nameItem, nameSubItem });
    return () => {};
  }, []);

  function filter() {
    if (search === "") return projects;

    return projects.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  return (
    <Layout title="Project Dashboard">
      {() => (
        <div>
          <SimpleBreadcrumbs
            routes={breadcrumbs}
            classes={{ root: classes.breadcrumbs }}
          />
          <Panel>
            <div className={classes.header}>
              <Input
                style={{ width: 300 }}
                defaultValue=""
                inputProps={{
                  placeholder: "Search project...",
                  onChange: e => {
                    setSearch(e.target.value);
                  }
                }}
              />
            </div>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "30%" }}>Name</TableCell>
                  <TableCell style={{ width: "25%" }}>Type</TableCell>
                  <TableCell style={{ width: "25%" }}>State</TableCell>
                  <TableCell style={{ width: "20%" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              {!loading && (
                <TableBody>
                  {filter().map(project => (
                    <TableRow key={project.id}>
                      <TableCell component="td">{project.name}</TableCell>
                      <TableCell>
                        {project.inspection_name || "Constructability"}
                      </TableCell>
                      <TableCell>
                        {project.state ? project.state.name : "-"}
                      </TableCell>
                      <TableCell>
                        <Link
                          component={RouterLink}
                          to={`/projects/${project.id}/map`}
                        >
                          <IconButton aria-label="Edit" color="primary">
                            <i
                              className={`fas fa-map-marked-alt ${classes.map}`}
                            ></i>
                          </IconButton>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
            <TextEmpty itemName="PROJECTS" empty={projects.length === 0} />
          </Panel>
        </div>
      )}
    </Layout>
  );
};

const mapStateToProps = state => {
  return {
    projects: state.projects.projects,
    loading: state.global.loading
  };
};

const mapDispatchToProps = {
  fetchProjects,
  selectedItemMenu
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(Dashboard);
