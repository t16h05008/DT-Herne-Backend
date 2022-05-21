const requestHandler = require("./requestHandler");

module.exports.setup = (app, dbConnection) => {
    /**
     * @swagger
     * /buildings/tilesInfo:
     *   get:
     *     description: Gets a json document, that contains information about the building tiles.
     *     tags:
     *       - buildings
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Ok
     *       404:
     *         description: Not found
     */
    app.get("/buildings/tilesInfo", (req, res) => {
        return requestHandler.handle(req, res, dbConnection);
    });

    /**
     * @swagger
     * /buildings:
     *   get:
     *     description: Gets the buildings in glTF format.
     *     tags:
     *       - buildings
     *     parameters:
     *       - in: query
     *         name: ids
     *         description: The numeric, comma-separated ids of the buildings to query. Ids are ascending integers, starting at 1.
     *         example: 1,3,5
     *         minimum: 1
     *         type: array
     *         collectionFormat: csv
     *         items:
     *           type: integer
     *         required: false
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Ok
     *       404:
     *         description: Not found
     */
    app.get("/buildings", (req, res) => {
        return requestHandler.handle(req, res, dbConnection);
    });

    /**
     * @swagger
     * /terrain/dem/{resolution}:
     *   get:
     *     description: Gets a json document, that contains information about the format and file structure the terrain is stored in.
     *                  Clients can use the information in this document to directly request terrain files from the server's file system.
     *     tags:
     *       - terrain
     *     parameters:
     *       - in: path
     *         name: ids
     *         description: The resolution of the dem.
     *         type: integer
     *         enum: [1, 10, 25, 50]
     *         required: true
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Ok
     *       404:
     *         description: Not found
     */
    app.get("/terrain/dem/:resolution", (req, res) => {
        return requestHandler.handle(req, res, dbConnection);
    });

    /**
     * @swagger
     * /sewers/shafts/points/bboxInfo:
     *   get:
     *     description: Gets a json document, that contains information about the bounding boxes of sewer shafts.
     *                  Of course, getting the bounding boy of a point has little to no use.
     *                  This endpoint only exists to have a consistent way to get this information for all types of sewer geometries.
     *     tags:
     *       - sewers
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Ok
     *       404:
     *         description: Not found
     */
    app.get("/sewers/shafts/points/bboxInfo", (req, res) => {
        return requestHandler.handle(req, res, dbConnection);
    });

    /**
     * @swagger
     * /sewers/shafts/points:
     *   get:
     *     description: Gets the sewer shafts as geoJson point geometries (feature collection).
     *     tags:
     *       - sewers
     *     parameters:
     *       - in: query
     *         name: ids
     *         description: The numeric, comma-separated ids of the sewer shafts to query. Ids are integers.
     *         example: 1,3,5
     *         minimum: 1
     *         type: array
     *         collectionFormat: csv
     *         items:
     *           type: integer
     *         required: false
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Ok
     *       404:
     *         description: Not found
     */
    app.get("/sewers/shafts/points", (req, res) => {
        return requestHandler.handle(req, res, dbConnection);
    });

    /**
     * @swagger
     * /sewers/shafts/lines/bboxInfo:
     *   get:
     *     description: Gets a json document, that contains information about the bounding boxes of sewer shafts (line geometries).
     *     tags:
     *       - sewers
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Ok
     *       404:
     *         description: Not found
     */
    app.get("/sewers/shafts/lines/bboxInfo", (req, res) => {
        return requestHandler.handle(req, res, dbConnection);
    });

    /**
     * @swagger
     * /sewers/shafts/lines:
     *   get:
     *     description: Gets the sewer shafts as geoJson line geometries (feature collection). Each line is vertical and represents the depth of the shaft.
     *     tags:
     *       - sewers
     *     parameters:
     *       - in: query
     *         name: ids
     *         description: The numeric, comma-separated ids of the sewer shafts to query. Ids are integers.
     *         example: 1,3,5
     *         minimum: 1
     *         type: array
     *         collectionFormat: csv
     *         items:
     *           type: integer
     *         required: false
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Ok
     *       404:
     *         description: Not found
     */
    app.get("/sewers/shafts/lines", (req, res) => {
        return requestHandler.handle(req, res, dbConnection);
    });

    /**
     * @swagger
     * /sewers/pipes/bboxInfo:
     *   get:
     *     description: Gets a json document, that contains information about the bounding boxes of sewer pipes.
     *     tags:
     *       - sewers
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Ok
     *       404:
     *         description: Not found
     */
    app.get("/sewers/pipes/bboxInfo", (req, res) => {
        return requestHandler.handle(req, res, dbConnection);
    });

    /**
     * @swagger
     * /sewers/pipes:
     *   get:
     *     description: Gets the sewer pipes as geoJson line geometries (feature collection).
     *     tags:
     *       - sewers
     *     parameters:
     *       - in: query
     *         name: ids
     *         description: The numeric, comma-separated ids of the sewer pipes to query. Ids are integers.
     *         example: 1,3,5
     *         minimum: 1
     *         type: array
     *         collectionFormat: csv
     *         items:
     *           type: integer
     *         required: false
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Ok
     *       404:
     *         description: Not found
     */
    app.get("/sewers/pipes", (req, res) => {
        return requestHandler.handle(req, res, dbConnection);
    });
};
