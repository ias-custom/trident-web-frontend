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
    headerRight: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
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
    iconCopy: {
      '& svg': {
        color: "#67c23a"      
      },
      '&:hover': {
        backgroundColor: "rgba(103,194,58, 0.08)"
      },
      '&:disabled': {
        '& svg': {
          color: "gray"      
        },
      },
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
    breadcrumbs: {
      marginTop: 20
    },
    dialog: {
      width: 400
    }
  });
  
  export default styles;