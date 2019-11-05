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
import { FormMarking } from "../../../components";

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
    }
  };

  spanId = this.props.match.params.spanId;
  markingId = this.props.match.params.markingId;

  componentDidMount = async () => {
    try {
      const response = await this.props.getMarking(this.spanId, this.markingId);
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
      const nameItem = "markings";
      const nameSubItem = "edit";
      const open = true;
      this.props.toggleItemMenu({ nameItem, open });
      this.props.selectedItemMenu({ nameItem, nameSubItem });
    } catch (error) {}
  };

  render() {
    const { classes } = this.props;
    const { form } = this.state;

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
