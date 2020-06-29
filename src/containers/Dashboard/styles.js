const styles = (theme) => ({
  breadcrumbs: {
    marginTop: 20,
  },
  map: {
    cursor: "pointer",
    color: "#3f51b5",
  },
  table: {
    minWidth: 700,
  },
  buttonLeft: {
    border: "1px solid #3f51b5",
    color: "#3f51b5",
    borderRadius: "4px 0 0 4px",
    fontSize: 12,
  },
  buttonCenter: {
    border: "1px solid #3f51b5",
    borderLeftWidth: 0,
    borderRightWidth: 0,
    color: "#3f51b5",
    borderRadius: 0,
    fontSize: 12,
  },
  buttonRight: {
    border: "1px solid #3f51b5",
    color: "#3f51b5",
    borderRadius: "0 4px 4px 0",
    fontSize: 12,
  },
  extra: {
    borderLeftWidth: 0,
  },
  selectedButton: {
    color: "white",
    backgroundColor: "#3f51b5",
    "&:hover": {
      color: "white",
      backgroundColor: "#3f51b5",
    },
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
  buttonForm: {
    padding: "10px 20px",
    background: "#3f51b5",
    color: "white",
    borderRadius: 20,
    "&:hover": {
      background: "#3f51b5",
      padding: "12px 22px",
    },
    "&:disabled": {
      background: "gray",
    },
  },
  divEmpty: {
    boxShadow:
      "0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)",
    height: "100%"
  },
});

export default styles;
