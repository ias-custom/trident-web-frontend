import React from "react";
import { compose } from "recompose";
import { withStyles, Grid, IconButton, Avatar, Slide } from "@material-ui/core";
import styles from "./styles";
import PropTypes from 'prop-types';
import { Delete, CancelOutlined } from "@material-ui/icons";

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
  } = props;
  return (
    open && (
      <Slide in={open} unmountOnExit mountOnEnter direction="left">
        <div className={classes.drawer}>
          <CancelOutlined className={classes.close} onClick={() => closeInfo()} />
          {marker && (
            <div className={classes.divInfo}>
              <a
                href={marker.properties.link}
                className={classes.link}
                target={"_blank"}
              >
                <h3>{marker.properties.number}</h3>
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
                      <p className={classes.label}>
                        {index + 1}. {category.name}
                      </p>
                      <div className={classes.divItems}>
                        {items
                          .filter(
                            ({ category_id }) => category_id === category.id
                          )
                          .map((item) => (
                            <div key={item.id}>
                              <span className={classes.label}>
                                - Item "{item.item_parent.name}":
                              </span>
                              <div className={classes.divItems}>
                                {item.deficiencies.map((d) => (
                                  <div key={d.id}>
                                    <p>
                                      {d.deficiency.name}{" "}
                                      {d.emergency ? (
                                        <i
                                          className="fas fa-exclamation-triangle"
                                          style={{ color: "red" }}
                                        ></i>
                                      ) : (
                                        ""
                                      )}
                                    </p>
                                    {/* d.photos.map(p => (
                                <Avatar alt="photo" src={p.url} key={p.id}/>
                              )) */}
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
                  <h3>WITHOUT DEFICIENCIES</h3>
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
  isDashboard: PropTypes.bool
};

ShowInfoMap.defaultProps = {
  open: false,
  marker: {},
  items: [],
  categories: [],
  closeInfo: () => {},
  openDelete: () => {},
  showPhoto: () => {},
  isDashboard: false
}
export default compose(withStyles(styles))(ShowInfoMap);
