const drawerWidth = 275;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  divRight: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  divTitle: {
    paddingTop: 16
  },
  divAvatar: {
    width: '100px',
    height: '64px',
    position: 'relative',
    '& > img': {
      width: '100%',
      height: '100%',
      objectFit: 'contain'
    },
    '& > div': {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: '100%',
      backgroundColor: 'rgba(0,0,0,0.3)'
    }
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  subMenu: {
    paddingLeft: 72
  },
  listItem: {
    '&:focus': {
      backgroundColor: 'white',
    }
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },

  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    //flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
  },
  chartContainer: {
    marginLeft: -22,
  },
  tableContainer: {
    height: 320,
  },
  textEllipsis: {
    '& > span': {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden'
    }
  },
  h5: {
    marginBottom: theme.spacing.unit * 2,
  },
  a: {
    '&:hover': {
      textDecoration: 'none !important' ,
    }
  },
  selectCustomer: {
    color: "white",
    fontSize: 18,
    marginRight: 15
  },
  divSelect: {
    borderBottom: "1px solid white",
    paddingBottom: 2
  },
  IconSelect: {
    color: "white"
  }
});

export default styles;