import React, { useState } from "react";
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
import { createLine } from "../../../redux/actions/LineActions";
import styles from "./styles";
import { FormLine } from "../../../components";

const breadcrumbs = [
  { name: "Home", to: "/home" },
  { name: "Lines", to: "/lines" },
  { name: "Create Line", to: null }
];

const LineCreate = ({...props}) => {
  const { classes, createLine, enqueueSnackbar  } = props;
  const [form, setForm] = useState({
    name: "",
    start_substation: "",
    end_substation: "",
    accounting_code: "",
  })
  
  async function handleSubmit (values, formikActions) {
    const { setSubmitting, resetForm } = formikActions;
    const form = { ...values };

    try {
      const response = await createLine(form);

      if (response.status === 201) {
        resetForm();
        enqueueSnackbar("The line has been created!", {
          variant: "success"
        });
        props.history.push(`/lines/${response.data.id}`);
      } else {
        enqueueSnackbar("The request could not be processed!", {
          variant: "error"
        });
      }
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
    setSubmitting(false);
  };
  return (
    <Layout title="Create Line">
      {() => (
        <div>
          <SimpleBreadcrumbs routes={breadcrumbs} classes={{root: classes.breadcrumbs}}/>
          <FormLine isCreate action={handleSubmit} form={form}/>
        </div>
      )}
    </Layout>
  );
}

const mapStateToProps = state => {
  return {
    loading: state.global.loading,
    lines: state.lines.list
  };
};

const mapDispatchToProps = {
  toggleItemMenu,
  selectedItemMenu,
  createLine
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "LineCreate" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(LineCreate);
