const styles = theme => ({
	mainImg: {
		maxHeight: document.documentElement.clientHeight- 200,
		maxWidth: document.documentElement.clientWidth - 200
	},
	deffImg: {
		maxWidth: 300,
		maxHeight: 300,
		height: "auto",
		width: "100%"
	},
	"@keyframes pulseslider": {
		"0%": {
			transform: "scale(0.8)",
			opacity: 0.5,
		},
		"8%": {
			transform: "scale(1)",
			opacity: 1,
		},
		"15%": {
			transform: "scale(1.1)",
			opacity: 0.9,
		},
		"30%": {
			transform: "scale(1.2)",
			opacity: 0.8,
		},
		"100%": {
			transform: "scale(0.9)",
			opacity: 0.2,
		}
	},
	cirucloAnimado: {
		cursor: "pointer",
		margin: "0 auto",
		left: 0,
		top: 0,
		zIndex: 10,
		backgroundColor: "transparent",
		//opacity: ".1",
		width: 100,
		height: 100,
		borderRadius: "100px",
		animation: "pulseslider 2s linear infinite",
		border: "5px solid",
		position: "absolute",
		'&:hover': {
			animation:"none",
			zIndex: 999,
			border: "10px solid",
			backgroundColor:"rgba(255, 255, 255, 0.75)",
			"&>div": {
				display: "block",
				"&>div": {
					display: "block"
				}
			}
		}
	},
	nested: {
		padding: "0 20px 0 40px",
		marginTop: 4,
	},
	icon: {
		color: "black",
		fontSize: 15
	},
	dialogClass: {
		"&>div": {
			"&>div": {
				overflow: "visible",
				maxWidth: "max-content"
			}
		}
	},
	divFlo: {
		cursor: "auto",
		display: "none",
		position: "fixed",
		top: 0,
		left: 0,
		width: "350px",
		height: "450px",
	},
	gridFlo: {
		position: "absolute",
		top: 20,
		left: 20,
		width: "auto",
		border: "10px solid black",//
		borderRadius: "5px",//
		margin: 0,
		background: "white",
		padding: 0
	},
	list: {
		width: "auto",
	},
	listImg: {
		width: "auto",//
		height: "auto"//
	},
	listItemIcon: {
		marginRight: 0
	},
	listItem: {
	},
	item: {
		fontWeight: "bold"
	},
	divider: {
		height: 1,
		width: "100%"
	}
});

export default styles;
