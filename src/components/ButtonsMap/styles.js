const styles = (theme) => ({
  buttonMenu: {
    color: "white",
    borderColor: "#3f51b5",
    background: "#3f51b5",
    fontSize: 12,
    fontWeight: "bold",
    margin: "0 5px",
    padding: 5,
    "&:hover": {
      color: "#3f51b5",
    },
  },
  iconButtonMenu: {
    margin: "-4px 0 0 10px",
    color: "white",
    fontSize: 17,
  },
  divMenu: {
    display: "flex",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 2,
    padding: 10,
    width: "auto"
  },
});

export default styles;
