const styles = theme => ({
  paper: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  tableContainer: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20
  },
  headerCenter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  iconAdd: {
    color: `${theme.palette.green.main}`,
    marginTop: 24,
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
  divTabs: {
    backgroundColor: "white",
    boxShadow: "0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)",
    borderRadius: "4px",
    marginBottom: 30,
    marginTop: 11
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
  emptyText: {
    margin: "50px 0 20px 0",
    color: "#c5c5c5"
  },
  buttonSave: {
    marginLeft: 20
  },
  categoryName: {
    marginBottom: 20
  },
  inputName: {
    fontSize: 24,
    background: "transparent",
    border: "none",
    '&:focus': {
      outline: "none"
    }
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
  divInput: {
    '& > div::before': {
      borderBottom: "none",
    }
  },
  inputCategory: {
    fontSize: 16,
    background: "transparent",
    border: "none"
  },
  dialog: {
    width: 350
  },
  dialogSet: {
    width: 600
  },
  dialogStructure: {
    width: 500
  },
  breadcrumbs: {
    marginTop: 20
  },
  dataPorcentage: {
    padding: "0 20px",
    fontWeight: "bold"
  },
  divSelectSet: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  textSelect: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#adadad",
    width: 280,
    marginTop: 25
  }
});

export default styles;