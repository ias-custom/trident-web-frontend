import React from "react";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { withSnackbar } from "notistack";
import SimpleBreadcrumbs from "../../../components/SimpleBreadcrumbs";
import Layout from "../../../components/Layout/index";
import { connect } from "react-redux";
import {
  toggleItemMenu,
  selectedItemMenu
} from "../../../redux/actions/layoutActions";
import styles from "./styles";
import { getMarking, fetchSpans, updateMarking } from "../../../redux/actions/spanActions";
import { FormMarking, Panel, PhotosList } from "../../../components";

class MarkingEdit extends React.Component {
  state = {
    form: {
      type_id: "",
      owner: "",
      notes: "",
      longitude: "",
      latitude: "",
      category_id: "",
      span_id: ""
    },
    photos: []
  };

  projectId = this.props.match.params.projectId;
  markingId = this.props.match.params.markingId;

  componentDidMount = async () => {
    try {
      this.props.fetchSpans(this.projectId);
      this.loadData();
      const nameItem = "markings";
      const nameSubItem = "edit";
      const open = true;
      this.props.toggleItemMenu({ nameItem, open });
      this.props.selectedItemMenu({ nameItem, nameSubItem });
    } catch (error) {}
  };

  loadData = async () => {
    const response = await this.props.getMarking(this.props.spanId, this.markingId);
    console.log(response.data)
    if (response.status === 200) {
      this.setState(prevState => {
        return {
          form: {
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
    const { classes } = this.props;
    const { form, photos } = this.state;

    return (
      <Layout title="Edit Crossing">
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
                { name: "Edit Crossing", to: null }
              ]}
              classes={{ root: classes.breadcrumbs }}
            />
            <FormMarking
              form={form}
              isCreate={false}
              markingId={this.markingId}
            />
            <hr/>
            <Panel>
              <PhotosList
              photos={photos}  
              action={"crossing"}
              itemId={parseInt(this.markingId)}
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
    spans: state.spans.spans,
    spanId: state.spans.spanId,
  };
};

const mapDispatchToProps = {
  toggleItemMenu,
  selectedItemMenu,
  getMarking,
  fetchSpans,
  updateMarking
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "MarkingEdit" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(MarkingEdit);
