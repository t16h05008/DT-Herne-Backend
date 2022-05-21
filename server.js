const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const MongoDB = require("mongodb");
const cors = require('cors');
const apiEndpoints = require("./apiEndpoints");

const swaggerOptions = {
    swaggerDefinition: {
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
        servers: ["https://localhost:8000"], // TODO
        openapi: "3.0.0",
    },
    apis: ["apiEndpoints.js"],
}
const swaggerDocs = swaggerJsDoc(swaggerOptions);

const app = express();
const port = 8000;
app.use(cors());
let dbConnection;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
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

app.listen(port, () => {
    connectToMongoDB();
    apiEndpoints.setup(app, dbConnection);
});


function connectToMongoDB() {
    mongoDbUri = "mongodb://localhost:27017"; // for development, has to be replaced later
    let mongoDbClient = new MongoDB.MongoClient(mongoDbUri);
    dbConnection = mongoDbClient.connect(); // initialized connection
    const connect = dbConnection;
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

