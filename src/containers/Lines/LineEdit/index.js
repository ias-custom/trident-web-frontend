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
import { updateLine, getLine, deleteStructureLine, uploadStructuresLine, deleteStructuresLine } from "../../../redux/actions/LineActions";
import styles from "./styles";
import { FormLine, Panel, TextEmpty, DialogDelete, ShowErrors } from "../../../components";
import {
  Tabs,
  Tab,
  Grid,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link,
  IconButton,
  Input,
  Dialog,
  DialogTitle,
  DialogContent,
  Checkbox
} from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import { Delete, Edit, CloudUpload } from "@material-ui/icons";
import InputFiles from "react-input-files";
import { Link as RouterLink } from "react-router-dom";
import ReactLoading from "react-loading";

const breadcrumbs = [
  { name: "Home", to: "/home" },
  { name: "Lines", to: "/lines" },
  { name: "Edit Line", to: null }
];

const LineEdit = ({ ...props }) => {
  const lineId = props.match.params.id
  const { classes, loading, updateLine, getLine, enqueueSnackbar, deleteStructureLine, uploadStructuresLine, deleteStructuresLine } = props;
  const [value, setValue] = useState(0);
  const [fileName, setFileName] = useState("");
  const [fileDialog, setFileDialog] = useState(false);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [structureId, setStructureId] = useState("");
  const [structureIds, setStructureIds] = useState([]);
  const [form, setForm] = useState({
    name: "",
    start_substation_id: "",
    end_substation_id: "",
    accounting_code: "",
    structures: []
  });
  async function loadLine() {
    const response = await getLine(lineId);
    if (response.status === 200) {
      setForm(response.data);
    } else {
      //props.history.push('/404')
    }
  }
  useEffect(() => {
    loadLine();
    return () => {};
  }, [lineId]);

  async function handleSubmit(values, formikActions) {
    const { setSubmitting, resetForm } = formikActions;
    const form = { ...values };

    try {
      const response = await updateLine(lineId, form);

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
  }

  function filter() {
    if (search === "") return form.structures

    return form.structures.filter(s => s.number.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase()))
  }
  
  async function deleteStructure() {
    setOpen(false)
    const response = await deleteStructureLine(lineId, structureId);
    if (response.status === 204) {
      // SHOW NOTIFICACION SUCCCESS
      setForm({
        ...form,
        structures: form.structures.filter(({id}) => id !== structureId)
      })
      enqueueSnackbar("Structure-line successfully removed!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    } else {
      enqueueSnackbar("The request could not be processed!", {
        variant: "error"
      });
    }
  }

  async function uploadFile(file) {
    setFileName(file.name)
    setFileDialog(true)
    const formData = new FormData();
    formData.append("file", file);
    const response = await uploadStructuresLine(
      lineId,
      formData
    );
    if (response.status === 201) {
      setFileName("")
      setFileDialog(false)
      loadLine()
      props.enqueueSnackbar("The structures were succesfully loaded!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    } else {
      const errors = response.data;
      props.enqueueSnackbar("", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" },
        content: key => <ShowErrors id={key} errors={errors} />
      });
    }
  }

  function onSelectAllStructures (e) {
    if (e.target.checked) {
      setStructureIds(form.structures.map(({ id }) => id))
      return;
    }
    setStructureIds([])
  };

  function onSelectStructure (e, structureId) {
    if (e.target.checked) {
      structureIds.push(structureId);
      setStructureIds(Array.from(new Set(structureIds)))
      return;
    }
    setStructureIds(Array.from(
      new Set(structureIds.filter(id => id !== structureId))
    ))
  };

  async function deleteStructuresSelected () {
    const response = await deleteStructuresLine(lineId, structureIds);
    if (response.status === 200 || response.status === 204) {
      // SHOW NOTIFICACION SUCCCESS
      loadLine()
      setStructureIds([])
      enqueueSnackbar("Structures removed successfully!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    } else {
      enqueueSnackbar("The request could not be processed!", {
        variant: "error"
      });
    }
  }


  return (
    <Layout title="Edit Line">
      {() => (
        <div>
          <DialogDelete
            item="structure-line"
            open={open}
            closeModal={() => setOpen(false)}
            remove={deleteStructure}
          />
          <SimpleBreadcrumbs
            routes={breadcrumbs}
            classes={{ root: classes.breadcrumbs }}
          />
          <Dialog
            open={fileDialog}
            classes={{ paper: classes.dialogFile }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            disableBackdropClick={true}
            disableEscapeKeyDown={true}
          >
            <DialogTitle id="alert-dialog-title">UPLOAD FILE</DialogTitle>
            <DialogContent>
              <p style={{ wordBreak: "break-all" }}>
                <span style={{ fontWeight: "bold", marginRight: 10 }}>
                  File:
                </span>
                {fileName}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column"
                }}
              >
                <ReactLoading
                  type={"spin"}
                  color={"#3f51b5"}
                  height={"40px"}
                  width={"40px"}
                />
                <span style={{ color: "#3f51b5", marginTop: 5 }}>
                  LOADING...
                </span>
              </div>
            </DialogContent>
          </Dialog>
          <Grid className={classes.divTabs}>
            <Tabs
              value={value}
              onChange={(e, newValue) => {
                setValue(newValue);
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
              minHeight: "500px"
            }}
          >
            <Grid>
              <FormLine isCreate={false} action={handleSubmit} form={form} />
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
                          `/lines/${lineId}/structure/create`
                        );
                      }}
                    >
                      Add Structure
                    </Button>
                    <InputFiles
                      name="file"
                      accept=".csv"
                      onChange={(files, e) => {
                        uploadFile(files[0]);
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
                    </InputFiles>
                  </div>
                  <Input
                    style={{ width: 300 }}
                    defaultValue=""
                    className={classes.search}
                    inputProps={{
                      placeholder: "Search...",
                      onChange: e => {
                        setSearch(e.target.value);
                      }
                    }}
                  />
                </div>
                {structureIds.length > 0 && (
                  <Grid container justify="flex-end" style={{marginBottom: "10px"}}>
                    <Button
                      variant="outlined"
                      disabled={loading}
                      className={classes.upload}
                      onClick={deleteStructuresSelected}
                    >
                      <Delete />
                      Delete structures
                    </Button>
                  </Grid>
                )}
                <div className={classes.divTable}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={
                              form.structures.length > 0 ? form.structures.length === structureIds.length : false
                            }
                            onChange={onSelectAllStructures}
                          />
                        </TableCell>
                        <TableCell style={{ width: "50%" }}>Number</TableCell>
                        <TableCell style={{ width: "30%" }}>Name</TableCell>
                        <TableCell colSpan={1}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    {!loading && (
                      <TableBody>
                        {filter().map(structure => (
                          <TableRow key={structure.id}>
                            <TableCell component="td" padding="checkbox">
                              <Checkbox
                                checked={structureIds.includes(
                                  structure.id
                                )}
                                onChange={e =>
                                  onSelectStructure(e, structure.id)
                                }
                              />
                            </TableCell>
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
                                  to={`/lines/${lineId}/structures/${structure.id}`}
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
                                  onClick={() => {
                                    setStructureId(structure.id);
                                    setOpen(true);
                                  }}
                                >
                                  <Delete />
                                </IconButton>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
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
};

const mapStateToProps = state => {
  return {
    loading: state.global.loading
  };
};

const mapDispatchToProps = {
  toggleItemMenu,
  selectedItemMenu,
  updateLine,
  getLine,
  deleteStructureLine,
  uploadStructuresLine,
  deleteStructuresLine
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "LineEdit" }),
  connect(mapStateToProps, mapDispatchToProps)
)(LineEdit);
