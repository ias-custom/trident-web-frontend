import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  card: {
    background: "#d4452e",
    padding: "15px 20px",
    color: "white",
    "& > h4": {
      textAlign: "center",
      margin: 0
    }
  }
});

export default useStyles;
