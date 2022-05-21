const MongoDB = require("mongodb");
const MultiStream = require('multistream')
const path = require('path');

const dbName = "DigitalerZwillingHerne"

// This file is responsible for handling the requests and communicating with the database.
// This logic is outsourced here to keep the apiEndpoints file as concise as possible.

module.exports.handle = (req, res, dbConnection) => {
    const path = req.path;
    // Get the handler function depending on path
    // mapEndpointToHandlerFunction is defined at the bottom of this file
    let handler = mapEndpointToHandlerFunction[path];
    return handler(req, res, dbConnection);
}


let getBuildingTilesInfo = (req, res, dbConnection) => {
    res.setHeader("Content-Type", "application/json");
    const connect = dbConnection;
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


let getBuildings = (req, res, dbConnection) => {
    res.setHeader("Content-Type", "application/json");
    const ids = req.query.ids;

    const connect = dbConnection;
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
                res.sendStatus(404); // If none of the ids were found. Of some are missing, they are ignored.
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
                new MultiStream(streams).pipe(res)
            }
        });
    });
}


let getSewerShaftsPointsBboxInfo = (req, res, dbConnection) => {
    const connect = dbConnection;
    connect.then((client) => {
        let db = client.db(dbName);
        let collection = db.collection("sewers.shafts.points.bboxInfo");
        return getSewerBboxInfo(collection);
    });
}


let getSewerShaftsLinesBboxInfo = (req, res, dbConnection) => {
    const connect = dbConnection;
    connect.then((client) => {
        let db = client.db(dbName);
        let collection = db.collection("sewers.shafts.lines.bboxInfo");
        return getSewerBboxInfo(collection);
    });
}


let getSewerPipesBboxInfo = (req, res, dbConnection) => {
    const connect = dbConnection;
    connect.then((client) => {
        let db = client.db(dbName);
        let collection = db.collection("sewers.pipes.bboxInfo");
        return getSewerBboxInfo(collection);
    });
}


let getSewerShaftsPoints = (req, res, dbConnection) => {
    const ids = req.query.ids;
    const connect = dbConnection;
    connect.then((client) => {
        let db = client.db(dbName);
        let collection = db.collection("sewers.shafts.points");
        return getSewerFeatures(collection, ids, res)
    });
}


let getSewerShaftsLines = (req, res, dbConnection) => {
    const ids = req.query.ids;
    const connect = dbConnection;
    connect.then((client) => {
        let db = client.db(dbName);
        let collection = db.collection("sewers.shafts.lines");
        return getSewerFeatures(collection, ids, res)
    });
}

let getSewerPipes = (req, res, dbConnection) => {
    const ids = req.query.ids;
    const connect = dbConnection;
    connect.then((client) => {
        let db = client.db(dbName);
        let collection = db.collection("sewers.pipes");
        return getSewerFeatures(collection, ids, res)
    });
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
    let resolution = req.originalUrl.split("/").at(-1);
    // Get the layer.json that corresponds to the requested resolution and return it.
    // The client can do subsequent requests directly on the folder structure in the directory.
    let layerJsonAbsPath = path.join(__dirname, "data", "terrain" + resolution, "layer.json");
    res.setHeader("Content-Type", "application/json");
    res.sendFile(layerJsonAbsPath);
}


function getSewerBboxInfo(collection) {
    // Has only one document
    collection.findOne({}, function(err, result) {
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
    collection.find(query).toArray(function(err, result) {
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


// Has to be defined at the bottom because we use functions as variables
const mapEndpointToHandlerFunction = {
    "/buildings": getBuildings,
    "/buildings/tilesInfo": getBuildingTilesInfo,
    "/terrain/dem/1":  handleDemRequest,
    "/terrain/dem/10": handleDemRequest,
    "/terrain/dem/25": handleDemRequest,
    "/terrain/dem/50": handleDemRequest,
    "/sewers/shafts/points": getSewerShaftsPoints,
    "/sewers/shafts/points/bboxInfo": getSewerShaftsPointsBboxInfo,
    "/sewers/shafts/lines": getSewerShaftsLines,
    "/sewers/shafts/lines/bboxInfo": getSewerShaftsLinesBboxInfo,
    "/sewers/pipes": getSewerPipes,
    "/sewers/pipes/bboxInfo": getSewerPipesBboxInfo,
}
