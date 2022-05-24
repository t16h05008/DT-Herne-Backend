const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const MongoDB = require("mongodb");
const cors = require('cors');
const apiEndpoints = require("./apiEndpoints");

const app = express();
const port = 8000;
app.use(cors());

let dbConnection;

const swaggerOptions = {
    definition: {
        info: {
            title: "Digital Twin Herne Backend API",
            description: "The backend api for the Digital Twin of the city of Herne in Germany.",
            contact: {
                // TODO for now
                name: "Tim Herker",
                email: "tim.herker@stud.hs-bochum.de"
            },
            license: {
                name: "MIT",
                url: "https://opensource.org/licenses/MIT"
            },
            version: "1.0.0"
        },
        servers: [
            {
                url: "http://localhost:8000",
                description: "For development"
            }
        ],
        openapi: '3.0.3'
    },
    apis: ["./apiEndpoints.js"],
}
const swaggerUiOptions = {
    swaggerOptions: {
        // Sort endpoints alphabetically by tags, then by paths
        operationsSorter : "alpha",
        tagsSorter: "alpha"
      }
}
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerUiOptions));

// Expose the dem file structure
const expressStaticOptionsDEM = {
    setHeaders: function(res, path) {
        // Set header according to path
        if(path.endsWith(".json")) {
            res.setHeader("Content-Type", "application/json");
        } else {
            res.setHeader('Content-Encoding', 'gzip')
        }
    }
}
app.use("/terrain/dem/1", express.static(__dirname + '/data/terrain1', expressStaticOptionsDEM));
app.use("/terrain/dem/10", express.static(__dirname + '/data/terrain10', expressStaticOptionsDEM));
app.use("/terrain/dem/25", express.static(__dirname + '/data/terrain25', expressStaticOptionsDEM));
app.use("/terrain/dem/50", express.static(__dirname + '/data/terrain50', expressStaticOptionsDEM));
app.use("/metrostation/pointcloud", express.static(__dirname + "/data/metrostationPointcloud"));

app.listen(port, () => {
    connectToMongoDB();
    apiEndpoints.setup(app, dbConnection);
});



function connectToMongoDB() {
    mongoDbUri = "mongodb://localhost:27017"; // TODO For development, has to be replaced later
    let mongoDbClient = new MongoDB.MongoClient(mongoDbUri);
    dbConnection = mongoDbClient.connect(); // Initialized connection
    const connect = dbConnection;
    // Test connection
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

