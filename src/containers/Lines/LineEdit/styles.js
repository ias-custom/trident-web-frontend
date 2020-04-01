const styles = theme => ({
  root: {},
  paper: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
  },
  textField: {
    width: "100%"
  },
  breadcrumbs: {
    marginTop: 20
  },
  divTabs: {
    backgroundColor: "white",
    boxShadow:
      "0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)",
    borderRadius: "4px",
    marginBottom: 30,
    marginTop: 11
  },
  upload: {
    borderColor: "#ed5355",
    color: "#ed5355",
    '&:hover': {
      backgroundColor: "rgba(237,83,85, 0.08)"
    },
    '& svg': {
      margin: "-4px 5px 0 0"
    },
    marginLeft: 15
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20
  },
  iconDelete: {
    '& svg': {
      color: "#f50057"      
    },
    '&:hover': {
      backgroundColor: "rgba(237,83,85, 0.08)"
    },
    '&:disabled': {
      '& svg': {
        color: "gray"      
      },
    },
  },
  dialogFile: {
    width: 600
  },
});

export default styles;
