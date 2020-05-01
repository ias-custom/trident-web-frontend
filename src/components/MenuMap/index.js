import React, { useState } from "react";
import { compose } from "redux";
import { withStyles, IconButton, Grid, Slide, List, ListItem, ListItemText } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import styles from "./styles";
import { CancelOutlined } from "@material-ui/icons";

const MenuMap = ({ ...props }) => {
  const { classes } = props;
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div>
      {showMenu ? (
        <Slide direction="right" in={true} mountOnEnter unmountOnExit>
          <Grid className={classes.divMenuMap}>
            <CancelOutlined className={classes.close} onClick={() => setShowMenu(false)} />
            <Grid>
              <h2 className={classes.title}>Statistics</h2>
              <List dense={true}>
                <ListItem>
                  <ListItemText
                    primary="Projects"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Structures"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Total deficiencies"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Interactions"
                  />
                </ListItem>
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

export default compose(withStyles(styles))(MenuMap);
