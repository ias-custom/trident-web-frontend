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
    },
    marginLeft: 10
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
  divTable: {
    overflowX: "auto"
  },
  dialogMarking: {
    width: 600
  },
  divBreadcrumbs: {
    margin: "20px 0" 
  }
});

export default styles;