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
    fontSize: 30, 
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
  divMarker: {
    position: "absolute",
    zIndex: 2,
    top: "calc(50% - 15px)",
    left: "calc(50% - 120px)",
    '& > i': {
      color: "#ff0000",
      fontSize: 30
    },
    textAlign: "center",
  },
  detailsMarker: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 15
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
    padding: "0 15px 10px 10px",
    borderRadius: 5,
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
    "& > p": {
      fontWeight: "bold",
      fontSize: 14
    }
  }
});
  
  export default styles;