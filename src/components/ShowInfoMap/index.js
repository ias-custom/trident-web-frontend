import {Avatar, Grid, IconButton, List, ListItem, ListItemText, Slide, Typography, withStyles} from "@material-ui/core";
import {CancelOutlined, Delete} from "@material-ui/icons";
import PropTypes from "prop-types";
import React, {useState} from "react";
import {compose} from "recompose";
import styles from "./styles";

const ShowInfoMap = ({...props}) => {

	const [preview, setPreview] = useState([]);


	function onClosePreview() {
		setPreview([]);
	}

	function getState() {
		let struc = structures.filter((struc) => struc.id == marker.properties.id)[0];
		console.log("struc==", struc);
		if (struc != undefined) {
			return struc.state.name;
		}
		return null;
	}

	function getInspection() {
		let struc = structures.filter((struc) => struc.id == marker.properties.id)[0];
		console.log("struc==", struc);
		if (struc != undefined) {
			return struc.inspection.name;
		}
		return null;
	}

	const {
		open,
		marker,
		items,
		structures,
		categories,
		imagePrincipal,
		classes,
		closeInfo,
		openDelete,
		showPhoto,
		isDashboard,
		closeMenuMap
	} = props;
	//console.log("marker=", marker);
	//console.log("items=", items);
	//console.log("structures=", structures);
	//console.log("categories=", categories);
	//console.log("imagePrincipal=", imagePrincipal);
	return (
		open && (
			<Slide
				in={open}
				unmountOnExit
				mountOnEnter
				direction="left"
				//  onEnter={() => closeMenuMap()}
			>
				<div className={classes.drawer}>
					<CancelOutlined
						className={classes.close}
						onClick={() => closeInfo()}
					/>
					{marker && (
						<div className={classes.divInfo}>
							<a
								href={marker.properties.link}
								className={classes.link}
								target={"_blank"}
							>
								<h2 className={classes.title}>{marker.properties.number}</h2>
							</a>
							{!isDashboard && (
								<Grid container justify="center">
									<IconButton
										aria-label="Delete"
										className={classes.iconDelete}
										onClick={() => openDelete()}
									>
										<Delete/>
									</IconButton>
								</Grid>
							)}
							{marker.geometry.coordinates ? (
								<Grid container>
									<List component="div" disablePadding className={classes.list}>
										<ListItem classes={{dense: classes.denseItem}}>
											<ListItemText
												primary="Number"
												classes={{
													textDense: classes.item,
													dense: classes.denseItem
												}}
											/>
										</ListItem>
										<ListItem className={classes.nested}>
											<Typography className={classes.item}>
												{marker.properties.number}
											</Typography>
										</ListItem>
										<hr className={classes.divider}/>
									</List>
									{getState() ? (
										<List component="div" disablePadding className={classes.list}>
											<ListItem classes={{dense: classes.denseItem}}>
												<ListItemText
													primary="State"
													classes={{
														textDense: classes.item,
														dense: classes.denseItem
													}}
												/>
											</ListItem>
											<ListItem className={classes.nested}>
												<Typography className={classes.item}>
													{getState()}
												</Typography>
											</ListItem>
											<hr className={classes.divider}/>
										</List>
									):(null)}
									{getInspection() ? (
										<List component="div" disablePadding className={classes.list}>
											<ListItem classes={{dense: classes.denseItem}}>
												<ListItemText
													primary="Inspection"
													classes={{
														textDense: classes.item,
														dense: classes.denseItem
													}}
												/>
											</ListItem>
											<ListItem className={classes.nested}>
												<Typography className={classes.item}>
													{getInspection()}
												</Typography>
											</ListItem>
											<hr className={classes.divider}/>
										</List>
									):(null)}
									<List component="div" disablePadding className={classes.list}>
										<ListItem classes={{dense: classes.denseItem}}>
											<ListItemText
												primary="Latitude"
												classes={{
													textDense: classes.item,
													dense: classes.denseItem
												}}
											/>
										</ListItem>
										<ListItem className={classes.nested}>
											<Typography className={classes.item}>
												{marker.geometry.coordinates[0]}
											</Typography>
										</ListItem>
										<hr className={classes.divider}/>
									</List>
									<List component="div" disablePadding className={classes.list}>
										<ListItem classes={{dense: classes.denseItem}}>
											<ListItemText
												primary="Longitude"
												classes={{
													textDense: classes.item,
													dense: classes.denseItem
												}}
											/>
										</ListItem>
										<ListItem className={classes.nested}>
											<Typography className={classes.item}>
												{marker.geometry.coordinates[1]}
											</Typography>
										</ListItem>
										<hr className={classes.divider}/>
									</List>
								</Grid>
							) : (null)}
							{imagePrincipal.length ? (
								<Grid container>
									{imagePrincipal.map((p) => (
										<Avatar
											alt="photo"
											src={p.thumbnail}
											key={p.id}
											className={classes.avatar}
											onClick={() => showPhoto(p.photo)}
										/>
									))}
								</Grid>
							) : (null)}
						</div>
					)}
				</div>
			</Slide>
		)
	);
};

ShowInfoMap.propTypes = {
	open: PropTypes.bool.isRequired,
	marker: PropTypes.object,
	structures: PropTypes.array,
	items: PropTypes.array,
	imagePrincipal: PropTypes.array,
	categories: PropTypes.array,
	closeInfo: PropTypes.func,
	openDelete: PropTypes.func,
	showPhoto: PropTypes.func,
	isDashboard: PropTypes.bool
};

ShowInfoMap.defaultProps = {
	open: false,
	marker: {},
	structures: [],
	items: [],
	imagePrincipal: [],
	categories: [],
	closeInfo: () => {
	},
	openDelete: () => {
	},
	showPhoto: () => {
	},
	isDashboard: false
};
export default compose(withStyles(styles))(ShowInfoMap);
