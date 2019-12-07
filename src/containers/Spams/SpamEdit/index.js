import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { Link as RouterLink, withRouter } from "react-router-dom";
import { withSnackbar } from "notistack";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Input,
  IconButton,
  withStyles,
  Grid,
  Link
} from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {
  toggleItemMenu,
  selectedItemMenu
} from "../../../redux/actions/layoutActions";
import {
  getCategoriesInspection,
  getMarkingsTypes,
  setPoint
} from "../../../redux/actions/projectActions";
import { fetchStructures } from "../../../redux/actions/structureActions";
import {
  getSpan,
  updateSpan,
  getPhotosSpan,
  getMarkings,
  addMarking,
  deleteMarking,
  getAccess,
  addAccess,
  deleteAccess,
  setSpan
} from "../../../redux/actions/spanActions";
import { setLoading } from "../../../redux/actions/globalActions";
import { setFromMap } from "../../../redux/actions/projectActions";
import Layout from "../../../components/Layout/index";
import SimpleBreadcrumbs from "../../../components/SimpleBreadcrumbs";
import Panel from "../../../components/Panel";
import styles from "./styles";
import SwipeableViews from "react-swipeable-views";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  FormSpanEdit,
  PhotosList,
  Equipment,
  TextEmpty,
  DialogDelete
} from "../../../components";
import { Delete, Edit } from "@material-ui/icons";
import { getSubstations } from "../../../redux/actions/substationActions";

class SpanEdit extends React.Component {
  state = {
    search: "",
    open: false,
    itemId: null,
    itemName: "",
    value: 0,
    enabledEquipment: false,
    formGeneral: {
      number: "",
      structureStart: "",
      structureEnd: "",
      stateId: "",
      spanType: "",
      inspectionId: ""
    },
    inspection_id: "",
    inspection_name: "",
    items: [],
    categories: [],
    deficiencies: [],
    accessId: "",
    markingId: "",
    typeSet: ""
  };

  breadcrumbs = [
    { name: "Home", to: "/home" },
    { name: "Projects", to: "/projects" },
    {
      name: "Project edit",
      to: `/projects/${this.props.match.params.projectId}`
    },
    { name: "Span edit", to: null }
  ];

  projectId = this.props.match.params.projectId;
  spanId = this.props.match.params.id;
  formikGeneral = React.createRef();

  componentDidMount = async () => {
    try {
      const url = new URL(window.location.href);
      const fromMapMarking = url.searchParams.get("marking");
      const fromMapAccess = url.searchParams.get("access");
      if (fromMapMarking === "true")
        this.setState({
          value: 3,
          markingId: parseInt(url.searchParams.get("id"))
        });
      if (fromMapAccess === "true")
        this.setState({
          value: 4,
          accessId: parseInt(url.searchParams.get("id"))
        });
      this.props.getSubstations()
      const response = await this.props.getSpan(this.projectId, this.spanId);
      if (response.status === 200) {
        const {
          state_id,
          type_id,
          start_structure_id,
          start_substation_id,
          end_structure_id,
          end_substation_id,
          number,
          inspection_id,
          inspection,
          items
        } = response.data;
        this.setState({
          formGeneral: {
            inspectionId: inspection_id || "",
            number: number || "",
            structureStart: start_structure_id
              ? `${start_structure_id}-st`
              : `${start_substation_id}-sub`,
            structureEnd: end_structure_id
              ? `${end_structure_id}-st`
              : `${end_substation_id}-sub`,
            stateId: state_id || "",
            spanType: type_id || ""
          },
          inspection_id,
          inspection_name: inspection_id ? inspection.name : "",
          items: items || [],
          categories: inspection_id ? inspection.categories : [],
          typeSet: inspection_id ? inspection.type || "1" : "",
          enabledEquipment: true
        });
        // if (inspection_id) this.props.getCategoriesInspection(inspection_id);
        this.props.getPhotosSpan(this.spanId);
        this.props.fetchStructures(this.projectId);
        this.props.getMarkings(this.spanId);
        this.props.getAccess(this.spanId);
        const nameItem = "projects";
        const open = true;
        this.props.toggleItemMenu({ nameItem, open });
        this.props.selectedItemMenu({ nameItem, nameSubItem: "detail" });
      } else {
        this.props.history.push("/404");
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleSearch = event => {
    this.setState({ search: event.target.value });
  };

  filter = (list, keyword, tab) => {
    if (keyword === "") return list;
    let fields = ["description", "first_name", "last_name"];
    if (tab === "markings")
      fields = ["name", "owner", "details", "latitude", "longitude"];
    const regex = new RegExp(keyword, "i");

    return list.filter(data => {
      const obj = { ...data };

      return (
        fields.filter(field => {
          return field !== "name"
            ? String(obj[field]).match(regex)
            : String(obj["type"][field]).match(regex);
        }).length > 0
      );
    });
  };

  handleDelete = async () => {
    this.setState({ open: false });
    let response = "";
    let itemName = "";

    try {
      if (this.state.value === 3) {
        itemName = "Marking";
        response = await this.props.deleteMarking(
          this.spanId,
          this.state.itemId
        );
      }
      if (this.state.value === 4) {
        itemName = "Access";
        response = await this.props.deleteAccess(
          this.spanId,
          this.state.itemId
        );
      }
      if (response.status === 200 || response.status === 204) {
        const text = `${itemName} successfully removed!`;
        this.props.enqueueSnackbar(text, {
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
  };

  showModal(item, itemId, itemName = "") {
    this.setState({ [item]: true, itemId, itemName });
  }

  closeModal(item) {
    this.setState({ [item]: !this.state[item] });
  }

  handleChange(event, newValue) {
    this.setState({ value: newValue, search: "" });
    if (newValue === 0) {
      this.setState(prevState => {
        return { formGeneral: prevState.formGeneral };
      });
      this.formikGeneral.current.resetForm();
    }
  }

  handleChangeIndex(index) {
    this.setState({ value: index });
  }

  addInteraction = async () => {
    this.closeModal("openInteraction");
    const form = { description: this.state.interactionDescription };
    this.setState({ interactionDescription: "" });
    try {
      const response = await this.props.addInteraction(this.structureId, form);
      if (response.status === 200 || response.status === 201) {
        // SHOW NOTIFICACION SUCCCESS
        this.props.enqueueSnackbar("¡The interaction was added successfully!", {
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
  };

  update = async (values, formikActions) => {
    const { setSubmitting } = formikActions;
    this.props.setLoading(true);
    const {
      number,
      stateId,
      structureStart,
      structureEnd,
      spanType,
      inspectionId
    } = values;
    const form = {
      number,
      state_id: stateId,
      type_id: spanType,
      inspection_id: inspectionId
    };
    let id = structureStart.split("-")[0]
    let type = structureStart.split("-")[1]
    if (type === "st") Object.assign(form, {start_structure_id: id})
    else Object.assign(form, {start_substation_id: id})

    id = structureEnd.split("-")[0]
    type = structureEnd.split("-")[1]
    if (type === "st") Object.assign(form, {end_structure_id: id})
    else Object.assign(form, {end_substation_id: id})

    try {
      const response = await this.props.updateSpan(
        this.projectId,
        this.spanId,
        form
      );

      if (response.status === 200) {
        this.setState({
          formGeneral: {
            number,
            stateId,
            structureStart,
            structureEnd,
            spanType,
            inspectionId
          }
        });
        this.props.enqueueSnackbar("The span was updated successfully!", {
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

  goToAddMarking() {
    this.props.setPoint("", "");
    this.props.setSpan(this.spanId);
    this.props.history.push(`/projects/${this.projectId}/markings/create`);
  }

  goToAddAccess() {
    this.props.setPoint("", "");
    this.props.setSpan(this.spanId);
    this.props.history.push(`/projects/${this.projectId}/access/create`);
  }

  changeState = async (stateId) => {
    const form = {
      stateId
    }
    try {
      const response = await this.props.updateSpan(
        this.projectId,
        this.spanId,
        form
      );

      if (response.status === 200) {
        this.setState(prevState => {
          return {
            formGeneral: {
              ...prevState.formGeneral,
              stateId
            }
          }
        });
      } 
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const {
      classes,
      loading,
      photos,
      structures,
      markings,
      access,
      substations
    } = this.props;
    const {
      open,
      search,
      value,
      formGeneral,
      inspection_name,
      enabledEquipment,
      categories,
      items,
      markingId,
      accessId,
      itemName,
      typeSet
    } = this.state;
    return (
      <Layout title="Projects">
        {() => (
          <div>
            <DialogDelete
              item={itemName}
              open={open}
              closeModal={() => this.setState({ open: false })}
              remove={this.handleDelete}
            />
            <div className={classes.root}>
              <SimpleBreadcrumbs
                routes={this.breadcrumbs}
                classes={{ root: classes.breadcrumbs }}
              />
              <Grid className={classes.divTabs}>
                <Tabs
                  value={value}
                  onChange={(e, newValue) => {
                    this.handleChange(e, newValue);
                  }}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                >
                  <Tab label="General" />
                  <Tab label="Equipment" />
                  <Tab label="Photos" />
                  <Tab label="Crossings" />
                  <Tab label="Access" />
                </Tabs>
              </Grid>
              <Panel>
                <SwipeableViews
                  index={value}
                  onChangeIndex={this.handleChangeIndex}
                  slideStyle={{ overflowX: "hidden", overflowY: "hidden" }}
                >
                  <Grid>
                    <Formik
                      onSubmit={this.update}
                      validateOnChange
                      enableReinitialize
                      ref={this.formikGeneral}
                      initialValues={{
                        ...formGeneral
                      }}
                      validationSchema={Yup.object().shape({
                        stateId: Yup.mixed().required("State is required"),
                        spanType: Yup.string().required(
                          "Span type is required"
                        ),
                        structureStart: Yup.string().required(
                          "Structure start is required"
                        ),
                        structureEnd: Yup.string().required(
                          "Structure end is required"
                        ),
                        number: Yup.string()
                          .max(10)
                          .required("Number is required")
                          .trim(),
                        inspectionId: Yup.mixed().required(
                          "Inspection is required"
                        )
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
                          <FormSpanEdit
                            dirty={dirty}
                            values={values}
                            isValid={isValid}
                            touched={touched}
                            errors={errors}
                            isSubmitting={isSubmitting}
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                            handleSubmit={handleSubmit}
                            structures={[
                              ...structures,
                              ...substations.filter(({ project_ids }) =>
                                project_ids.includes(parseInt(this.projectId))
                              )
                            ]}
                            projectId={this.projectId}
                            isCreate={false}
                          />
                        );
                      }}
                    </Formik>
                  </Grid>
                  <Grid style={{ height: "100%" }}>
                    {enabledEquipment && (
                      <Equipment
                        categories={categories}
                        items={items}
                        projectId={this.projectId}
                        itemId={parseInt(this.spanId)}
                        inspectionName={inspection_name}
                        isStructure={false}
                        changeItems={newItems =>
                          this.setState({ items: newItems })
                        }
                        state={formGeneral.stateId}
                        typeSet={typeSet}
                        changeItem={(stateId) => this.changeState(stateId)}
                      />
                    )}
                  </Grid>
                  <Grid style={{ overflow: "hidden" }}>
                    <PhotosList
                      photos={photos}
                      action={"span"}
                      itemId={parseInt(this.spanId)}
                    />
                  </Grid>
                  <Grid>
                    <div className={classes.header}>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                          this.props.setFromMap(false);
                          this.goToAddMarking();
                        }}
                      >
                        Add Crossing
                      </Button>
                      <Input
                        style={{ width: 300 }}
                        defaultValue=""
                        className={classes.search}
                        inputProps={{
                          placeholder: "Search...",
                          onChange: this.handleSearch
                        }}
                      />
                    </div>
                    <div className={classes.divTable}>
                      <Table className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>Owner</TableCell>
                            <TableCell>Notes</TableCell>
                            <TableCell>Latitude</TableCell>
                            <TableCell>Longitude</TableCell>
                            <TableCell fixed={"true"}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        {!loading && (
                          <TableBody>
                            {this.filter(markings, search, "markings").map(
                              marking => (
                                <TableRow
                                  key={marking.id}
                                  selected={markingId === marking.id}
                                >
                                  <TableCell component="td">
                                    {marking.type.name}
                                  </TableCell>
                                  <TableCell component="td">
                                    {marking.owner}
                                  </TableCell>
                                  <TableCell component="td">
                                    {marking.notes}
                                  </TableCell>
                                  <TableCell component="td">
                                    {marking.coordinate[0]}
                                  </TableCell>
                                  <TableCell component="td">
                                    {marking.coordinate[1]}
                                  </TableCell>
                                  <TableCell fixed={"true"}>
                                    <div style={{ display: "flex" }}>
                                      <Link
                                        component={RouterLink}
                                        to={`/projects/${this.projectId}/markings/${marking.id}`}
                                      >
                                        <IconButton
                                          aria-label="Edit"
                                          color="primary"
                                          disabled={loading}
                                          onClick={() => this.props.setSpan(this.spanId)}
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
                                            "open",
                                            marking.id,
                                            "marking"
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
                        itemName="MARKINGS"
                        empty={markings.length === 0}
                      />
                    </div>
                  </Grid>
                  <Grid>
                    <div className={classes.header}>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                          this.props.setFromMap(false);
                          this.goToAddAccess();
                        }}
                      >
                        Add Access
                      </Button>
                      <Input
                        style={{ width: 300 }}
                        defaultValue=""
                        className={classes.search}
                        inputProps={{
                          placeholder: "Search...",
                          onChange: this.handleSearch
                        }}
                      />
                    </div>
                    <div className={classes.divTable}>
                      <Table className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell style={{ minWidth: "100px" }}>
                              Notes
                            </TableCell>
                            <TableCell>Latitude</TableCell>
                            <TableCell>Longitude</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        {!loading && (
                          <TableBody>
                            {this.filter(access, search, "access").map(acc => (
                              <TableRow
                                key={acc.id}
                                selected={accessId === acc.id}
                              >
                                <TableCell component="td">
                                  {acc.type.name}
                                </TableCell>
                                <TableCell
                                  component="td"
                                  style={{ minWidth: "100px" }}
                                >
                                  {acc.notes}
                                </TableCell>
                                <TableCell component="td">
                                  {acc.coordinate[0]}
                                </TableCell>
                                <TableCell component="td">
                                  {acc.coordinate[1]}
                                </TableCell>
                                <TableCell fixed={"true"}>
                                  <div style={{ display: "flex" }}>
                                    <Link
                                      component={RouterLink}
                                      to={`/projects/${this.projectId}/access/${acc.id}`}
                                    >
                                      <IconButton
                                        aria-label="Edit"
                                        color="primary"
                                        disabled={loading}
                                        onClick={() => this.props.setSpan(this.spanId)}
                                      >
                                        <Edit />
                                      </IconButton>
                                    </Link>
                                    <IconButton
                                      aria-label="Delete"
                                      className={classes.iconDelete}
                                      disabled={loading}
                                      onClick={() =>
                                        this.showModal("open", acc.id, "access")
                                      }
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
                        itemName="ACCESS"
                        empty={access.length === 0}
                      />
                    </div>
                  </Grid>
                </SwipeableViews>
              </Panel>
            </div>
          </div>
        )}
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.global.loading,
    photos: state.spans.photos,
    interactions: state.structures.interactions,
    structures: state.structures.structures,
    markings: state.spans.markings,
    marking_types: state.projects.marking_types,
    access: state.spans.access,
    substations: state.substations.list
  };
};

const mapDispatchToProps = {
  addAccess,
  getAccess,
  deleteAccess,
  getMarkings,
  addMarking,
  deleteMarking,
  getMarkingsTypes,
  fetchStructures,
  getCategoriesInspection,
  getSpan,
  updateSpan,
  getPhotosSpan,
  toggleItemMenu,
  selectedItemMenu,
  setLoading,
  setPoint,
  setSpan,
  setFromMap,
  getSubstations
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "SpanEdit" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SpanEdit);
