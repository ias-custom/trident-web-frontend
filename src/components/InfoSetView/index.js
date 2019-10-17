import React, { useState } from "react";
import styles from "./styles";
import { connect } from "react-redux";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import { withSnackbar } from "notistack";
import _ from "lodash";
import {
  Grid,
  withStyles,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Paper
} from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import classNames from "classnames";

const InfoSetView = ({ ...props }) => {
  const [tab, setTab] = useState(0);
  const [openId, setOpenId] = useState("");
  const { inspections, deficiencies, classes } = props;

  return (
    <Grid container>
      <Grid item className={classes.divTabs} xs={12}>
        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="INSPECTIONS"/>
          <Tab label="DEFICIENCES"/>
        </Tabs>
      </Grid>
      <Grid item xs={12}>
        <SwipeableViews
          index={tab}
          onChangeIndex={value => this.setState({ tab: value })}
          slideStyle={{
            overflowX: "hidden",
            overflowY: "hidden",
            padding: "0 2px"
          }}
        >
          <Grid container spacing={16}>
            {inspections.map(({ id, name, categories }) => (
              <Grid item xs={6} key={id}>
                <Typography
                  variant="h6"
                  align="center"
                  classes={{ h6: classes.categoryName }}
                >
                  {name}
                </Typography>
                {categories.map(category => (
                  <Paper className={classes.paper} key={category.id}>
                    <div className={classes.divCategory}>
                      <Typography
                        variant="subtitle1"
                        align="center"
                        classes={{ h6: classes.categoryName }}
                      >
                        {category.name}
                      </Typography>
                      {openId === category.id ? (
                        <IconButton
                          className={classes.buttonCollapse}
                          onClick={() => setOpenId(0)}
                        >
                          <ExpandLess />
                        </IconButton>
                      ) : (
                        <IconButton
                          className={classes.buttonCollapse}
                          onClick={() =>
                            setOpenId(category.id)
                          }
                        >
                          <ExpandMore />
                        </IconButton>
                      )}
                    </div>
                    {openId === category.id ? (
                      <div>
                        <p className={classes.textItems}>ITEMS:</p>
                        {category.items.map(item => (
                          <div
                            key={item.id}
                            className={classNames(
                              classes.divCategory,
                              classes.divItem
                            )}
                          >
                            <Typography
                              variant="subtitle1"
                              align="center"
                              classes={{ h6: classes.categoryName }}
                            >
                              {item.name}
                            </Typography>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </Paper>
                ))}
              </Grid>
            ))}
          </Grid>
          <Grid>
            {deficiencies.map( deficiency => (
              <Paper key={deficiency.id} className={classes.paper}>
                <div className={classes.divCategory}>
                  <Typography
                    variant="subtitle1"
                    align="center"
                    classes={{ h6: classes.categoryName }}
                  >
                    {deficiency.name}
                  </Typography>
                </div>
              </Paper>
            ))}
          </Grid>
        </SwipeableViews>
      </Grid>
    </Grid>

  );
};

const mapStateToProps = state => {
  return {
    loading: state.global.loading
  };
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "InfoSetView" }),
  connect(mapStateToProps)
)(InfoSetView);
