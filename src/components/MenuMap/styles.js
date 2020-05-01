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
    overflowY: "auto",
    background: "white",
    zIndex: 10,
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
  },
  nested: {
    padding: "0 20px 0 40px",
    marginTop: 4
  },
  icon: {
    color: "black",
    fontSize: 15
  },
  listItemIcon: {
    marginRight: 0
  },
  item: {
    fontWeight:"bold"
  },
  denseItem: {
    padding: "0 8px"
  },
  divider: {
    border: "none",
    height: 1
  }
})

export default styles