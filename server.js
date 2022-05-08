const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const fs = require("fs");
const MongoDB = require("mongodb");

const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const port = 8000;
let mongoDbClient, mongoDbConnection;

app.listen(port, () => {
    connectToMongoDB();
});

// get the tilesInfo document from the database and return it
app.get("/buildings/tilesInfo", (req, res) => {
    res.setHeader("Content-Type", "application/json");

    const connect = mongoDbConnection;
    connect.then((client) => {
        let db = client.db("DigitalerZwillingHerne");
        let collection = db.collection("buildings.tileInfo");
        // collection has only one entry
        collection.findOne({}, function(err, result) {
            if (err) throw err;
            // Return the tiles array directly
            res.send(result.tiles)
        })
    });
});

// gets building with the specified id
app.get("/buildings/:id", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    
    const buildingId = req.params.id;
    const connect = mongoDbConnection;
    connect.then((client) => {
        let db = client.db("DigitalerZwillingHerne");
        // TODO find building by id
        // let collection = db.collection("buildings.tileInfo");
        // // collection has only one entry
        // collection.findOne({}, function(err, result) {
        //     if (err) throw err;
        //     // Return the tiles array directly
        //     res.send(result.tiles)
        // })
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
