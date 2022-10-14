const requestHandler = require("./requestHandler");

module.exports.setup = (app, dbConnection, sensorInfo) => {

    /**
     * @swagger
     * /buildings/tilesInfo:
     *   get:
     *     summary: Gets a json document, that contains information about the building tiles.
     *     tags:
     *       - buildings
     *     responses:
     *       200:
     *         description: Ok
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *       404:
     *         description: Not found
     */
    app.get("/buildings/tilesInfo", (req, res) => {
        return requestHandler.handle(req, res, {dbConnection: dbConnection});
    });

    /**
     * @swagger
     * /buildings:
     *   get:
     *     summary: Gets the buildings in glTF format.
     *     tags:
     *       - buildings
     *     parameters:
     *       - in: query
     *         name: ids
     *         description: The numeric, comma-separated ids of the buildings to query. Ids are ascending integers, starting at 1.
     *         schema:
     *           type: array
     *           items:
     *              type: integer
     *         example: 1,3,5
     *         required: false
     *     
     *     responses:
     *       200:
     *         description: Ok
     *         content:
     *           application/gltf:
     *             schema:
     *               type: object
     *       404:
     *         description: Not found
     */
    app.get("/buildings", (req, res) => {
        return requestHandler.handle(req, res, {dbConnection: dbConnection});
    });

    /**
     * @swagger
     * /buildings/attributes:
     *   get:
     *     summary: Gets the attributes for the specified buildings in json format.
     *     tags:
     *       - buildings
     *     parameters:
     *       - in: query
     *         name: ids
     *         description: The numeric, comma-separated ids of the buildings to query. Ids are ascending integers, starting at 1.
     *         schema:
     *           type: array
     *           items:
     *              type: integer
     *         example: 1,3,5
     *         required: false
     *     responses:
     *       200:
     *         description: Ok
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *       404:
     *         description: Not found
     */
     app.get("/buildings/attributes", (req, res) => {
        return requestHandler.handle(req, res, {dbConnection: dbConnection});
    });

        /**
     * @swagger
     * /terrain/3dmesh:
     *   get:
     *     summary: Gets a json document, that contains information about the format and file structure the 3d mesh is stored in.
     *     description: Clients can use the information in this document to directly request the mesh files from the server's file system.<br />
     *                  The mesh is stored in 3D-tile structure.
     *     tags:
     *       - terrain
     *     responses:
     *       200:
     *         description: Ok
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *       404:
     *         description: Not found
     */
         app.get("/terrain/3dmesh", (req, res) => {
            return requestHandler.handle(req, res, {dbConnection: dbConnection});
        });

    /**
     * @swagger
     * /terrain/dem/{resolution}:
     *   get:
     *     summary: Gets a json document, that contains information about the format and file structure the terrain is stored in.
     *     description: Clients can use the information in this document to directly request terrain files from the server's file system.<br />
     *                  Subsequent requests follow the schema <b>http://server:port/terrain/dem/resolution/z/x/y.terrain</b><br />
     *                  They could look like <b>http://localhost:8000/terrain/dem/25/3/8/6.terrain</b>
     *     tags:
     *       - terrain
     *     parameters:
     *       - in: path
     *         name: resolution
     *         description: The resolution of the dem.
     *         schema:
     *           type: integer
     *           enum: [1, 10, 25, 50]
     *         required: true
     *     responses:
     *       200:
     *         description: Ok
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *       404:
     *         description: Not found
     */
    app.get("/terrain/dem/:resolution", (req, res) => {
        return requestHandler.handle(req, res, {dbConnection: dbConnection});
    });

    /**
     * @swagger
     * /sewers/shafts:
     *   get:
     *     summary: Gets the sewer shafts as geoJson point geometries (feature collection).
     *     tags:
     *       - sewers
     *     parameters:
     *       - in: query
     *         name: ids
     *         description: The numeric, comma-separated ids of the sewer shafts to query. Ids are integers.
     *         schema:
     *           type: array
     *           items:
     *              type: integer
     *         example: 1,3,5
     *         required: false
     * 
     *     responses:
     *       200:
     *         description: Ok
     *         content:
     *           application/geojson:
     *             schema:
     *               type: object
     *       404:
     *         description: Not found
     */
    app.get("/sewers/shafts", (req, res) => {
        return requestHandler.handle(req, res, {dbConnection: dbConnection});
    });

    /**
     * @swagger
     * /sewers/shafts/attributes:
     *   get:
     *     summary: Gets the attributes for the specified sewer shafts in json format.
     *     tags:
     *       - sewers
     *     parameters:
     *       - in: query
     *         name: ids
     *         description: The numeric, comma-separated ids of the sewer shafts to query. Ids are integers.
     *         schema:
     *           type: array
     *           items:
     *              type: integer
     *         example: 1,3,5
     *         required: false
     *     responses:
     *       200:
     *         description: Ok
     *         content:
     *           application/geojson:
     *             schema:
     *               type: object
     *       404:
     *         description: Not found
     */
     app.get("/sewers/shafts/attributes", (req, res) => {
        return requestHandler.handle(req, res, {dbConnection: dbConnection});
    });

    /**
     * @swagger
     * /sewers/pipes:
     *   get:
     *     summary: Gets the sewer pipes as geoJson line geometries (feature collection).
     *     tags:
     *       - sewers
     *     parameters:
     *       - in: query
     *         name: ids
     *         description: The numeric, comma-separated ids of the sewer pipes to query. Ids are integers.
     *         schema:
     *           type: array
     *           items:
     *              type: integer
     *         example: 1,3,5
     *         required: false
     *     responses:
     *       200:
     *         description: Ok
     *         content:
     *           application/geojson:
     *             schema:
     *               type: object
     *       404:
     *         description: Not found
     */
     app.get("/sewers/pipes", (req, res) => {
        return requestHandler.handle(req, res, {dbConnection: dbConnection});
    });

    /**
     * @swagger
     * /sewers/pipes/attributes:
     *   get:
     *     summary: Gets the attributes for the specified sewer pipes in json format.
     *     tags:
     *       - sewers
     *     parameters:
     *       - in: query
     *         name: ids
     *         description: The numeric, comma-separated ids of the sewer pipes to query. Ids are integers.
     *         schema:
     *           type: array
     *           items:
     *              type: integer
     *         example: 1,3,5
     *         required: false
     *     responses:
     *       200:
     *         description: Ok
     *         content:
     *           application/geojson:
     *             schema:
     *               type: object
     *       404:
     *         description: Not found
     */
     app.get("/sewers/pipes/attributes", (req, res) => {
        return requestHandler.handle(req, res, {dbConnection: dbConnection});
    });

    /**
     * @swagger
     * /metrostation/pointcloud:
     *   get:
     *     summary: Gets the json document in the root folder of a 3dTiles dataset.
     *     description: Clients can use the information in this document to directly request tiles from the server's file system.
     *     tags:
     *       - transport
     *     responses:
     *       200:
     *         description: Ok
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *       404:
     *         description: Not found
     */
    app.get("/metrostation/pointcloud", (req, res) => {
        return requestHandler.handle(req, res, {dbConnection: dbConnection});
    });


    /**
     * @swagger
     * /weather/temperature:
     *   get:
     *     summary: Gets the most recent temperature measurement from all applicable sensors.
     *     tags:
     *       - weather
     *     responses:
     *       200:
     *         description: Ok
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *                     description: The unique sensor id. Format depends on the origin of the sensor.
     *                     example: "sensor-001"
     *                   category:
     *                     type: string
     *                     description: "The sensor category"
     *                     example: "fiware"
     *                   position:
     *                     type: object
     *                     properties:
     *                       lon:
     *                         type: number
     *                         description: longitude
     *                         example: 7.123
     *                       lat:
     *                         type: number
     *                         description: latitude
     *                         example: 52.456
     *                       altitude:
     *                         type: number
     *                         description: height
     *                         example: 107.5
     *                   measurement:
     *                     type: object
     *                     properties:
     *                       value:
     *                         type: number
     *                         description: The sensor's measurement (temperature)
     *                         example: 20.5
     *                       unit:
     *                         type: string
     *                         description: The measurements unit
     *                         example: °C
     *                       time:
     *                         type: string
     *                         description: The timestamp when the value was measured
     *                         example: 2022-06-10T12:00:01.080Z
     *                   additionalMeasurements:
     *                     type: array
     *                     description: The measurements this sensor can provide besides the queried endpoint.
     *                     items:
     *                       type: string
     *                       example:
     *                         - temperature
     *                         - humidity
     *       404:
     *         description: Not found
     */
    app.get("/weather/temperature", (req, res) => {
        return requestHandler.handle(req, res, {sensorInfo: sensorInfo});
    });

    /**
     * @swagger
     * /weather/temperature/timeseries/{id}:
     *   get:
     *     summary: Gets the last N measurements of the specified sensor.
     *     tags:
     *       - weather
     *     parameters:
     *       - in: path
     *         name: id
     *         description: The unique sensor id. Format depends on the origin of the sensor.
     *         schema:
     *           type: string
     *         example: sensor-001
     *         required: true
     *       - in: query
     *         name: n
     *         description: The number of measurements to return.
     *         schema:
     *           type: integer
     *         example: 50
     *         required: false
     *         default: 200
     *         minimum: 1
     *     responses:
     *       200:
     *         description: Ok
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: array
     *                 description: Array of key-value-pairs, with the key being the timestamp and the value the measured value.
     *                 minItems: 2
     *                 maxItems: 2
     *                 items:
     *                   example:
     *                     - 2022-06-09T13:30:01.272+00:00
     *                     - 20.5
     *       404:
     *         description: Not found
     */
    app.get("/weather/temperature/timeseries/:id", (req, res) => {
        return requestHandler.handle(req, res, {sensorInfo: sensorInfo});
    });

    /**
     * @swagger
     * /weather/humidity:
     *   get:
     *     summary: Gets the most recent humidity measurement from all applicable sensors.
     *     tags:
     *       - weather
     *     responses:
     *       200:
     *         description: Ok
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *                     description: The unique sensor id. Format depends on the origin of the sensor.
     *                     example: "sensor-001"
     *                   category:
     *                     type: string
     *                     description: "The sensor category"
     *                     example: "fiware"
     *                   position:
     *                     type: object
     *                     properties:
     *                       lon:
     *                         type: number
     *                         description: longitude
     *                         example: 7.123
     *                       lat:
     *                         type: number
     *                         description: latitude
     *                         example: 52.456
     *                       altitude:
     *                         type: number
     *                         description: height
     *                         example: 107.5
     *                   measurement:
     *                     type: object
     *                     properties:
     *                       value:
     *                         type: integer
     *                         description: The sensor's measurement (humidity)
     *                         example: 60
     *                       unit:
     *                         type: string
     *                         description: The measurements unit
     *                         example: %
     *                       time:
     *                         type: string
     *                         description: The timestamp when the value was measured
     *                         example: 2022-06-10T12:00:01.080Z
     *                   additionalMeasurements:
     *                     type: array
     *                     description: The measurements this sensor can provide besides the queried endpoint.
     *                     items:
     *                       type: string
     *                       example:
     *                         - temperature
     *                         - humidity
     *       404:
     *         description: Not found
     */
    app.get("/weather/humidity", (req, res) => {
        return requestHandler.handle(req, res, {sensorInfo: sensorInfo});
    });


    /**
     * @swagger
     * /weather/humidity/timeseries/{id}:
     *   get:
     *     summary: Gets the last N measurements of the specified sensor.
     *     tags:
     *       - weather
     *     parameters:
     *       - in: path
     *         name: id
     *         description: The unique sensor id. Format depends on the origin of the sensor.
     *         schema:
     *           type: string
     *         example: sensor-001
     *         required: true
     *       - in: query
     *         name: n
     *         description: The number of measurements to return.
     *         schema:
     *           type: integer
     *         example: 50
     *         required: false
     *         default: 200
     *         minimum: 1
     *     responses:
     *       200:
     *         description: Ok
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: array
     *                 description: Array of key-value-pairs, with the key being the timestamp and the value the measured value.
     *                 minItems: 2
     *                 maxItems: 2
     *                 items:
     *                   example:
     *                     - 2022-06-09T13:30:01.272+00:00
     *                     - 52
     *       404:
     *         description: Not found
     */
    app.get("/weather/humidity/timeseries/:id", (req, res) => {
        return requestHandler.handle(req, res, {sensorInfo: sensorInfo});
    });

    /**
     * @swagger
     * /weather/precipitation:
     *   get:
     *     summary: Gets the most recent rain measurement from all applicable sensors.
     *     tags:
     *       - weather
     *     responses:
     *       200:
     *         description: Ok
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: string
     *                     description: The unique sensor id. Format depends on the origin of the sensor.
     *                     example: "sensor-001"
     *                   category:
     *                     type: string
     *                     description: "The sensor category"
     *                     example: "fiware"
     *                   position:
     *                     type: object
     *                     properties:
     *                       lon:
     *                         type: number
     *                         description: longitude
     *                         example: 7.123
     *                       lat:
     *                         type: number
     *                         description: latitude
     *                         example: 52.456
     *                       altitude:
     *                         type: number
     *                         description: height
     *                         example: 107.5
     *                   measurement:
     *                     type: object
     *                     properties:
     *                       value:
     *                         type: integer
     *                         description: The sensor's measurement (humidity)
     *                         example: 0.2
     *                       unit:
     *                         type: string
     *                         description: The measurements unit
     *                         example: l/m²
     *                       time:
     *                         type: string
     *                         description: The timestamp when the value was measured
     *                         example: 2022-06-10T12:00:01.080Z
     *                   additionalMeasurements:
     *                     type: array
     *                     description: The measurements this sensor can provide besides the queried endpoint.
     *                     items:
     *                       type: string
     *                       example:
     *                         - temperature
     *                         - humidity
     *       404:
     *         description: Not found
     */
    app.get("/weather/precipitation", (req, res) => {
        return requestHandler.handle(req, res, {sensorInfo: sensorInfo});
    });

    /**
     * @swagger
     * /weather/precipitation/timeseries/{id}:
     *   get:
     *     summary: Gets the specified number of a sensor's most recent measurements.
     *     tags:
     *       - weather
     *     parameters:
     *       - in: path
     *         name: id
     *         description: The unique sensor id. Format depends on the origin of the sensor.
     *         schema:
     *           type: string
     *         example: sensor-001
     *         required: true
     *       - in: query
     *         name: n
     *         description: The number of measurements to return.
     *         schema:
     *           type: integer
     *         example: 50
     *         required: false
     *         default: 200
     *         minimum: 1
     *     responses:
     *       200:
     *         description: Ok
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: array
     *                 description: Array of key-value-pairs, with the key being the timestamp and the value the measured value.
     *                 minItems: 2
     *                 maxItems: 2
     *                 items:
     *                   example:
     *                     - 2022-06-09T13:30:01.272+00:00
     *                     - 0.68
     *       404:
     *         description: Not found
     */
    app.get("/weather/precipitation/timeseries/:id", (req, res) => {
        return requestHandler.handle(req, res, {sensorInfo: sensorInfo});
    });
};
