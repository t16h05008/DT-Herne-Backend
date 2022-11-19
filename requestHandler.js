const MongoDB = require("mongodb");
const MultiStream = require('multistream')
const path = require("path");
const fs = require("fs");
const axios = require('axios').default;
require('dotenv').config()

const dbName = process.env.DB_NAME;

// This file is responsible for handling the requests and communicating with the database.
// This logic is outsourced here to keep the apiEndpoints file as concise as possible.

module.exports.handle = (req, res, params) => {
    const path = req.route.path;
    // Get the handler function depending on path
    // mapEndpointToHandlerFunction is defined at the bottom of this file
    let handler = mapEndpointToHandlerFunction[path];
    return handler(req, res, params);
}


let getBuildingTilesInfo = (req, res, params) => {
    res.setHeader("Content-Type", "application/json");
    const connect = params.dbConnection;
    connect.then((client) => {
        let db = client.db(dbName);
        let collection = db.collection("buildings.tileInfo");
        // collection has only one entry
        collection.findOne({}, function(err, result) {
            if(err) throw err;
            // Return the tiles array directly
            res.send(result.tiles)
        })
    });
}


let getBuildings = (req, res, params) => {
    const ids = req.query.ids;

    const connect = params.dbConnection;
    connect.then(client => {
        let db = client.db(dbName);
        const bucket = new MongoDB.GridFSBucket(db, { bucketName: 'buildings' });
        let query;
        if(!ids) {
            query = {} // Return all documents
        } else {
            let idsArr = ids.split(",");
            idsArr = idsArr.map( id => parseInt(id));
            query = { "metadata.id": { $in: idsArr } }
        }

        bucket.find(query).toArray( function(err, result) {
            if(err) throw err;
            if(!result.length) {
                res.sendStatus(404);
                return;
            } else {
                // Get the 3D-models
                let streams = [];
                for(let building of result) {
                    let filename = building.filename;
                    let fileStream = bucket.openDownloadStreamByName(filename);
                    fileStream.on("error", err => {
                        fileStream.abort();
                        console.err(err)
                    });
                    streams.push(fileStream)
                }
                // Pipe streams into res in sequential order
                res.setHeader("Content-Type", "application/json");
                new MultiStream(streams).pipe(res)
            }
        });
    });
}


let getBuildingAttributes = (req, res, params) => {
    const ids = req.query.ids;
    const connect = params.dbConnection;
    connect.then(client => {
        let db = client.db(dbName);
        let collection = db.collection("buildings.attributes")
        let projection = { _id: 0 } // Don't return internal id
        if(!ids) {
            query = {} // Return all documents
        } else {
            let idsArr = ids.split(",");
            idsArr = idsArr.map( id => parseInt(id));
            query = { "id": { $in: idsArr } }
        }
        collection.find(query).project(projection).toArray(function(err, result) {
            if(err) {
                console.err(err)
                res.sendStatus(500);
                return;
            }
            if(result.length === 0) {
                res.sendStatus(404);
                return;
            }
            res.setHeader("Content-Type", "application/json");
            res.send(result);
        });
    });
}


let getSewerShafts = (req, res, params) => {
    const ids = req.query.ids;
    const connect = params.dbConnection;
    connect.then((client) => {
        let db = client.db(dbName);
        let collection = db.collection("sewers.shafts");
        return getSewerFeatures(collection, ids, res)
    });
}


let getSewerPipes = (req, res, params) => {
    const ids = req.query.ids;
    const connect = params.dbConnection;
    connect.then((client) => {
        let db = client.db(dbName);
        let collection = db.collection("sewers.pipes");
        return getSewerFeatures(collection, ids, res)
    });
}

let getSewerShaftsAttributes = (req, res, params) => {
    const ids = req.query.ids;
    const connect = params.dbConnection;
    connect.then((client) => {
        let db = client.db(dbName);
        let collection = db.collection("sewers.shafts");
        return getSewerAttributes(collection, ids, res)
    });
}

let getSewerPipesAttributes = (req, res, params) => {
    const ids = req.query.ids;
    const connect = params.dbConnection;
    connect.then((client) => {
        let db = client.db(dbName);
        let collection = db.collection("sewers.pipes");
        return getSewerAttributes(collection, ids, res)
    });
}

let getMetroPointcloud = (req, res, params) => {
    let filepath = path.join(__dirname, "data", "metroPc", "tileset.json")
    if(checkFileExistsSync(filepath)) {
        res.setHeader("Content-Type", "application/json");
        res.sendFile(filepath);
    } else {
        res.sendStatus(404);
    }
}


let getSensorMeasurement = (req, res, params) => {
    let endpoint = req.originalUrl.split("/").at(-1);
    let sensors = params.sensorInfo[endpoint];
    let promises = [];
    for(let [id, sensor] of sensors) {
        // The structure returned by the request depends on the sensor category
        // For now we query each sensor individually
        // (this could be improved if the sensor's API provides a method to query multiple sensors at once)
        let category = sensor["category"];
        let requestParams = {};
        if(category === "fiware") {
            requestParams.headers = {
                "fiware-service": "hsbokanal",
                "fiware-servicepath": "/"
            }
        }
        let promise = axios.get(sensor["url"], requestParams);
        promises.push(promise);
    }
    Promise.all(promises)
        .then( (results) => {
            let responseArr = [];
            for(let result of results) {
                let json = result.data;
                let template = createSensorResponseTemplate();
                let sensor = sensors.get(json.id);
                let category = sensor.category;
                let additionalMeasurements = sensor.typeOfMeasurement.filter( entry => {
                    // TODO Quick fix for now
                    if(endpoint === "precipitation") {
                        return entry !== "rain";
                    } else {
                        return entry !== endpoint;
                    }
                })
                // Map the response to the data structure we want to return, depending on sensor category
                if(category === "fiware") {
                    template.id = json.id;
                    template.category = "fiware";
                    template.position.lon = parseFloat(json.long.value);
                    template.position.lat = parseFloat(json.lat.value);
                    // TODO Quick fix for now
                    if(endpoint === "precipitation") {
                        template.measurement.value = parseFloat(json["rain"].value);
                    } else {
                        template.measurement.value = parseFloat(json[endpoint].value);
                    }
                    
                    if(endpoint === "temperature") template.measurement.unit = "°C";
                    if(endpoint === "humidity") template.measurement.unit = "%";
                    if(endpoint === "precipitation") template.measurement.unit = "l/m²";
                    // TODO Quick fix for now
                    if(endpoint === "precipitation") {
                        template.measurement.time = json["rain"].metadata.TimeInstant.value;
                    } else {
                        template.measurement.time = json[endpoint].metadata.TimeInstant.value;
                    }
                    template.additionalMeasurements = additionalMeasurements;
                } else {
                    console.error("Could not find an appropriate mapping for sensor: ", json.id);
                    res.sendStatus(500);
                }
                // Maybe other categories here later

                responseArr.push(template);
            }
            res.send(responseArr);
        })
        .catch( (e) => {
            console.error(e)
            res.sendStatus(500);
        });
}


let getSensorTimeseriesMeasurement = (req, res, params) => {
    let endpoint = req.originalUrl.split("/").at(-3);
    let sensorId = req.params.id;
    let numberOfMeasurements = req.query.n;
    if(!numberOfMeasurements)
        numberOfMeasurements = 200 // default
    let sensor = params.sensorInfo[endpoint].get(sensorId);
    let category = sensor["category"];
    let requestParams = {};
    let url;
    if(category === "fiware") {
        url = sensor.timeseries.url;
        // TODO Quick fix for now
        if(endpoint === "precipitation") {
            url += "rain" + "?lastN=" + numberOfMeasurements
        } else {
            url += endpoint + "?lastN=" + numberOfMeasurements
        }
        
        requestParams.headers = {
            "fiware-service": "hsbokanal",
            "fiware-servicepath": "/"
        }
    }
    axios.get(url, requestParams)
        .then( result => {
            let response = [];
            let data = result.data;
            if(category === "fiware") {
                // Merge the 'index' and 'values' arrays
                for(let i=0; i<data.index.length;i++) {
                    let timestamp = data.index[i];
                    let value = data.values[i];
                    response.push(
                        [timestamp, value]
                    );
                }
            }
            res.send(response)
        })
        .catch( (e) => {
            console.error(e)
            res.sendStatus(500);
        });
}

// This is the structure we want to return for sensor measurements
function createSensorResponseTemplate() {
    return {
        id: "",
        category: "",
        position: {
            lon: null,
            lat: null,
            altitude: null,
        },
        measurement: {
            value: null,
            unit: "",
            time: ""
        },
        additionalMeasurements: []
    }
}

function wrapInFeatureCollection(features) {
    features = features.substring(1); // remove opening array bracket;
    features = features.substring(0, features.length-1); // remove closing array bracket
    let result = "{\"type\":\"FeatureCollection\",\"features\": ["
    result += features;
    result += "]}"
    return result;
}


// We have multiple dem endpoints with different resolution
// But they are all handled very similar
function handleDemRequest(req, res) {
    let resolution = req.params.resolution;
    // Get the layer.json that corresponds to the requested resolution and return it.
    // The client can do subsequent requests directly on the folder structure in the directory.
    let filepath = path.join(__dirname, "data", "terrain" + resolution, "layer.json")
    if(checkFileExistsSync(filepath)) {
        res.setHeader("Content-Type", "application/json");
        res.sendFile(filepath);
    } else {
        res.sendStatus(404);
    }
}

function handle3dMeshRequest(req, res) {
    let filepath = path.join(__dirname, "data", "3dMesh", "tileset.json")
    if(checkFileExistsSync(filepath)) {
        res.setHeader("Content-Type", "application/json");
        res.sendFile(filepath);
    } else {
        res.sendStatus(404);
    }
}




function getSewerAttributes(collection, ids, res) {
    let projection = { _id: 0 } // Don't return internal id
    if(!ids) {
        query = {} // Return all documents
    } else {
        let idsArr = ids.split(",");
        idsArr = idsArr.map( id => parseInt(id));
        query = { "properties.id": { $in: idsArr } }
    }
    collection.find(query).project(projection).toArray(function(err, result) {
        if(err) {
            console.err(err)
            res.sendStatus(500);
            return;
        }
        if(result.length === 0) {
            res.sendStatus(404);
            return;
        }
        res.setHeader("Content-Type", "application/json");
        res.send(result);
    });
}


function getSewerFeatures(collection, ids, res) {
    let query;
    if(!ids) {
        query = {}; // Return all documents
    } else {
        let idsArr = ids.split(",");
        idsArr = idsArr.map( id => parseInt(id));
        query = { "properties.id": { $in: idsArr } }
    }
    // Only return the properties, that are relevant for visualization
    let projection = {
        "_id": 0,
        "type": 1,
        "properties.id": 1,
        "properties.Farbe": 1,
        "geometry": 1
    }
    if(collection.collectionName.includes("shafts")) {
        projection["properties.Deckelhöhe [m]"] = 1
        projection["properties.Sohlhöhe [m]"] = 1
    }
    if(collection.collectionName.includes("pipes")) {
        projection["properties.Profilbreite [mm]"] = 1
    }

    collection.find(query).project(projection).toArray(function(err, result) {
        if(err) {
            console.err(err)
            res.sendStatus(500);
            return;
        }
        if(result.length === 0) {
            res.sendStatus(404);
            return;
        }
        res.setHeader("Content-Type", "application/json");
        res.send(wrapInFeatureCollection( JSON.stringify(result) ));
    })
}


function checkFileExistsSync(filepath){
    let flag = true;
    try{
      fs.accessSync(filepath, fs.constants.F_OK);
    }catch(e){
      flag = false;
    }
    return flag;
}




// Has to be defined at the bottom because we use functions as variables
const mapEndpointToHandlerFunction = {
    "/buildings": getBuildings,
    "/buildings/tilesInfo": getBuildingTilesInfo,
    "/buildings/attributes": getBuildingAttributes,
    "/terrain/dem/:resolution":  handleDemRequest,
    "/terrain/3dmesh":  handle3dMeshRequest,
    "/sewers/shafts": getSewerShafts,
    "/sewers/shafts/attributes": getSewerShaftsAttributes,
    "/sewers/pipes": getSewerPipes,
    "/sewers/pipes/attributes": getSewerPipesAttributes,
    "/metrostation/pointcloud": getMetroPointcloud,
    "/weather/temperature": getSensorMeasurement,
    "/weather/temperature/timeseries/:id": getSensorTimeseriesMeasurement,
    "/weather/humidity": getSensorMeasurement,
    "/weather/humidity/timeseries/:id": getSensorTimeseriesMeasurement,
    "/weather/precipitation": getSensorMeasurement,
    "/weather/precipitation/timeseries/:id": getSensorTimeseriesMeasurement
}
