const styles = theme => ({
  root: {
    height: "calc(100% - 56px)"
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    fontSize: 60
  },
  link: {
    textDecoration: 'none'
  },
  divFirst: {
    marginTop: 20
  },
  divEmpty: {
    border: "2px dashed #b3b0b0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 40,
    color: "#b3b0b0",
    height: "calc(100% - 95px)",
    width: "100%"
  }
});

export default styles;