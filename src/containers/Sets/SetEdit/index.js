import React from "react";
import { Grid } from "@material-ui/core";
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
import { getSet, updateSet } from "../../../redux/actions/setsActions";
import { SetInspections } from "../../../components";

const breadcrumbs = [
  { name: "Home", to: "/home" },
  { name: "Sets", to: "/sets" },
  { name: "Edit Set", to: null }
];

class SetEdit extends React.Component {
  state = {
    openId: "",
    enabledSet: false,
    name: "",
    inspections: []
  };
  
  setId = null;

  componentDidMount = async () => {
    try {
      const nameItem = "sets";
      const nameSubItem = "edit";
      const open = true;
      this.props.toggleItemMenu({ nameItem, open });
      this.props.selectedItemMenu({ nameItem, nameSubItem });
      this.setId = this.props.match.params.id;
      const response = await this.props.getSet(this.setId);
      if (response.status === 200) {
        this.loadForm(response.data);
      } else {
        this.props.history.push("/404");
      }
      await this.props.getInspectionsProject(2);
      this.setState({ enabledSet: true });
    } catch (error) {}
  };

  loadForm = data => {
    const { name, inspections } = data;
    this.setState({ name, inspections, enabledSet: true });
  };

  updateSet = async (inspections, name) => {
    const form = {
      inspections,
      name
    }

    try {
      const response = await this.props.updateSet(this.setId, form);

      if (response.status === 200) {
        this.props.history.push("/sets");
        this.props.enqueueSnackbar("The set has been updated!", {
          variant: "success"
        });
      } else {
        this.props.enqueueSnackbar("The request could not be processed!", {
          variant: "error"
        });
      }
    } catch (error) {
      this.props.enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  render() {
    const { classes } = this.props;
    const { enabledSet, inspections, name } = this.state;

    return (
      <Layout title="Edit Set">
        {() => (
          <div className={classes.root}>
            <SimpleBreadcrumbs
              routes={breadcrumbs}
              classes={{ root: classes.breadcrumbs }}
            />
            <Grid container>
              <Grid item sm={12} md={12}>
                {enabledSet ? (
                  <SetInspections
                    inspections={inspections}
                    name={name}
                    isCreate={false}
                    action={(inspections, name) =>
                      this.updateSet(inspections, name)
                    }
                  />
                ) : null}
              </Grid>
            </Grid>
          </div>
        )}
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.global.loading
  };
};

const mapDispatchToProps = {
  setLoading,
  toggleItemMenu,
  selectedItemMenu,
  getSet,
  updateSet
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "SetEdit" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SetEdit);
