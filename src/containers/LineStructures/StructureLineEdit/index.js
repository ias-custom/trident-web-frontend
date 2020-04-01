import React, { useEffect } from "react";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
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
import { Formik } from "formik";
import * as Yup from "yup";
import { FormStructureEdit } from "../../../components";
import { updateStructureLine, getStructureLine } from "../../../redux/actions/LineActions";
import { useState } from "react";

const StructureLineEdit = ({ ...props }) => {
  const { classes } = props;
  const structureId = props.match.params.structureId;
  const lineId = props.match.params.lineId;
  const [form, setForm] = useState({
    name: "",
    address: "",
    stateId: 2,
    latitude: "",
    longitude: "",
    structureTypeId: "",
    inspectionId: "",
    number: ""
  });
  const breadcrumbs = [
    { name: "Home", to: "/home" },
    { name: "Lines", to: "/lines" },
    {
      name: "Line edit",
      to: `/lines/${lineId}`
    },
    { name: "Edit Structure-Line", to: null }
  ];

  useEffect(() => {
    const nameItem = "lines";
    const nameSubItem = "edit";
    const open = true;
    props.toggleItemMenu({ nameItem, open });
    props.selectedItemMenu({ nameItem, nameSubItem });
    async function getStructure() {
      const response = await props.getStructureLine(lineId, structureId);
      if (response.status === 200) {
        console.log(response.data)
        setForm({...response.data, inspectionId: response.data.inspection_id, stateId: 2});
      } else {
        props.history.push("/404");
      }
    }
    getStructure();
    return () => {};
  }, []);

  async function update(values, formikActions) {
    const { setSubmitting, resetForm } = formikActions;
    props.setLoading(true);
    const {
      name,
      stateId,
      latitude,
      longitude,
      structureTypeId,
      address,
      inspectionId,
      number
    } = values;
    const form = {
      name,
      state_id: stateId,
      latitude,
      longitude,
      type_structure_id: structureTypeId,
      address,
      inspection_id: inspectionId,
      number
    };

    try {
      const response = await props.updateStructureLine(lineId, structureId, form);

      if (response.status === 200) {
        resetForm({...values});
        props.enqueueSnackbar("The structure was updated successfully!", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "center" }
        });
      } else {
        props.enqueueSnackbar("The request could not be processed!", {
          variant: "error"
        });
      }
    } catch (error) {
      props.enqueueSnackbar(error.message, { variant: "error" });
    }
    setSubmitting(false);
    props.setLoading(false);
  }

  return (
    <Layout title="Edit Structure-Line">
      {() => (
        <div className={classes.root}>
          <SimpleBreadcrumbs
            routes={breadcrumbs}
            classes={{ root: classes.breadcrumbs }}
          />
          <Panel>
            <Formik
              onSubmit={update}
              validateOnChange
              enableReinitialize
              initialValues={{
                ...form
              }}
              validationSchema={Yup.object().shape({
                name: Yup.string().required("Name is required"),
                stateId: Yup.mixed().required("State is required"),
                latitude: Yup.number()
                  .lessThan(91, "The value must be between -90 and 90")
                  .moreThan(-91, "The value must be between -90 and 90")
                  .required("Latitude is required"),
                longitude: Yup.number()
                  .lessThan(91, "The value must be between -90 and 90")
                  .moreThan(-91, "The value must be between -90 and 90")
                  .required("Longitude is required"),
                number: Yup.string().required("Number is required"),
                inspectionId: Yup.mixed().required(
                  "Inspection is required"
                ),
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
                  <FormStructureEdit
                    dirty={dirty}
                    values={values}
                    isValid={isValid}
                    touched={touched}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    handleSubmit={handleSubmit}
                    isCreate={false}
                    forLine
                  />
                );
              }}
            </Formik>
          </Panel>
        </div>
      )}
    </Layout>
  );
};

const mapStateToProps = state => {
  return {
    loading: state.global.loading
  };
};

const mapDispatchToProps = {
  setLoading,
  toggleItemMenu,
  selectedItemMenu,
  updateStructureLine,
  getStructureLine
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "StructureLineEdit" }),
  connect(mapStateToProps, mapDispatchToProps)
)(StructureLineEdit);
