const styles = theme => {
  return {
    divMain: {
      marginTop: 20
    },
    paper: {
      padding: "2px 15px",
      marginBottom: 10,
      overflowY: "auto"
    },
    divCategory: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    divItem: {
      justifyContent: "flex-start"
    },
    divItemMargin: {
      marginBottom: 15,
      justifyContent: "flex-start"
    },
    collapseDetails: {
      display: "block",
      justifyContent: "space-between"
    },
    itemName: {
      lineHeight: "16px",
      textAlign: "left",
      flex: 1
    },
    question: {
      fontSize: 15,
      lineHeight: "16px",
      textAlign: "left",
      flex: 1
    },
    collapse: {
      background: "transparent",
      marginBottom: "15px !important"
    },
    inspections: {
      marginTop: 20
    },
    iconDelete: {
      "& svg": {
        color: "#f50057"
      },
      "&:hover": {
        backgroundColor: "rgba(237,83,85, 0.08)"
      },
      "&:disabled": {
        "& svg": {
          color: "gray"
        }
      }
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
    }
  };
};

export default styles;
