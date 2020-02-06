import React, { useState } from "react";
import styles from "./styles";
import { Link as RouterLink, withRouter } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Grid,
  Input,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Link,
  IconButton
} from "@material-ui/core";
import InputFiles from "react-input-files";
import { CloudUpload, Edit, Delete } from "@material-ui/icons";
import { TextEmpty } from "..";

const AddStructures = ({ ...props }) => {
  const [search, setSearch] = useState("")
  const { classes, loading, setPoint, setFromMap, uploadFile, structures } = props;

  function filter (list, keyword, tab) {
    if (keyword === "") return list;
    let fields = "";
    fields = ["name", "number"];
    const regex = new RegExp(keyword, "i");

    return list.filter(data => {
      const obj = { ...data };

      return (
        fields.filter(field => {
          return String(obj[field]).match(regex);
        }).length > 0
      );
    });
  };
  
  function dataPorcentage(items) {
    const total = items.length;
    const collected = items.filter(({ state_id }) => state_id === 1).length;
    const not_collected = items.filter(({ state_id }) => state_id !== 1).length;
    return total !== 0 ? (
      <p className={classes.dataPorcentage}>
        Collected: {((collected / total) * 100).toFixed(2)}% / No collected:{" "}
        {((not_collected / total) * 100).toFixed(2)}%
      </p>
    ) : (
      <p className={classes.dataPorcentage}>Collected: 0% / No collected: 0%</p>
    );
  };

  return (
    <Grid>
      <div className={classes.header}>
        <div>
          <Button
            variant="outlined"
            color="primary"
            disabled={loading}
            onClick={() => {
              setPoint("", "");
              setFromMap(false);
              props.history.push(
                `/projects/${this.projectId}/structures/create`
              );
            }}
          >
            Add Structure
          </Button>
          <InputFiles
            name="file"
            accept=".csv"
            onChange={(files, e) => {
              uploadFile(files[0]);
              e.target.value = "";
            }}
          >
            <Button
              variant="outlined"
              disabled={loading}
              className={classes.upload}
            >
              <CloudUpload />
              Multiple structures
            </Button>
          </InputFiles>
        </div>
        <Input
          style={{ width: 300 }}
          defaultValue=""
          className={classes.search}
          inputProps={{
            placeholder: "Search...",
            onChange: this.handleSearch
          }}
        />
      </div>
      <Grid>{dataPorcentage(structures)}</Grid>
      <div className={classes.divTable}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: "50%" }}>Number</TableCell>
              <TableCell style={{ width: "30%" }}>State</TableCell>
              <TableCell colSpan={1}>Actions</TableCell>
            </TableRow>
          </TableHead>
          {!loading && (
            <TableBody>
              {filter(structures, search).map(structure => (
                <TableRow key={structure.id}>
                  <TableCell component="td">{structure.number}</TableCell>
                  <TableCell component="td">
                    {structure.state.name === "Collected" ? (
                      <Typography color="primary">
                        {structure.state.name}
                      </Typography>
                    ) : (
                      <Typography style={{ color: "#e44f4f" }}>
                        {structure.state.name}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <div style={{ display: "flex" }}>
                      <Link
                        component={RouterLink}
                        to={`/projects/${this.projectId}/structures/${structure.id}`}
                      >
                        <IconButton
                          aria-label="Edit"
                          color="primary"
                          disabled={loading}
                        >
                          <Edit />
                        </IconButton>
                      </Link>
                      <IconButton
                        aria-label="Delete"
                        className={classes.iconDelete}
                        disabled={loading}
                        onClick={() =>
                          this.showModal(structure.id, "open", "structure")
                        }
                      >
                        <Delete />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
        <TextEmpty itemName="STRUCTURES" empty={structures.length === 0} />
      </div>
    </Grid>
  );
};

export default AddStructures;
