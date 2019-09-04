const styles = theme => ({
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
    buttonSave: {
      marginLeft: 20
    },
    categoryName: {
      marginBottom: 20
    }
  });
  
  export default styles;