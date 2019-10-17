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
import { getDefaultSet, createSet } from "../../../redux/actions/setsActions";
import { SetInspections } from "../../../components";

const breadcrumbs = [
  { name: "Home", to: "/home" },
  { name: "Sets", to: "/sets" },
  { name: "Create Set", to: null }
];

class SetCreate extends React.Component {
  state = {
    openId: "",
    enabledSet: false
  };

  componentDidMount = async () => {
    try {
      const nameItem = "sets";
      const nameSubItem = "create";
      const open = true;
      this.props.toggleItemMenu({ nameItem, open });
      this.props.selectedItemMenu({ nameItem, nameSubItem });
      await this.props.getDefaultSet();
      this.setState({ enabledSet: true });
    } catch (error) {}
  };


  saveSet = async (inspections, deficiencies, name) => {
    const form = {
      inspections: inspections.map(({ name, categories }) => {
        return {
          name: name,
          categories: categories.map(({ name, items }) => {
            return {
              name,
              items: items.map(({ name }) => {
                return {
                  name
                };
              })
            };
          })
        };
      }),
      deficiencies: deficiencies.map(({ name }) => {
        return {
          name
        };
      }),
      name
    };
    try {
      const response = await this.props.createSet(form);

      if (response.status === 201) {
        this.props.enqueueSnackbar("The set has been created!", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "center" }
        });
        this.props.history.push("/sets");
      } else {
        this.props.enqueueSnackbar("The request could not be processed!", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" }
        });
      }
    } catch (error) {
      this.props.enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  render() {
    const { classes, inspections, deficiencies } = this.props;
    const { enabledSet } = this.state;

    return (
      <Layout title="Create Set">
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
                    deficiencies={deficiencies}
                    name=""
                    isCreate={true}
                    action={(inspections, deficiencies, name) =>
                      this.saveSet(inspections, deficiencies, name)
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
    loading: state.global.loading,
    inspections: state.sets.inspections,
    deficiencies: state.sets.deficiencies
  };
};

const mapDispatchToProps = {
  setLoading,
  toggleItemMenu,
  selectedItemMenu,
  createSet,
  getDefaultSet
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "SetCreate" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SetCreate);
