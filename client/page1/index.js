require("./index.scss");
require("../common/common.js");
//require core code
let LMI = require("./Local_Morans_I.js");

//draw map
let map = L.map('mapcontainer').setView([41.8781, -87.6298], 11);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

	
shp("./CommAreasNew.zip").then(function(geojson) {
  	//geojson is geospatial data
	// console.log(geojson)
	geojson.features.forEach(o=>{
		o.properties.bounds = L.bounds(o.geometry.coordinates[0]) // get bounds of region
		o.properties.vectors = [Math.random()*10]
	})

	//get adjust region and its bounds length
	let adjlist = polygonAdjList(geojson.features)
	// console.log(adjlist)

	//get LMI by data
	let dataset = []
	geojson.features.forEach(o=>{
		dataset.push(o.properties.vectors)
	})
	console.log(LMI.CalcLMI(dataset,geojson.features,adjlist,true))

	//draw LMI on the map
	morancolorscale = d3.scaleLinear()
			.domain([0,3])
			.range([d3.rgb("rgb(255, 255, 255)"), d3.rgb('rgb(251,128,114)')])
	let layer = L.geoJson(geojson, {
			style: function(feature) {
				// console.log(feature)
				return {
					fillColor: morancolorscale(feature.properties.LMI),
					weight: 1,
					opacity: 1,
					color: 'white',
					fillOpacity: 1
				}
			}
		}).addTo(map);
})


// calc adjust region 
function polygonAdjList(geojson) {
	let adjList = new Map()

	for (let i = 0; i < geojson.length; i++) {
		let rowresult = new Map();
		for (let j = 0; j < geojson.length; j++) {
			let distance = getdistance(geojson[i], geojson[j])
			if (distance == 0){
				let overlayD = get_overlay_Distance(geojson[i], geojson[j])
				rowresult.set(j,overlayD)
			}
		}
		adjList.set(i, rowresult)
	}
	return adjList
}
function getdistance(polygon1, polygon2) {
	let mindis = Infinity
	if (polygon1.properties.bounds.intersects(polygon2.properties.bounds)) {
		for (let point1 of polygon1.geometry.coordinates[0]) {
			for (let point2 of polygon2.geometry.coordinates[0]) {
				let dis = (point1[0] - point2[0]) * (point1[0] - point2[0]) +
					(point1[1] - point2[1]) * (point1[1] - point2[1])
				if (mindis > dis)
					mindis = dis
			}
		}
	} else {
		let x = [polygon1.properties.bounds.getBottomLeft(),
			polygon1.properties.bounds.getTopRight(),
			polygon1.properties.bounds.getTopLeft(),
			polygon1.properties.bounds.getBottomRight()
		]
		let y = [polygon2.properties.bounds.getBottomLeft(),
			polygon2.properties.bounds.getTopRight(),
			polygon2.properties.bounds.getTopLeft(),
			polygon2.properties.bounds.getBottomRight()
		]
		for (let point1 of x) {
			for (let point2 of y) {
				let dis = (point1.x - point2.x) * (point1.x - point2.x) +
					(point1.y - point2.y) * (point1.y - point2.y)
				if (mindis > dis)
					mindis = dis
			}
		}
	}
	mindis = Math.sqrt(mindis)
	return mindis
}
function get_overlay_Distance(polygon1, polygon2) {
	//find overlay
	let result = []
	for (let point1 of polygon1.geometry.coordinates[0]) {
		l: for (let point2 of polygon2.geometry.coordinates[0]) {
			if (point1[0] == point2[0] && point1[1] == point2[1]) {
				result.push(point1)
				break l;
			}
		}
	}
	let segement = []
	if (result.length != 0) {
		//find segement
		let thisseg = []
		for (let point1 of polygon1.geometry.coordinates[0]) {
			let isexist = false
			l: for (let point2 of result) {
				if (point1[0] == point2[0] && point1[1] == point2[1]) {
					isexist = true
					thisseg.push(point1)
					break l;
				}
			}
			if (!isexist) {
				if (thisseg.length != 0) {
					segement.push($.extend(true, [], thisseg))
					thisseg = []
				}
			}
		}
		if (thisseg.length != 0) {
			segement.push(thisseg)
		}
	}
	// get bounds length
	let distance = 0;
	segement.forEach(polyline => {
		if (polyline.length > 1) {
			for (let i = 1; i < polyline.length; i++) {
				distance += map.distance(
					[polyline[i - 1][0], polyline[i - 1][1]], [polyline[i][0], polyline[i][1]])
			}
		}
	})
	return distance
}





