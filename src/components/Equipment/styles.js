const styles = theme => ({
  divInspection: {
    display: "flex",
    flexDirection:"column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%"
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
  dialog: {
    width: 500
  },
  collapse: {
    background: "transparent",
    marginBottom: "15px !important"
  },
  itemsText: {
    color: "#798ba6"
  },
  collapseDetails: {
    display: "block"
  },
  name: {
    margin: "10px 0 20px 0"
  },
  iconAdd: {
    color: `${theme.palette.green.main}`,
    marginTop: -5,
    marginLeft: 10,
    '&:hover': {
      backgroundColor: "rgba(103,194,58, 0.1)"
    },
  },
});

export default styles;