import React from "react";
import useStyles from "./styles";
import {
  Card,
} from "@material-ui/core";

const ShowErrors = ({ ...props }) => {
  const classes = useStyles();

  function formatError (e) {
    const row = e.position - 1
    const key = Object.keys(e)[1]
    return <div key={row}>
      <p>FILA {row}:</p>
      <span>- {key}.- {e[key][0]}</span>
    </div>
  }

  return (
      (
      <Card classes={{root: classes.card}}>
        <h4>The following errors were found:</h4>
        {props.errors.map(e => formatError(e))}
      </Card>
    )
  );
};

export default ShowErrors;
