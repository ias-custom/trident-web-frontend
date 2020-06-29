import React, { useState } from "react";
import { compose } from "redux";
import {
  withStyles,
  Grid,
  Slide,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography, FormControlLabel, Checkbox, FormGroup
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import styles from "./styles";
import { CancelOutlined, FiberManualRecord } from "@material-ui/icons";
import { connect } from "react-redux";

function capString(string){
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const MenuMap = ({ ...props }) => {
  const { classes, statistics, closeInfoMap, showMenu, setShowMenu } = props;
  const { projects, structures, deficiencies, interactions } = statistics;

  return (
    <div>
      {showMenu ? (
        <Slide
          direction="right"
          in={true}
          mountOnEnter
          unmountOnExit
          //onEnter={() => closeInfoMap()}
        >
          <Grid className={classes.divMenuMap}>
            <CancelOutlined
              className={classes.close}
              onClick={() => setShowMenu(false)}
            />
            <Grid>
              <h2 className={classes.title}>Statistics</h2>
              <List dense={true}>
                <ListItem classes={{ dense: classes.denseItem }}>
                  <ListItemIcon className={classes.listItemIcon}>
                    <FiberManualRecord className={classes.icon} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Projects"
                    classes={{
                      textDense: classes.item,
                      dense: classes.denseItem,
                    }}
                  />
                </ListItem>
                <List component="div" disablePadding>
                  {Object.entries(projects).filter((s) => s[1] !== undefined ).map((i) => (
                      <ListItem className={classes.nested}>
                        <Grid justify="space-between" container>
                          <Grid>
                            <Typography>- {capString(i[0])}:</Typography>
                          </Grid>
                          <Grid>
                            <Typography className={classes.item}>
                              {i[1]}
                            </Typography>
                          </Grid>
                        </Grid>
                      </ListItem>
                  ))}
                </List>
                {structures? (
                    <hr className={classes.divider} />
                ):(null)}
                {structures? (
                    <ListItem classes={{ dense: classes.denseItem }}>
                      <ListItemIcon className={classes.listItemIcon}>
                        <FiberManualRecord className={classes.icon} />
                      </ListItemIcon>
                      <ListItemText
                          primary="Structures"
                          classes={{
                            textDense: classes.item,
                            dense: classes.denseItem,
                          }}
                      />
                    </ListItem>
                ):(null)}
                {structures? (
                    <List component="div" disablePadding>
                      <ListItem className={classes.nested}>
                        <Grid justify="space-between" container>
                          <Grid>
                            <Typography>- Total Collected:</Typography>
                          </Grid>
                          <Grid>
                            <Typography className={classes.item}>
                              {structures.total_collected}
                            </Typography>
                          </Grid>
                        </Grid>
                      </ListItem>
                      {structures.with_out_deficiencies !== undefined? (
                          <ListItem className={classes.nested}>
                            <Grid justify="space-between" container>
                              <Grid>
                                <Typography>- STR w/o Deficiencies:</Typography>
                              </Grid>
                              <Grid>
                                <Typography className={classes.item}>
                                  {structures.with_out_deficiencies}
                                </Typography>
                              </Grid>
                            </Grid>
                          </ListItem>
                      ):(null)}
                      {structures.with_deficiencies !== undefined? (
                          <ListItem className={classes.nested}>
                            <Grid justify="space-between" container>
                              <Grid>
                                <Typography>- STR with Deficiencies:</Typography>
                              </Grid>
                              <Grid>
                                <Typography className={classes.item}>
                                  {structures.with_deficiencies}
                                </Typography>
                              </Grid>
                            </Grid>
                          </ListItem>
                      ):(null)}
                    </List>
                ):(null)}

                {deficiencies? (
                    <hr className={classes.divider} />
                ):(null)}
                {deficiencies? (
                    <ListItem classes={{ dense: classes.denseItem }}>
                      <ListItemIcon className={classes.listItemIcon}>
                        <FiberManualRecord className={classes.icon} />
                      </ListItemIcon>
                      <ListItemText
                          primary="Total deficiencies"
                          classes={{
                            textDense: classes.item,
                            dense: classes.denseItem,
                          }}
                      />
                    </ListItem>
                ):(null)}
                {deficiencies? (
                    <List component="div" disablePadding>
                      <ListItem className={classes.nested}>
                        <Grid justify="space-between" container>
                          <Grid>
                            <Typography>- Total recorded for STR:</Typography>
                          </Grid>
                          <Grid>
                            <Typography className={classes.item}>
                              {deficiencies.total_recorded_for_structures}
                            </Typography>
                          </Grid>
                        </Grid>
                      </ListItem>
                      {deficiencies.total_recorded_for_spans !== undefined?(
                          <ListItem className={classes.nested}>
                            <Grid justify="space-between" container>
                              <Grid>
                                <Typography>- Total recorded for SPANS:</Typography>
                              </Grid>
                              <Grid>
                                <Typography className={classes.item}>
                                  {deficiencies.total_recorded_for_spans}
                                </Typography>
                              </Grid>
                            </Grid>
                          </ListItem>
                      ):(null)}
                    </List>
                ):(null)}

                {interactions? (
                    <hr className={classes.divider} />
                ):(null)}
                {interactions? (
                    <ListItem classes={{ dense: classes.denseItem }}>
                      <ListItemIcon className={classes.listItemIcon}>
                        <FiberManualRecord className={classes.icon} />
                      </ListItemIcon>
                      <ListItemText
                          primary="Interactions"
                          classes={{
                            textDense: classes.item,
                            dense: classes.denseItem,
                          }}
                      />
                    </ListItem>
                ):(null)}
                {interactions? (
                    <List component="div" disablePadding>
                      <ListItem className={classes.nested}>
                        <Grid justify="space-between" container>
                          <Grid>
                            <Typography>- Positive:</Typography>
                          </Grid>
                          <Grid>
                            <Typography className={classes.item}>
                              {interactions.positive}
                            </Typography>
                          </Grid>
                        </Grid>
                      </ListItem>
                      {/* <ListItem className={classes.nested}>
                    <Grid justify="space-between" container>
                      <Grid>
                        <Typography>- Neutral:</Typography>
                      </Grid>
                      <Grid>
                        <Typography className={classes.item}>9</Typography>
                      </Grid>
                    </Grid>
                  </ListItem> */}
                      <ListItem className={classes.nested}>
                        <Grid justify="space-between" container>
                          <Grid>
                            <Typography>- Negative:</Typography>
                          </Grid>
                          <Grid>
                            <Typography className={classes.item}>
                              {interactions.negative}
                            </Typography>
                          </Grid>
                        </Grid>
                      </ListItem>
                    </List>
                ):(null)}
              </List>
            </Grid>
          </Grid>
        </Slide>
      ) : (
        <Grid className={classes.iconMenuMap} onClick={() => setShowMenu(true)}>
          <MenuIcon />
        </Grid>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    statistics: state.global.statistics,
  };
};

const mapDispatchToProps = {};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(MenuMap);
