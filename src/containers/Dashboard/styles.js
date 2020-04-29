const styles = theme => ({
    breadcrumbs: {
      marginTop: 20
    },
    map: {
      cursor: "pointer",
      color: "#3f51b5"
    },
    table: {
      minWidth: 700,
    },
    buttonLeft: {
      border: '1px solid #3f51b5',
      color: '#3f51b5',
      borderRadius: "4px 0 0 4px",
      fontSize: 12
    },
    buttonCenter: {
      border: '1px solid #3f51b5',
      borderLeftWidth: 0,
      borderRightWidth: 0,
      color: '#3f51b5',
      borderRadius: 0,
      fontSize: 12
    },
    buttonRight: {
      border: '1px solid #3f51b5',
      color: '#3f51b5',
      borderRadius: "0 4px 4px 0",
      fontSize: 12
    },
    extra: {
      borderLeftWidth: 0
    },
    selectedButton: {
      color: 'white',
      backgroundColor: '#3f51b5',
      "&:hover": {
        color: 'white',
        backgroundColor: '#3f51b5'
      }
    }
  });
  
  export default styles;