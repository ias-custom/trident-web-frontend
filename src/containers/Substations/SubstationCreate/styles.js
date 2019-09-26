const styles = theme => {
    return ({
    root: {
  
    },
    paper: {
      padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    textField: {
      width: '100%',
    },
    divLogo: {
      marginTop: 20
    },
    gridLogo: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '5px',
      border: `1px dashed ${theme.palette.primary.main}`,
      cursor: 'pointer',
      '& > img': {
        width: '100%',
        height: '100%',
        objectFit: 'contain'
      }
    },
    inputImage: {
      width: '100%'
    },
    breadcrumbs: {
      marginTop: 20
    }
  
  });
  }
  
  export default styles;