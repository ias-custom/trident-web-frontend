import React from "react";
import {
  Grid,
  TextField,
  Button,
} from "@material-ui/core";
import { compose } from "recompose";
import { withRouter, Prompt } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { withSnackbar } from "notistack";
import SimpleBreadcrumbs from "../../../components/SimpleBreadcrumbs";
import Layout from "../../../components/Layout/index";
import Panel from "../../../components/Panel";
import { connect } from "react-redux";
import { setLoading } from "../../../redux/actions/globalActions";
import {
  toggleItemMenu,
  selectedItemMenu
} from "../../../redux/actions/layoutActions";
import styles from "./styles";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { createCustomer } from "../../../redux/actions/customerActions";
import {
  getInspectionsProject,
} from "../../../redux/actions/projectActions";
import {
  getSet,
} from "../../../redux/actions/setsActions";
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
    categories: [],
    inspections: []
  };

  form = {
    name: ""
  };
  setId = null
  componentDidMount = async () => {
    try {
      const nameItem = "sets";
      const nameSubItem = "edit";
      const open = true;
      this.props.toggleItemMenu({ nameItem, open });
      this.props.selectedItemMenu({ nameItem, nameSubItem });
      this.setId = this.props.match.params.id
      /* const response = await this.props.getSet(this.setId)
      if (response.status === 200) {
        this.loadForm(response.data);
      } else {
        this.props.history.push("/404");
      } */
      await this.props.getInspectionsProject(2);
      this.setState({enabledSet: true})
    } catch (error) {}
  }

  loadForm = data => {
    const { name, inspections, categories } = data;
    this.setState({name, inspections, categories, enabledSet: true});
  };

  handleSubmit = async (values, formikActions) => {
    const { setSubmitting, resetForm } = formikActions;
    this.props.setLoading(true);
    const { name, logo } = values;

    let formData = new FormData();
    formData.append("name", name);
    formData.append("logo", logo);

    try {
      const response = await this.props.createCustomer(formData);

      if (response.status === 201) {
        resetForm();
        this.props.history.push("/sets");
        this.props.enqueueSnackbar("The set has been created!", {
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
    setSubmitting(false);
    this.props.setLoading(false);
  };


  render() {
    const { classes, inspections, categories_project } = this.props;
    const { enabledSet, name, categories } = this.state;

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
                    <SetInspections inspections={inspections} categories={categories_project} name="" action={(categories, inspections, name) => console.log(categories, inspections, name)}/>
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
    inspections: state.projects.inspections,
    categories_project: state.projects.categories_project
  };
};

const mapDispatchToProps = {
  setLoading,
  toggleItemMenu,
  selectedItemMenu,
  createCustomer,
  getInspectionsProject,
  getSet
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
