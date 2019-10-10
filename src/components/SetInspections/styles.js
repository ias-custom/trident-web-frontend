const styles = theme => {
    return ({
    paper: {
      padding: 15,
      marginBottom: 10
    },
    divCategory: {
      display: "flex", 
      justifyContent: "space-between",
      alignItems: "center"
    },
    divItem: {
      marginBottom: 10,
      justifyContent: "flex-start"
    },
    collapseDetails: {
      display: "block",
      justifyContent: "space-between",
    },
    categoryName: {
      marginBottom: 20,
    },
    collapse: {
      background: "transparent",
      marginBottom: "15px !important"
    },
    inspections: {
      marginTop: 20,
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
    iconItem: {
      marginLeft: 15
    },
    buttonCollapse: {
      color: "gray"
    },
    textItems: {
      fontWeight: "bold",
      margin: "20px 0 15px 0"
    }
  });
  }
  
  export default styles;