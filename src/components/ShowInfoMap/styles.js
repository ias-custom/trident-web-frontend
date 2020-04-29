const styles = theme => ({
  drawer: {
    padding: 20,
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    background: "white",
    zIndex: 2,
    overflowY: "auto",
    boxShadow: "-1px 1px 5px 0px rgba(0,0,0,0.75)"
  },
  close: {
    float: "right",
    fontSize: 25,
    cursor: "pointer"
  },
  divInfo: {
    width: 250,
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
  },
  divItems: {
    marginLeft: 12
  },
  avatar: {
    margin: "0 10px 10px 0",
    display: "inline-block",
    cursor: "pointer"
  },
})

export default styles