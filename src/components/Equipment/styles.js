const styles = theme => ({
  divInspection: {
    display: "flex",
    flexDirection:"column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%"
  },
  buttonGray: {
    borderColor: '#bdbdbd',
    backgroundColor: '#bdbdbd',
    color: "white",
    cursor: "auto",
    marginLeft: 5,
    '&:hover, &:focus': {
      borderColor: '#bdbdbd',
      backgroundColor: '#bdbdbd',
      color: 'white'
    }
  },
  buttonGreen: {
    borderColor: '#67c23a',
    backgroundColor: '#67c23a',
    color: 'white',
    cursor: "auto",
    marginLeft: 5,
    '&:hover, &:focus': {
      borderColor: '#67c23a',
      backgroundColor: '#67c23a',
      color: 'white'
    }
  },
  buttonAccept: {
    borderColor: '#22c722',
    marginLeft: 5,
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
  empty: {
    margin: "20px 0",
    color: "#c5c5c5",
    fontSize: 14,
    textAlign: "center"
  },
  emptyText: {
    margin: "20px 0 20px 0",
    color: "#c5c5c5"
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
  cardContent: {
    padding: "0 16px"
  },
  switch: {
    color: "red !important"
  },
  divDeficiency: {
    display: "flex",
    justifyContent: "space-between",
    paddingBottom: 10,
    alignItems: "center"
  },
  warningIcon: {
    color: "red",
    marginLeft: 13,
    marginTop: -5
  },
  label: {
    display: "flex",
    alignItems: "center"    
  },
  divHeader: {
    display: "flex",
    alignItems: "center",
    marginRight: 30
  },
  itemName: {
    flex: 1
  },
  question: {
    fontSize: 16,
    lineHeight: "18px"
  },
  radioGroup: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },
  radio: {
    border: "1px solid #3f51b5",
    borderRadius: 5,
    paddingRight: 10,
    margin: "0 10px",
  },
  radioSelected: {
    backgroundColor: "rgba(63,81,181, 0.08)"
  }
});

export default styles;