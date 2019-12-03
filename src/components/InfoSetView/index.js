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
  Paper
} from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import classNames from "classnames";

const InfoSetView = ({ ...props }) => {
  const [openId, setOpenId] = useState("");
  const [itemId, setItemId] = useState("");
  const { inspections, classes, type } = props;

  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid container spacing={16} className={classes.divMain}>
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
                            classes.divItem,
                            type === 2 && classes.divItemMargin
                          )}
                        >
                          <Typography
                            variant={type === 1 ? "subtitle1" : "h6"}
                            align="center"
                            classes={{ subtitle1: classes.itemName, h6: classes.question }}
                          >
                            {item.name}
                          </Typography>
                          { type === 1 && (
                            itemId === item.id ? (
                              <IconButton
                                className={classes.buttonCollapse}
                                onClick={() => setItemId(0)}
                              >
                                <ExpandLess />
                              </IconButton>
                            ) : (
                              <IconButton
                                className={classes.buttonCollapse}
                                onClick={() =>
                                  setItemId(item.id)
                                }
                              >
                                <ExpandMore />
                              </IconButton>
                            )
                          )}
                          {itemId === item.id && (
                            <div className={classes.divDeficiency}>
                              <p className={classes.textItems}>
                                DEFICIENCIES:
                              </p>
                              {item.deficiencies.map(d => (
                                <div
                                  key={d.id}
                                  className={classNames(
                                    classes.divCategory,
                                    classes.divItem
                                  )}
                                >
                                  <Typography
                                    variant={"subtitle1"}
                                    align="center"
                                    classes={{ subtitle1: classes.itemName}}
                                  >
                                    {d.name}
                                  </Typography>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </Paper>
              ))}
            </Grid>
          ))}
        </Grid>
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
