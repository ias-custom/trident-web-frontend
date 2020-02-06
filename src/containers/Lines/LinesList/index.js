import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { Link as RouterLink, withRouter } from "react-router-dom";
import { withSnackbar } from "notistack";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Input,
  IconButton,
  Link,
  withStyles
} from "@material-ui/core";
import { Edit, Delete } from "@material-ui/icons";
import {
  toggleItemMenu,
  selectedItemMenu
} from "../../../redux/actions/layoutActions";
import { fetchLines, deleteLine } from "../../../redux/actions/LineActions";
import Layout from "../../../components/Layout/index";
import SimpleBreadcrumbs from "../../../components/SimpleBreadcrumbs";
import Panel from "../../../components/Panel";
import styles from "./styles";
import TextEmpty from "../../../components/TextEmpty";
import { DialogDelete } from "../../../components";

const breadcrumbs = [
  { name: "Home", to: "/home" },
  { name: "Lines", to: null }
];

const LinesList = ({...props})  => {
  const { loading, classes, fetchLines, lines, selectedItemMenu, deleteLine, enqueueSnackbar } = props;
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [lineId, setLineId] = useState("")

  useEffect(() => {
    fetchLines();
    const nameItem = "setup";
    const nameSubItem = "lines";
    selectedItemMenu({ nameItem, nameSubItem });
    return () => {
      
    };
  }, [fetchLines, selectedItemMenu])

  function handleSearch(event) {
    setSearch(event.target.value)
  };

  function filter(lines, keyword) {
    if (keyword === "") return lines;

    const fields = ["name", 'accounting_code', 'start_substation', 'end_substation'];
    const regex = new RegExp(keyword, "i");

    return lines.filter(line => {
      const obj = { ...line };

      return (
        fields.filter(field => {
          return typeof obj[field] === "string" && obj[field].match(regex);
        }).length > 0
      );
    });
  };

  async function handleDelete() {
    setOpen(false)
    const response = await deleteLine(lineId);
    if (response.status === 200 || response.status === 204) {
      // SHOW NOTIFICACION SUCCCESS
      enqueueSnackbar("Line successfully removed!", {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "center" }
      });
    } else {
      enqueueSnackbar("The request could not be processed!", {
        variant: "error"
      });
    }
  };

  function showModal(lineId) {
    setOpen(true)
    setLineId(lineId)
  }

  return (
    <Layout title="Lines">
      {() => (
        <div>
          <DialogDelete
            item="line"
            open={open}
            closeModal={() => setOpen(false)}
            remove={handleDelete}
          />
          <div className={classes.root}>
            <SimpleBreadcrumbs
              routes={breadcrumbs}
              classes={{ root: classes.breadcrumbs }}
            />

            <Panel>
              <div className={classes.header} >
                <Link
                  component={RouterLink}
                  color="inherit"
                  to="/lines/create"
                >
                  <Button variant="outlined" color="primary">
                  Create Line
                  </Button>
                </Link>
                <Input
                style={{ width: 300 }}
                defaultValue=""
                className={classes.search}
                inputProps={{
                  placeholder: "Search...",
                  onChange: handleSearch
                }}
              />
              </div>

              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Accounting Code</TableCell>
                    <TableCell>Start Substation</TableCell>
                    <TableCell>End Substation</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                {!loading && (
                  <TableBody>
                    {filter(lines, search).map(line => (
                      <TableRow key={line.id}>
                        <TableCell component="td">
                          {line.name}
                        </TableCell>
                        <TableCell>
                          {line.accounting_code}
                        </TableCell>
                        <TableCell>
                          {line.start_substation}
                        </TableCell>
                        <TableCell>
                          {line.end_substation}
                        </TableCell>
                        <TableCell>
                          <div style={{ display: "flex" }}>
                            <Link
                              component={RouterLink}
                              to={`/lines/${line.id}`}
                            >
                              <IconButton
                                aria-label="Edit"
                                color="primary"
                              >
                                <Edit />
                              </IconButton>
                            </Link>
                            <IconButton
                              aria-label="Delete"
                              className={classes.iconDelete}
                              disabled={loading}
                              onClick={() => showModal(line.id)}
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
              <TextEmpty itemName="LINES" empty={lines.length === 0} />
            </Panel>
          </div>
        </div>
      )}
    </Layout>
  );
}

const mapStateToProps = state => {
  return {
    loading: state.global.loading,
    permissions: state.auth.permissions,
    is_superuser: state.auth.is_superuser,
    lines: state.lines.list
  };
};

const mapDispatchToProps = {
  toggleItemMenu,
  selectedItemMenu,
  fetchLines,
  deleteLine
};

export default compose(
  withRouter,
  withSnackbar,
  withStyles(styles, { name: "LinesList" }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(LinesList);
