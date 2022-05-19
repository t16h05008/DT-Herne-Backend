const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const MongoDB = require("mongodb");
const cors = require('cors');
var path = require('path');

const app = express();
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Expose the dem file structure
const expressStaticOptions = {
    setHeaders: function(res, path) {
        // Set header according to path
        if(path.endsWith(".json")) {
            res.setHeader("Content-Type", "application/json");
        } else {
            res.setHeader('Content-Encoding', 'gzip')
        }
        
       
    }
}
app.use("/terrain/dem1", express.static(__dirname + '/data/terrain1', expressStaticOptions));
app.use("/terrain/dem10", express.static(__dirname + '/data/terrain10', expressStaticOptions));
app.use("/terrain/dem25", express.static(__dirname + '/data/terrain25', expressStaticOptions));
app.use("/terrain/dem50", express.static(__dirname + '/data/terrain50', expressStaticOptions));
const port = 8000;

let mongoDbClient, mongoDbConnection;

app.listen(port, () => {
    
    connectToMongoDB();
});

// get the tilesInfo document from the database and return it
app.get("/3d-models/buildings/tilesInfo", (req, res) => {
    res.setHeader("Content-Type", "application/json");

    const connect = mongoDbConnection;
    connect.then((client) => {
        let db = client.db("DigitalerZwillingHerne");
        let collection = db.collection("buildings.tileInfo");
        // collection has only one entry
        collection.findOne({}, function(err, result) {
            if(err) throw err;
            // Return the tiles array directly
            res.send(result.tiles)
        })
    });
});

// gets building with the specified id
app.get("/3d-models/buildings/:id", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    
    const buildingId = req.params.id;
    const connect = mongoDbConnection;
    connect.then(client => {
        let db = client.db("DigitalerZwillingHerne");

        const bucket = new MongoDB.GridFSBucket(db, { bucketName: 'buildings' });
        bucket.find({ 'metadata.id' : buildingId }).toArray( function(err, result) {
            if(err) throw err;
            if(!result.length) {
                res.sendStatus(404); // not found
            } else {
                // Get the 3D-model
                if(result.length === 1) {
                    result = result[0];
                    let filename = result.filename;

                    let fileStream = bucket.openDownloadStreamByName(filename,);
                    fileStream.on("error", err => {
                        fileStream.abort();
                        console.err(err)
                    });
                    fileStream.pipe(res);
                } else {
                    throw new Error("More than one document found, which should not happen...")
                }
            }
        });
    });
});

app.get("/terrain/dem/1", (req, res) => {
    return handleDemRequest(req, res);
});

app.get("/terrain/dem/10", (req, res) => {
    return handleDemRequest(req, res);
});

app.get("/terrain/dem/25", (req, res) => {
    return handleDemRequest(req, res);
});

app.get("/terrain/dem/50", (req, res) => {
    return handleDemRequest(req, res);
});

app.get("/sewers/shafts/points", (req, res) => {
    const connect = mongoDbConnection;
    connect.then((client) => {
        let db = client.db("DigitalerZwillingHerne");
        let collection = db.collection("sewers.shafts");
        collection.find({}).toArray(function(err, result) {
            if(err) {
                console.err(err)
                res.sendStatus(500)
            }
            res.setHeader("Content-Type", "application/json");
            res.send(wrapInFeatureCollection( JSON.stringify(result) ));
        })
    });
});

app.get("/sewers/shafts/lines", (req, res) => {
    const connect = mongoDbConnection;
    connect.then((client) => {
        let db = client.db("DigitalerZwillingHerne");
        let collection = db.collection("sewers.shaftsAsLines");
        collection.find({}).toArray(function(err, result) {
            if(err) {
                console.err(err)
                res.sendStatus(500)
            }
            res.setHeader("Content-Type", "application/json");
            res.send(wrapInFeatureCollection( JSON.stringify(result) ));
        })
    });
});


app.get("/sewers/pipes", (req, res) => {
    const connect = mongoDbConnection;
    connect.then((client) => {
        let db = client.db("DigitalerZwillingHerne");
        let collection = db.collection("sewers.pipes");
        collection.find({}).toArray(function(err, result) {
            if(err) {
                console.err(err)
                res.sendStatus(500)
            }
            res.setHeader("Content-Type", "application/json");
            res.send(wrapInFeatureCollection( JSON.stringify(result) ));
        })
    });
});

app.get("/pointclouds/metroStation/:id", (req, res) => {
    res.sendStatus(200);
});

// We have multiple dem endpoints with different resolution
// But they are all handled very similar
function handleDemRequest(req, res) {
    let resolution = req.originalUrl.split("/").at(-1);
    // TODO store in database?
    let layerJsonAbsPath = path.join(__dirname, "data", "terrain" + resolution, "layer.json");
    res.sendFile(layerJsonAbsPath);
}


function connectToMongoDB() {
    mongoDbUri = "mongodb://localhost:27017"; // for development, has to be replaced later
    mongoDbClient = new MongoDB.MongoClient(mongoDbUri);
    mongoDbConnection = mongoDbClient.connect(); // initialized connection
    const connect = mongoDbConnection;
    // test connection
    connect.then(async () => {
        await mongoDbClient
            .db("admin")
            .command({ ping: 1 })
            .then(
                () => {
                    console.log("Connected to MongoDB.");
                },
                (err) => {
                    console.error(err);
                }
            );
    });
}

/**
 * 
 * @param {string} features | stringified array of feature objects
 * @returns 
 */
function wrapInFeatureCollection(features) {
    features = features.substring(1); // remove opening array bracket;
    features = features.substring(0, features.length-1); // remove closing array bracket
    let result = "{\"type\":\"FeatureCollection\",\"features\": ["
    result += features;
    result += "]}"
    return result;
}