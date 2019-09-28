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
    collapseDetails: {
      display: "block"
    },
    categoryName: {
      marginBottom: 20
    },
    collapse: {
      background: "transparent",
      marginBottom: "15px !important"
    },
    inspections: {
      marginTop: 20
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
  });
  }
  
  export default styles;