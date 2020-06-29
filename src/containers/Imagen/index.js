import queryString from 'query-string';
import React, {useState} from "react";

const Imagen = ({...props}) => {
	const params = queryString.parse(props.location.search);
	const zoomIn = {zoom: 0.5, cursor: "zoom-in"};
	const zoomOut = {zoom: 1, cursor: "zoom-out"};
	const [imgStyle, setImgStyle] = useState(zoomOut);

	const change = () => {
		setImgStyle((imgStyle.zoom == zoomIn.zoom) ? zoomOut : zoomIn);
	};
	if (params.img !== undefined) {
		return (
			<div
				style={{backgroundColor: "black", textAlign: "center", position: "absolute", top: 0, bottom: 0, left: 0, right: 0}}>
				<img onClick={change} src={params.img} alt={params.img}
				     style={imgStyle}/>
			</div>
		);
	} else {
		return (null);
	}
};

export default Imagen;

