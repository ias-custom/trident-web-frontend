import React from "react";
import { Grid, RadioGroup, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Radio, Button } from "@material-ui/core";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { withSnackbar } from "notistack";
import SimpleBreadcrumbs from "../../../components/SimpleBreadcrumbs";
import Layout from "../../../components/Layout/index";
import { connect } from "react-redux";
import { setLoading } from "../../../redux/actions/globalActions";
import {
  toggleItemMenu,
  selectedItemMenu
} from "../../../redux/actions/layoutActions";
import styles from "./styles";
import { getDefaultSet, createSet } from "../../../redux/actions/setsActions";
import { SetInspections } from "../../../components";
import classNames from 'classnames';

const breadcrumbs = [
  { name: "Home", to: "/home" },
  { name: "Sets", to: "/sets" },
  { name: "Create Set", to: null }
];

class SetCreate extends React.Component {
  state = {
    openId: "",
    enabledSet: false,
    showModal: false,
    type: "1"
  };

  componentDidMount = async () => {
    try {
      this.setState({showModal: true})
      const nameItem = "sets";
      const nameSubItem = "create";
      const open = true;
      this.props.toggleItemMenu({ nameItem, open });
      this.props.selectedItemMenu({ nameItem, nameSubItem });
      /* await this.props.getDefaultSet();
      this.setState({ enabledSet: true }); */
    } catch (error) {}
  };


  saveSet = async (inspections, name) => {
    const { type } = this.state;
    const form = {
      inspections: inspections.map(({ name, categories }) => {
        return {
          name: name,
          categories: categories.map(({ name, items, questions }) => {
            if (type === "1"){
              return {
                name,
                items: items.map(({ name , deficiencies}) => {
                  return {
                    name,
                    deficiencies: deficiencies.map(({name}) => {
                      return { name }
                    })
                  };
                })
              };
            } else {
              return {
                name,
                questions: questions.map(({ name }) => {
                  return {
                    name
                  };
                })
              };
            }
          })
        };
      }),
      name,
      inspection_id: type
    };
    try {
      const response = await this.props.createSet(form);

      if (response.status === 201) {
        this.props.enqueueSnackbar("The set has been created!", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "center" }
        });
        this.props.history.push("/sets");
      } else {
        this.props.enqueueSnackbar("The request could not be processed!", {
          variant: "error",
          anchorOrigin: { vertical: "top", horizontal: "center" }
        });
      }
    } catch (error) {
      this.props.enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  confirmType = async () => {
    this.setState({showModal: false})
    const { type } = this.state;
    const response = await this.props.getDefaultSet(type);
    if (response.status === 200) {
      this.setState({ enabledSet: true });
    } else {
      this.props.enqueueSnackbar("The request could not be processed!", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    }
  }

  render() {
    const { classes, inspections } = this.props;
    const { enabledSet, type, showModal } = this.state;
    
    return (
      <Layout title="Create Set">
        {() => (
          <div className={classes.root}>
            <Dialog
            open={showModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            disableBackdropClick={true}
            disableEscapeKeyDown={true}
          >
            <DialogTitle id="alert-dialog-title">
              {"What kind of set do you want to create?"}
            </DialogTitle>
            <DialogContent>
              <RadioGroup name="type" value={type} onChange={e => this.setState({type: e.target.value})} classes={{root: classes.radioGroup}}>
                <FormControlLabel
                  value="1"
                  control={<Radio color="primary" />}
                  label="Constructability"
                  labelPlacement="end"
                  classes={{root: classes.radio}}
                  className={classNames(
                    classes.radio,
                    type === "1" && classes.radioSelected,
                  )}
                />
                <FormControlLabel
                  value="2"
                  control={<Radio color="primary" />}
                  label="Construction"
                  labelPlacement="end"
                  className={classNames(
                    classes.radio,
                    type === "2" && classes.radioSelected,
                  )}
                />
              </RadioGroup>
            </DialogContent>
            <DialogActions>
              <Button
                variant="outlined"
                className={classes.buttonCancel}
                onClick={() => this.props.history.push("/sets")}
              >
                Cancel
              </Button>
              <Button
                variant="outlined"
                color="primary"
                className={classes.buttonAccept}
                disabled={type === ""}
                onClick={this.confirmType}
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
            <SimpleBreadcrumbs
              routes={breadcrumbs}
              classes={{ root: classes.breadcrumbs }}
            />
            <Grid container>
              <Grid item sm={12} md={12}>
                {enabledSet ? (
                  <SetInspections
                    inspections={inspections}
                    name=""
                    isCreate={true}
                    action={(inspections, name) =>
                      this.saveSet(inspections, name)
                    }
                    type={type}
                  />
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
    inspections: state.sets.inspections
  };
};

const mapDispatchToProps = {
  setLoading,
  toggleItemMenu,
  selectedItemMenu,
  createSet,
  getDefaultSet
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "SetCreate" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SetCreate);
