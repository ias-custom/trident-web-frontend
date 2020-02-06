import React, { useState, useEffect } from "react";
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
import { updateLine, getLine } from "../../../redux/actions/LineActions";
import styles from "./styles";
import { FormLine, Panel } from "../../../components";
import { Tabs, Tab, Grid } from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";

const breadcrumbs = [
  { name: "Home", to: "/home" },
  { name: "Lines", to: "/lines" },
  { name: "Edit Line", to: null }
];

const LineEdit = ({...props}) => {
  const { classes, loading, updateLine, getLine, enqueueSnackbar  } = props;
  const [value, setValue] = useState(0)
  const [form, setForm] = useState({
    name: "",
    start_substation: "",
    end_substation: "",
    accounting_code: "",
  })
  useEffect(() => {
    async function loadLine() {
      const response = await getLine(props.match.params.id)
      if (response.status === 200) {
        setForm(response.data)
      }
      else {
        //props.history.push('/404')
      }
    }
    loadLine()
    return () => {
      
    };
  }, [props.match.params.id])

  async function handleSubmit (values, formikActions) {
    const { setSubmitting, resetForm } = formikActions;
    const form = { ...values };

    try {
      const response = await updateLine(props.match.params.id, form);

      if (response.status === 200) {
        resetForm();
        enqueueSnackbar("The line has been updated!", {
          variant: "success"
        });
        props.history.push(`/lines/`);
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
    <Layout title="Edit Line">
      {() => (
        <div>
          <SimpleBreadcrumbs routes={breadcrumbs} classes={{root: classes.breadcrumbs}}/>
          <Grid className={classes.divTabs}>
            <Tabs
              value={value}
              onChange={(e, newValue) => {
                setValue(newValue)
              }}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="INFORMATION" disabled={loading} />
              <Tab label="STRUCTURES" disabled={loading} />
            </Tabs>
          </Grid>
          <SwipeableViews
            index={value}
            onChangeIndex={index => setValue(index)} 
            slideStyle={{
              overflowX: "hidden",
              overflowY: "hidden",
              padding: "0 2px",
              minHeight: "500px",
            }}
          >
            <Grid>
              <FormLine isCreate={false} action={handleSubmit} form={form}/>
            </Grid>
            <Grid>
              <Panel>sdasdasd</Panel>
            </Grid>
          </SwipeableViews>
          
          
        </div>
      )}
    </Layout>
  );
}

const mapStateToProps = state => {
  return {
    loading: state.global.loading,
  };
};

const mapDispatchToProps = {
  toggleItemMenu,
  selectedItemMenu,
  updateLine,
  getLine
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "LineEdit" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(LineEdit);
