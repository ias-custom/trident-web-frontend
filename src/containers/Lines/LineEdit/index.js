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
import { FormLine, Panel, TextEmpty } from "../../../components";
import { Tabs, Tab, Grid, Button, Table, TableHead, TableRow, TableCell, TableBody, Typography, Link, IconButton, Input } from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import { Delete, Edit } from "@material-ui/icons";
import InputFiles from "react-input-files";
import { Link as RouterLink } from "react-router-dom";

const breadcrumbs = [
  { name: "Home", to: "/home" },
  { name: "Lines", to: "/lines" },
  { name: "Edit Line", to: null }
];

const LineEdit = ({...props}) => {
  const { classes, loading, updateLine, getLine, enqueueSnackbar  } = props;
  const [value, setValue] = useState(0)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    name: "",
    start_substation_id: "",
    end_substation_id: "",
    accounting_code: "",
    structures: []
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

  function filter () {

  }
  console.log(props)
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
              <Panel>
                <div className={classes.header}>
                  <div>
                    <Button
                      variant="outlined"
                      color="primary"
                      disabled={loading}
                      onClick={() => {
                        props.history.push(
                          `/lines/${props.match.params.id}/structure/create`
                        );
                      }}
                    >
                      Add Structure
                    </Button>
                    {/* <InputFiles
                      name="file"
                      accept=".csv"
                      onChange={(files, e) => {
                        //this.uploadFile(files[0]);
                        e.target.value = "";
                      }}
                    >
                      <Button
                        variant="outlined"
                        disabled={loading}
                        className={classes.upload}
                      >
                        <CloudUpload />
                        Multiple structures
                      </Button>
                    </InputFiles> */}
                  </div>
                  <Input
                    style={{ width: 300 }}
                    defaultValue=""
                    className={classes.search}
                    inputProps={{
                      placeholder: "Search...",
                      onChange: (value) => { setSearch(value)}
                    }}
                  />
                </div>
              <div className={classes.divTable}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ width: "50%" }}>Number</TableCell>
                      <TableCell style={{ width: "30%" }}>
                        Name
                      </TableCell>
                      <TableCell colSpan={1}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  {!loading && (
                    <TableBody>
                      {form.structures.map(
                        structure => (
                          <TableRow key={structure.id}>
                            <TableCell component="td">
                              {structure.number}
                            </TableCell>
                            <TableCell component="td">
                              {structure.name}
                            </TableCell>
                            <TableCell>
                              <div style={{ display: "flex" }}>
                                <Link
                                  component={RouterLink}
                                  to={`/lines/${props.match.params.id}/structures/${structure.id}`}
                                >
                                  <IconButton
                                    aria-label="Edit"
                                    color="primary"
                                    disabled={loading}
                                  >
                                    <Edit />
                                  </IconButton>
                                </Link>
                                <IconButton
                                  aria-label="Delete"
                                  className={classes.iconDelete}
                                  disabled={loading}
                                  onClick={() =>
                                    this.showModal(
                                      structure.id,
                                      "open",
                                      "structure"
                                    )
                                  }
                                >
                                  <Delete />
                                </IconButton>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  )}
                </Table>
                <TextEmpty
                  itemName="STRUCTURES"
                  empty={form.structures.length === 0}
                />
              </div>
              </Panel>
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
