# Local Moran's I using JS


## Getting Started

These code will enable calculating Local Moran's I of geospatial data using JS. The data can be a vectors set.
![example](https://user-images.githubusercontent.com/19661375/38649584-5d0cb6d4-3dac-11e8-8d47-c648338a4013.png)


test code can be found in client/page1/index.js

core code can be found in client/page1/Local_Morans_I.js

## Installing
to develop with full live reload. use:
```
npm install
npm start 
```

## Calculating Local Moran's I
usage:

```
let LMI = require("./Local_Morans_I.js");
LMI.CalcLMI(dataset,geojson.features,adjlist,true)
```
dataset is a vecters set which is used to calculate Local Moran's I

geojson.features is the geospatial data

you must have an adjust list like:
```
let adjlist = new Map()

//add region0's adjust list
let thisadj = new Map()
thisadj.set(0,80) 
thisadj.set(1,30) 1 is the id of the region, 30 is the corresponding weight
thisadj.set(2,40)
thisadj.set(3,10)
adjlist.set(0,thisadj)
...
```

the last parameter true denotes wheather use bounds length or the distance as the weight.

using distance as the weight is coming soon

using clustering result as input and calculate LMI is coming soon

## Data
Data can be found at [Chicago Data Portal](https://data.cityofchicago.org/)  

## Ref
Anselin, Luc. "Local indicators of spatial association—LISA." Geographical analysis 27.2 (1995): 93-115.
