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
import {
  addStructureLine
} from "../../../redux/actions/LineActions";
import { useState } from "react";

const StructureLineCreate = ({...props}) => {
  const { classes } = props
  const [lineId, setLineId] = useState(props.match.params.lineId)
  const [form, setForm] = useState({
    name: "",
    address: "",
    stateId: 2,
    latitude: "",
    longitude: "",
    structureTypeId: "",
    inspectionId: "",
    number: ""
  })
  const breadcrumbs = [
    { name: "Home", to: "/home" },
    { name: "Lines", to: "/lines" },
    {
      name: "Line edit",
      to: `/lines/${lineId}`
    },
    { name: "Create Structure-Line", to: null }
  ];

  useEffect(() => {
    const nameItem = "lines";
    const nameSubItem = "create";
    const open = true;
    props.toggleItemMenu({ nameItem, open });
    props.selectedItemMenu({ nameItem, nameSubItem });
    return () => {
      
    };
  }, [])

  async function save (values, formikActions) {
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
      const response = await props.addStructureLine(lineId, form);

      if (response.status === 201) {
        resetForm();
        props.enqueueSnackbar("The structure was added successfully!", {
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
  };

  return (
    <Layout title="Create Structure-Line">
      {() => (
        <div className={classes.root}>
          <SimpleBreadcrumbs
            routes={breadcrumbs}
            classes={{ root: classes.breadcrumbs }}
          />
          <Panel>
            <Formik
              onSubmit={save}
              validateOnChange
              enableReinitialize
              initialValues={{
                ...form
              }}
              validationSchema={Yup.object().shape({
                //name: Yup.string().required("Name is required"),
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
                    isCreate
                    forLine
                  />
                );
              }}
            </Formik>
          </Panel>
        </div>
      )}
    </Layout>
  )
}

const mapStateToProps = state => {
  return {
    loading: state.global.loading,
  };
};

const mapDispatchToProps = {
  setLoading,
  toggleItemMenu,
  selectedItemMenu,
  addStructureLine
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "StructureLineCreate" }),
  connect(mapStateToProps, mapDispatchToProps)
)(StructureLineCreate);
