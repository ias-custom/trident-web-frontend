const styles = theme => ({
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: "20px 0"
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
    icon: {
      color: "white",
      '&:hover': {
        backgroundColor: "rgba(255,255,255, 0.08)"
      }
    },
    emptyText: {
      margin: "50px 0 20px 0",
      color: "#c5c5c5"
    },
    dialog: {
      width: 450
    },
  });
  
  export default styles;