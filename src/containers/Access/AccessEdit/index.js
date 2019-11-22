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
import { getAccessDetail, fetchSpans } from "../../../redux/actions/spanActions";
import { setProjectForMap } from "../../../redux/actions/projectActions";
import { ArrowBack } from "@material-ui/icons";
import { FormAccess, PhotosList, Panel } from "../../../components";

class AccessEdit extends React.Component {
  state = {
    form: {
      type_id: "",
      category_id: "",
      notes: "",
      longitude: "",
      latitude: "",
      span_id: ""
    },
    photos: []
  };

  projectId = this.props.match.params.projectId;
  accessId = this.props.match.params.accessId;
  componentDidMount = async () => {
    try {
      this.props.fetchSpans(this.projectId);
      this.loadData();
      const nameItem = "access";
      const nameSubItem = "edit";
      const open = true;
      this.props.toggleItemMenu({ nameItem, open });
      this.props.selectedItemMenu({ nameItem, nameSubItem });
    } catch (error) {}
  };

  loadData = async () => {
    const response = await this.props.getAccessDetail(this.props.spanId, this.accessId);
      if (response.status === 200) {
        this.setState(prevState => {
          return {
            form: {
              ...prevState.form,
              ...response.data
            },
            photos: response.data.photos
          }
        })
      } else {
        this.props.history.push("/404");
      }
  }

  render() {
    const { classes, fromMap } = this.props;
    const { form, photos } = this.state;

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
                { name: "Edit Access", to: null }
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
            <FormAccess isCreate={false} form={form} accessId={this.accessId}/>
            <hr/>
            <Panel>
              <PhotosList
              photos={photos}  
              action={"access"}
              itemId={parseInt(this.accessId)}
              reload={() => this.loadData()}/>
            </Panel>
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
  getAccessDetail,
  fetchSpans,
  setProjectForMap
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "AccessEdit" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(AccessEdit);
