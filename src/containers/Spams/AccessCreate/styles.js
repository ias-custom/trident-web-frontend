const styles = theme => ({
    paper: {
      padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    textField: {
      width: '100%',
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
    breadcrumbs: {
      marginTop: 20
    },
    buttonBack: {
      height: 35,
      marginBottom: 20
    }
  
  });
  
  export default styles;