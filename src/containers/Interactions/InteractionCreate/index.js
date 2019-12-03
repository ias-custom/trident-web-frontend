import React from "react";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { withSnackbar } from "notistack";
import SimpleBreadcrumbs from "../../../components/SimpleBreadcrumbs";
import Layout from "../../../components/Layout/index";
import Panel from "../../../components/Panel";
import { connect } from "react-redux";
import { setLoading } from "../../../redux/actions/globalActions";
import { addInteraction } from "../../../redux/actions/interactionActions";
import { setProjectForMap } from "../../../redux/actions/projectActions";
import {
  toggleItemMenu,
  selectedItemMenu
} from "../../../redux/actions/layoutActions";
import styles from "./styles";
import { Formik } from "formik";
import * as Yup from "yup";
import { FormInteraction } from "../../../components";
import { Grid, Fab } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";

class InteractionCreate extends React.Component {
  state = {
    form: {
      name: "",
      titleId: "",
      typeId: "",
      contactInfo: "",
      latitude: "",
      longitude: "",
      notes: ""
    }
  };

  breadcrumbs = [
    { name: "Home", to: "/home" },
    { name: "Projects", to: "/projects" },
    {
      name: "Project edit",
      to: `/projects/${this.props.match.params.projectId}`
    },
    { name: "Create Interaction", to: null }
  ];

  projectId = this.props.match.params.projectId;

  componentDidMount() {
    const { latitude, longitude } = this.props;
    this.setState(prevState => {
      return { form: { ...prevState.form, latitude, longitude } };
    });
    const nameItem = "interactions";
    const nameSubItem = "create";
    const open = true;
    this.props.toggleItemMenu({ nameItem, open });
    this.props.selectedItemMenu({ nameItem, nameSubItem });
  }

  save = async (values, formikActions) => {
    const { setSubmitting, resetForm } = formikActions;
    this.props.setLoading(true);
    const {
      name,
      typeId,
      titleId,
      latitude,
      longitude,
      notes,
      contactInfo
    } = values;
    const form = {
      name,
      type: typeId,
      title: titleId,
      latitude,
      longitude,
      notes,
      contact_info: contactInfo
    };

    try {
      const response = await this.props.addInteraction(this.projectId, form);

      if (response.status === 201) {
        resetForm();
        this.setState(prevState => {
          return { form: { ...prevState.form, latitude: "", longitude: "" } };
        });
        this.props.enqueueSnackbar("The interaction was added successfully!", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "center" }
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
    const { classes, fromMap } = this.props;
    const { form } = this.state;
    return (
      <Layout title="Create Interaction">
        {() => (
          <div className={classes.root}>
            <SimpleBreadcrumbs
              routes={this.breadcrumbs}
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
                    this.props.history.push(`/projects/${this.projectId}?map=true`)
                  }}
                >
                  <ArrowBack />
                  Back to map
                </Fab>
              </Grid>
            ) : null}
            <Panel>
              <Formik
                onSubmit={this.save}
                validateOnChange
                enableReinitialize
                initialValues={{
                  ...form
                }}
                validationSchema={Yup.object().shape({
                  name: Yup.string().required("Name is required"),
                  titleId: Yup.mixed().required("Title is required"),
                  typeId: Yup.mixed().required("Type is required"),
                  latitude: Yup.string().required("Latitude is required"),
                  longitude: Yup.string().required("Longitude is required"),
                })}
              >
                {props => {
                  const {
                    isSubmitting,
                    values,
                    isValid,
                    dirty,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit
                  } = props;

                  return (
                    <FormInteraction
                      dirty={dirty}
                      values={values}
                      isValid={isValid}
                      touched={touched}
                      errors={errors}
                      isSubmitting={isSubmitting}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      handleSubmit={handleSubmit}
                      projectId={this.projectId}
                      isCreate={true}
                    />
                  );
                }}
              </Formik>
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
    fromMap: state.projects.fromMap
  };
};

const mapDispatchToProps = {
  setLoading,
  toggleItemMenu,
  selectedItemMenu,
  addInteraction,
  setProjectForMap
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "InteractionCreate" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(InteractionCreate);
