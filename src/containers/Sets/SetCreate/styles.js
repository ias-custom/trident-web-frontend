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
    },
    radioGroup: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around"
    },
    radio: {
      border: "1px solid #3f51b5",
      borderRadius: 5,
      paddingRight: 10,
      margin: 0
    },
    radioSelected: {
      backgroundColor: "rgba(63,81,181, 0.08)"
    }
  });
  }
  
  export default styles;