import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import store from './redux/store';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'; 
import MomentUtils from "@date-io/moment";
import indigo from '@material-ui/core/colors/indigo';

const theme = createMuiTheme({
  typography: {
    "fontFamily": "'Josefin Sans', cursive",
    "fontSize": 14,
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500
  },
  palette: {
    secondary: {
      main:indigo[500]
    }
  }
  
});

ReactDOM.render(
<MuiThemeProvider theme = { theme }>
  <Provider store={store}>
      <SnackbarProvider maxSnack={3}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <App />
        </MuiPickersUtilsProvider>
      </SnackbarProvider>
  </Provider>
</MuiThemeProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
