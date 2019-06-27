import Typography from "@material-ui/core/Typography/Typography";
import React from "react";

const TabContainer = (props) => {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
};

export default TabContainer;