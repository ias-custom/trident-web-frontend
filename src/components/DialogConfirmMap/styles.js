const styles = (theme) => ({
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
  iconMarker: {
    position: "absolute",
    zIndex: 2,
    top: "calc(50% - 15px)",
    left: "calc(50% - 11px)",
    color: "#ff0000",
    fontSize: 30,
    textAlign: "center",
  },
  paragraph: {
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center"
  },
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
});

export default styles;
