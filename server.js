const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const MongoDB = require("mongodb");
const cors = require('cors');
const fs = require('fs');
const apiEndpoints = require("./apiEndpoints");
require('dotenv').config()

const app = express();
app.use(cors());

const port = process.env.PORT;
const pathToSensorInfo = process.env.PATH_TO_SENSOR_INFO;
const pathToDatabase = process.env.MONGODB_URI || 'mongodb://localhost:27017'

let dbConnection;

const swaggerOptions = {
    definition: {
        info: {
            title: "Digital Twin Herne Backend API",
            description: "The backend api for the Digital Twin of the city of Herne in Germany.",
            contact: {
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

const options = {
    setHeaders: function(res, path) {
        // Set header according to path
        if(path.endsWith(".json")) {
            res.setHeader("Content-Type", "application/json");
        } else {
            res.setHeader('Content-Encoding', 'gzip')
        }
    }
}

app.use("/terrain/dem/1", express.static(__dirname + '/data/terrain1', options));
app.use("/terrain/dem/10", express.static(__dirname + '/data/terrain10', options));
app.use("/terrain/dem/25", express.static(__dirname + '/data/terrain25', options));
app.use("/terrain/dem/50", express.static(__dirname + '/data/terrain50', options));

app.use("/terrain/3dmesh", express.static(__dirname + '/data/3dmesh'));
app.use("/metrostation/pointcloud", express.static(__dirname + "/data/metroPc"));


app.listen(port, async () => {
    await connectToMongoDB();
    let sensorInfo = readSensorInfo(pathToSensorInfo);
    apiEndpoints.setup(app, dbConnection, sensorInfo);
    console.log("Server listening on port " + port);
});

function connectToMongoDB() {
    return new Promise( (resolve, reject) => {
        mongoDbUri = pathToDatabase;
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
                        resolve();
                    },
                    (err) => {
                        console.error(err);
                        reject();
                    }
                );
        });
    });
}


function readSensorInfo(pathToSensorInfo) {
    let obj = JSON.parse(fs.readFileSync(pathToSensorInfo, 'utf8'));
    let result = {};
    // Create a property for each typeOfMeasurement, listing the applicable sensors
    for(let sensor of obj.sensors) {
        // This is where we could simplify or "map" the typeOfMeasurement to our endpoints if needed
        for(let type of sensor.typeOfMeasurement) {
            // TODO export this mapping into a separate file once it gets more complicated
            // Structure like: { precipitation: ["rain", "drizzle", "rainfall", ...], ... }
            if(type === "rain") {
                type = "precipitation"
            }
            if(!result[type]) {
                result[type] = new Map();
            }
            // We assume that the sensor id is unique here, even across different sensor categories
            // But this allows us to find the sensor in O(1)
            result[type].set(sensor.id, sensor); 
        }
    }
    console.log("Sensor information imported from file:", pathToSensorInfo);
    return result;
}