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
  Typography,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import styles from "./styles";
import { CancelOutlined, FiberManualRecord } from "@material-ui/icons";
import { connect } from "react-redux";

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
          onEnter={() => closeInfoMap()}
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
                  <ListItem className={classes.nested}>
                    <Grid justify="space-between" container>
                      <Grid>
                        <Typography>- Active:</Typography>
                      </Grid>
                      <Grid>
                        <Typography className={classes.item}>
                          {projects.active}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem className={classes.nested}>
                    <Grid justify="space-between" container>
                      <Grid>
                        <Typography>- Planned:</Typography>
                      </Grid>
                      <Grid>
                        <Typography className={classes.item}>
                          {projects.planned}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem className={classes.nested}>
                    <Grid justify="space-between" container>
                      <Grid>
                        <Typography>- Completed:</Typography>
                      </Grid>
                      <Grid>
                        <Typography className={classes.item}>
                          {projects.completed}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                </List>
                <hr className={classes.divider} />
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
                </List>
                <hr className={classes.divider} />
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
                </List>
                <hr className={classes.divider} />
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
