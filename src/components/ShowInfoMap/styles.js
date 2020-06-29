const styles = theme => ({
	drawer: {
		padding: 0,
		position: "absolute",
		top: 0,
		right: 0,
		bottom: 0,
		background: "white",
		zIndex: 10,
		borderRadius: "4px 0 4px 0",
		overflowY: "auto",
		boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.1)"
	},
	close: {
		margin: 7,
		float: "right",
		fontSize: 25,
		cursor: "pointer"
	},
	divInfo: {
		width: 250,
		height: "calc(100% - 10px)",
		"&>h3": {
			color: "#bdbdbd",
			textAlign: "center"
		}
	},
	link: {
		color: "black",
		textAlign: "center",
		textTransform: "uppercase",
		textDecoration: "none"
	},
	title: {
		backgroundColor: "#3f51b5",
		textAlign: "center",
		color: "white",
		fontWeight: "bold",
		padding: "10px 0",
		margin: 0
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
			}
		}
	},
	nested: {
		padding: "0 20px 0 40px",
		marginTop: 4
	},
	icon: {
		color: "black",
		fontSize: 15
	},
	list: {
		width: "100%"
	},
	listItemIcon: {
		marginRight: 0
	},
	item: {
		fontWeight: "bold"
	},
	denseItem: {
		padding: "0 8px",
		margin: "5px",
		background: "gray"
	},
	label: {
		fontWeight: "bold",
		marginBottom: 10
	},
	divItems: {
		marginLeft: 12
	},
	avatar: {
		borderRadius: "0",
		border: "1px solid",
		width: 100,
		height: 100,
		margin: "0 10px 10px 10px",
		display: "inline-block",
		cursor: "pointer"
	},
	empty: {
		textAlign: "center",
		fontWeight: "bold",
		color: "#aba5a5",
		fontSize: 13
	},
	flexInfo: {
		alignItems: "center",
		display: "flex",
		justifyContent: "center",
		height: "calc(100% - 10px)",
		flexDirection: "column"
	},
	divider: {
		height: 1,
		width: "100%"
	}
});

export default styles;
