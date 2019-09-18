const styles = theme => ({
  buttonAccept: {
    borderColor: '#22c722',
    color: '#22c722',
    '&:hover, &:focus': {
      borderColor: '#22c722',
      backgroundColor: '#22c722',
      color: 'white'
    }
  },
  buttonCancel: {
    borderColor: '#f50057',
    color: '#f50057',
    '&:hover, &:focus': {
      borderColor: '#f50057',
      backgroundColor: '#f50057',
      color: 'white'
    }
  },
  navigation: {
    width: "30px",
    margin: 10,
    position: "absolute",
    bottom: 12,
    right: 10
  },
  structure: {
    color: "#3f51b5", 
    fontSize: 20, 
    cursor: "pointer"
  },
  marking: {
    color: "#f56c6c", 
    fontSize: 15, 
    cursor: "pointer"
  },
  access: {
    color: "#67c23a", 
    fontSize: 15, 
    cursor: "pointer"
  },
  iconMarker: {
    position: "absolute",
    zIndex: 2,
    top: "calc(50% - 15px)",
    left: "calc(50% - 11px)",
    color: "#ff0000",
    fontSize: 30,
    textAlign: "center",
  },
  detailsMarker: {
    display: "flex",
    position: "absolute",
    bottom: 0,
    left: "calc(50% - 138px)",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 3,
  },
  triangle: {
    width: 0, 
    height: 0,
    borderLeft: "10px solid transparent",
    borderRight: "10px solid transparent",
    borderBottom: "10px solid white",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)"
  },
  infoMarker: {
    background: "white",
    padding: "0 30px 15px 30px",
    borderRadius: 5,
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
  },
  paragraph: {
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center"
  },
  divMenu: {
    display: "flex",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 2,
    padding: 10,
    width: "100%"
  },
  buttonMenu: {
    color: "white",
    borderColor: "#3f51b5",
    background: "#3f51b5",
    fontSize: 12,
    fontWeight: "bold",
    margin: "0 5px",
    padding: 5,
    '&:hover': {
      color: '#3f51b5'
    }
  },
  iconButtonMenu: {
    margin: "-4px 0 0 10px",
    color: "white",
    fontSize: 17
  }
});
  
  export default styles;