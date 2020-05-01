const styles = theme => ({
  navigation: {
    width: "30px",
    margin: 10,
    position: "absolute",
    bottom: 12,
    right: 10
  },
  structure: {
    color: "gray", 
    fontSize: 20, 
    cursor: "pointer"
  },
  structureBlue: {
    color: "blue", 
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
  interaction: {
    color: "#3f51b5", 
    fontSize: 20, 
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
  substation: {
    backgroundImage: "url('../../images/substation.png')",
    backgroundSize: "cover",
    width: 50,
    height: 50,
    borderRadius: "50%",
    cursor: "pointer"
  },
});
  
  export default styles;