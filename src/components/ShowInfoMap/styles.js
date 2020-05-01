const styles = theme => ({
  drawer: {
    padding: 20,
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    background: "white",
    zIndex: 10,
    borderRadius: "4px 0 4px 0",
    overflowY: "auto",
    boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.1)",
  },
  close: {
    float: "right",
    fontSize: 25,
    cursor: "pointer"
  },
  divInfo: {
    width: 250,
    height: "calc(100% - 10px)",
    "&>h3": {
      color: "#bdbdbd",
      textAlign: "center"
    },
  },
  link: {
    color: "black",
    textAlign: "center",
    textTransform: "uppercase"
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
  label: {
    fontWeight: "bold",
    marginBottom: 10
  },
  divItems: {
    marginLeft: 12
  },
  avatar: {
    margin: "0 10px 10px 0",
    display: "inline-block",
    cursor: "pointer"
  },
  empty: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#aba5a5",
    fontSize: 13
  },
  flexInfo: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    height: "calc(100% - 10px)",
    flexDirection: "column"
  }
})

export default styles