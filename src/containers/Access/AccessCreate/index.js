import React from "react";
import { Grid, Fab } from "@material-ui/core";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { withSnackbar } from "notistack";
import SimpleBreadcrumbs from "../../../components/SimpleBreadcrumbs";
import Layout from "../../../components/Layout/index";
import { connect } from "react-redux";
import { setLoading } from "../../../redux/actions/globalActions";
import {
  toggleItemMenu,
  selectedItemMenu
} from "../../../redux/actions/layoutActions";
import styles from "./styles";
import { addAccess, fetchSpans } from "../../../redux/actions/spanActions";
import { setProjectForMap } from "../../../redux/actions/projectActions";
import { ArrowBack } from "@material-ui/icons";
import { FormAccess } from "../../../components";

class AccessCreate extends React.Component {
  state = {
    form: {
      type_id: "",
      category_id: "",
      notes: "",
      longitude: "",
      latitude: "",
      span_id: ""
    },
  };

  projectId = this.props.match.params.projectId;
  componentDidMount = async () => {
    try {
      const { latitude, longitude, spanId } = this.props;
      this.setState(prevState => {
        return {
          form: { ...prevState.form, latitude, longitude, span_id: spanId },
          span_id: spanId
        };
      });
      const response = await this.props.fetchSpans(this.projectId);
      if (response.status === 200) {
        if (response.data.length > 0) {
          if (spanId === "") 
            this.setState(prevState => {
              return {
                form: { ...prevState.form, span_id: response.data[0].id }
              };
            });
        } else {
          this.props.history.push(
            `/projects/${this.projectId}/spans/${this.state.form.span_id}`
          );
        }
      } else {
        this.props.history.push("/404");
      }
      this.props.getAccessTypes(this.projectId);
      const nameItem = "structures";
      const nameSubItem = "create";
      const open = true;
      this.props.toggleItemMenu({ nameItem, open });
      this.props.selectedItemMenu({ nameItem, nameSubItem });
    } catch (error) {}
  };

  render() {
    const { classes, fromMap } = this.props;
    const { form } = this.state;

    return (
      <Layout title="Create Access">
        {() => (
          <div className={classes.root}>
            <SimpleBreadcrumbs
              routes={[
                { name: "Home", to: "/home" },
                { name: "Projects", to: "/projects" },
                {
                  name: "Project edit",
                  to: `/projects/${this.props.match.params.projectId}`
                },
                {
                  name: "Span edit",
                  to: `/projects/${this.props.match.params.projectId}/spans/${form.span_id}`
                },
                { name: "Create Access", to: null }
              ]}
              classes={{ root: classes.breadcrumbs }}
            />
            {fromMap ? (
              <Grid container justify="flex-end">
                <Fab
                  variant="extended"
                  aria-label="Back"
                  color="primary"
                  className={classes.buttonBack}
                  onClick={() => {
                    this.props.setProjectForMap(this.projectId)
                    this.props.history.push(`/projects/maps-view`)
                  }}
                >
                  <ArrowBack />
                  Back to map
                </Fab>
              </Grid>
            ) : null}
            <FormAccess isCreate={true} form={form}/>
          </div>
        )}
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.global.loading,
    latitude: state.projects.latitude,
    longitude: state.projects.longitude,
    spans: state.spans.spans,
    spanId: state.spans.spanId,
    fromMap: state.projects.fromMap
  };
};

const mapDispatchToProps = {
  setLoading,
  toggleItemMenu,
  selectedItemMenu,
  addAccess,
  fetchSpans,
  setProjectForMap
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "AccessCreate" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AccessCreate);
