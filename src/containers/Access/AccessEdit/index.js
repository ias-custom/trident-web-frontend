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
import { FormAccess } from "../../../components";

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
  };

  spanId = this.props.match.params.spanId;
  accessId = this.props.match.params.accessId;
  componentDidMount = async () => {
    try {
      const response = await this.props.getAccessDetail(this.spanId, this.accessId);
      if (response.status === 200) {
        this.props.fetchSpans(this.projectId);
        this.setState(prevState => {
          return {
            form: {
              ...response.data
            }
          }
        })
      } else {
        this.props.history.push("/404");
      }
      const nameItem = "access";
      const nameSubItem = "edit";
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
            <FormAccess isCreate={false} form={form} accessId={this.accessId}/>
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
