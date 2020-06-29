import {Dialog, DialogContent, Grid, List, ListItem, ListItemText, Typography, withStyles} from "@material-ui/core";
import React from "react";
import styles from "./styles";

const ShowPhoto = ({...props}) => {
	const {open, closeDialog, url, coord, classes} = props;
	//console.log("url=", url);
	//console.log("coord=", coord);

	const colores = [
		"#E81123","#0084FF","#107C10","#0000FF","#D80073","#DA3B01","#16A085","#2ECC71","#F39C12","#8E44AD"
	];
	return (
		<Dialog
			className={classes.dialogClass}
			open={open}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			onEscapeKeyDown={() => closeDialog()}
			onBackdropClick={() => closeDialog()}
		>
			<DialogContent>
				<img src={url} alt="deficiency" className={classes.mainImg}/>
				{coord.map((coo,index) => (
					<a href={"/imagen?img="+coo.url} target="_blank"  className={classes.cirucloAnimado}
					     style={{borderColor:colores[(index % colores.length)],top: parseInt(coo.y - 25), left: parseInt(coo.x - 25)}}>
						<div className={classes.divFlo}>
							<Grid container className={classes.gridFlo}>
								<List component="div" disablePadding className={classes.list}>
									<img src={coo.url} alt="deficiency" className={classes.deffImg}/>
								</List>
								<List component="div" disablePadding className={classes.list}>
									<ListItem classes={{dense: classes.denseItem}}>
										<ListItemText
											primary="Category"
											classes={{
												textDense: classes.item,
												dense: classes.denseItem
											}}
										/>
									</ListItem>
									<ListItem className={classes.nested}>
										<Typography className={classes.item}>
											{coo.category_name}
										</Typography>
									</ListItem>
									<hr className={classes.divider}/>
									<ListItem classes={{dense: classes.denseItem}}>
										<ListItemText
											primary="Item"
											classes={{
												textDense: classes.item,
												dense: classes.denseItem
											}}
										/>
									</ListItem>
									<ListItem className={classes.nested}>
										<Typography className={classes.item}>
											{coo.item}
										</Typography>
									</ListItem>
								</List>
							</Grid>
						</div>
					</a>
				))}
			</DialogContent>
		</Dialog>
	);
};

export default withStyles(styles)(ShowPhoto);
