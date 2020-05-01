import React from "react";
import { compose } from "recompose";
import {
  withStyles,
  Grid,
  IconButton,
  Avatar,
  Slide,
  Typography,
} from "@material-ui/core";
import styles from "./styles";
import PropTypes from "prop-types";
import { Delete, CancelOutlined, FiberManualRecord } from "@material-ui/icons";
import classNames from "classnames";

const ShowInfoMap = ({ ...props }) => {
  const {
    open,
    marker,
    items,
    categories,
    classes,
    closeInfo,
    openDelete,
    showPhoto,
    isDashboard,
    closeMenuMap,
  } = props;
  return (
    open && (
      <Slide
        in={open}
        unmountOnExit
        mountOnEnter
        direction="left"
        onEnter={() => closeMenuMap()}
      >
        <div className={classes.drawer}>
          <CancelOutlined
            className={classes.close}
            onClick={() => closeInfo()}
          />
          {marker && (
            <div className={classes.divInfo}>
              <a
                href={marker.properties.link}
                className={classes.link}
                target={"_blank"}
              >
                <Typography
                  component="h3"
                  style={{ fontWeight: "bold", margin: "10px 0" }}
                >
                  {marker.properties.number}
                </Typography>
              </a>
              {!isDashboard && (
                <Grid container justify="center">
                  <IconButton
                    aria-label="Delete"
                    className={classes.iconDelete}
                    onClick={() => openDelete()}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              )}
              {marker.properties.itemName === "Structure" ||
              marker.properties.itemName === "Span" ? (
                items.length > 0 ? (
                  categories.map((category, index) => (
                    <div key={category.id}>
                      <Typography component="h4" className={classes.label}>
                        {index + 1}. {category.name}
                      </Typography>
                      <div className={classes.divItems}>
                        {items
                          .filter(
                            ({ category_id }) => category_id === category.id
                          )
                          .map((item) => (
                            <div key={item.id}>
                              <Typography
                                component="span"
                                className={classes.label}
                              >
                                - Item "{item.item_parent.name}":
                              </Typography>
                              <div className={classes.divItems}>
                                {item.deficiencies.map((d) => (
                                  <div key={d.id}>
                                    <Typography
                                      component="p"
                                      style={{ marginBottom: 10 }}
                                    >
                                      <FiberManualRecord
                                        style={{ fontSize: 8 }}
                                      />{" "}
                                      {d.deficiency.name}{" "}
                                      {d.emergency ? (
                                        <i
                                          className="fas fa-exclamation-triangle"
                                          style={{ color: "red" }}
                                        ></i>
                                      ) : (
                                        ""
                                      )}
                                    </Typography>
                                    <div>
                                      {d.photos.map((p) => (
                                        <Avatar
                                          alt="photo"
                                          src={p.thumbnail}
                                          key={p.id}
                                          className={classes.avatar}
                                          onClick={() => showPhoto(p.photo)}
                                        />
                                      ))}
                                      {d.photos.length === 0 && (
                                        <Typography
                                          component="h4"
                                          className={classes.empty}
                                        >
                                          WITHOUT PHOTOS
                                        </Typography>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={classes.flexInfo}>
                    <Typography
                      component="h3"
                      style={{ color: "#aba5a5", fontWeight: "bold" }}
                    >
                      WITHOUT DEFICIENCIES
                    </Typography>
                  </div>
                )
              ) : null}
            </div>
          )}
        </div>
      </Slide>
    )
  );
};

ShowInfoMap.propTypes = {
  open: PropTypes.bool.isRequired,
  marker: PropTypes.object,
  items: PropTypes.array,
  categories: PropTypes.array,
  closeInfo: PropTypes.func,
  openDelete: PropTypes.func,
  showPhoto: PropTypes.func,
  isDashboard: PropTypes.bool,
};

ShowInfoMap.defaultProps = {
  open: false,
  marker: {},
  items: [],
  categories: [],
  closeInfo: () => {},
  openDelete: () => {},
  showPhoto: () => {},
  isDashboard: false,
};
export default compose(withStyles(styles))(ShowInfoMap);
