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
import { getInteraction, updateInteraction } from "../../../redux/actions/interactionActions";
import {
  toggleItemMenu,
  selectedItemMenu
} from "../../../redux/actions/layoutActions";
import styles from "./styles";
import { Formik } from "formik";
import * as Yup from "yup";
import { FormInteraction } from "../../../components";

class InteractionEdit extends React.Component {
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
    { name: "Edit Interaction", to: null }
  ];

  projectId = this.props.match.params.projectId;
  interactionId = this.props.match.params.interactionId;

  componentDidMount = async () => {
    try {
      const response = await this.props.getInteraction(this.projectId, this.interactionId)
      if (response.status === 200) {
        const {name, title, type, latitude, longitude, contact_info, notes} = response.data
        this.setState({
          form: {
            name,
            titleId: 1, // titleId: title,
            typeId: 1, //typeId:type
            latitude,
            longitude,
            contactInfo: contact_info || "",
            notes
          }
        })
      } else {
        this.props.history.push("/404")
      }
      const nameItem = "interactions";
      const nameSubItem = "edit";
      const open = true;
      this.props.toggleItemMenu({ nameItem, open });
      this.props.selectedItemMenu({ nameItem, nameSubItem });
    } catch (error) {}
  };

  update = async (values, formikActions) => {
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
      const response = await this.props.updateInteraction(this.projectId, this.interactionId, form);

      if (response.status === 200) {
        this.setState({
          formGeneral: {
            name,
            typeId,
            titleId,
            longitude,
            latitude,
            notes,
            contactInfo
          }
        });
        this.props.enqueueSnackbar("The interaction was updated successfully!", {
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
    const { classes } = this.props;
    const { form } = this.state;
    return (
      <Layout title="Edit Interaction">
        {() => (
          <div className={classes.root}>
            <SimpleBreadcrumbs
              routes={this.breadcrumbs}
              classes={{ root: classes.breadcrumbs }}
            />
            <Panel>
              <Formik
                onSubmit={this.update}
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
                  longitude: Yup.string().required("Longitude is required")
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
                      isCreate={false}
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
    longitude: state.projects.longitude
  };
};

const mapDispatchToProps = {
  setLoading,
  toggleItemMenu,
  selectedItemMenu,
  getInteraction,
  updateInteraction
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "InteractionEdit" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(InteractionEdit);
