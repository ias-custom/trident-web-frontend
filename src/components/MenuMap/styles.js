const styles = theme => ({
  iconMenuMap: {
    padding: 5,
    borderRadius: 4,
    position: "absolute",
    top: 8,
    left: 8,
    background: "white",
    zIndex: 2,
    height: 35,
    boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.1)",
    cursor: "pointer"
  },
  divMenuMap: {
    padding: 5,
    borderRadius: "0 4px 4px 0",
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 300,
    background: "white",
    zIndex: 2,
    boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.1)",
  },
  close: {
    float: "right",
    fontSize: 25,
    cursor: "pointer"
  },
  title: {
    textAlign: "center",
    marginTop: 10
  }
})

export default styles