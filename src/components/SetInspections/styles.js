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
    iconAdd: {
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
    iconItem: {
      marginLeft: 15
    },
    buttonCollapse: {
      color: "gray"
    },
    textItems: {
      fontWeight: "bold",
      margin: "20px 0 15px 0"
    },
    divTabs: {
      marginBottom: 30,
      marginTop: 11
    },
    divDeficiency: {
      padding: "0 20px 20px"
    },
    dialog: {
      width: 500
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
  });
  }
  
  export default styles;