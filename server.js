const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const MongoDB = require("mongodb");
const cors = require('cors');

const app = express();
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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
                    console.log(result)
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
