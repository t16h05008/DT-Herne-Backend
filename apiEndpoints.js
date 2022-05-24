const requestHandler = require("./requestHandler");

module.exports.setup = (app, dbConnection) => {

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
        return requestHandler.handle(req, res, dbConnection);
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
        return requestHandler.handle(req, res, dbConnection);
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
        return requestHandler.handle(req, res, dbConnection);
    });

    /**
     * @swagger
     * /terrain/dem/{resolution}:
     *   get:
     *     summary: Gets a json document, that contains information about the format and file structure the terrain is stored in
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
        return requestHandler.handle(req, res, dbConnection);
    });

    /**
     * @swagger
     * /sewers/shafts/points/bboxInfo:
     *   get:
     *     summary: Gets a json document, that contains information about the bounding boxes of sewer shafts.
     *     description: Of course, getting the bounding boy of a point has little to no use.
     *                  This endpoint only exists to have a consistent way to get this information for all types of sewer geometries.
     *     tags:
     *       - sewers
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Ok
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal Server Error
     */
    app.get("/sewers/shafts/points/bboxInfo", (req, res) => {
        return requestHandler.handle(req, res, dbConnection);
    });

    /**
     * @swagger
     * /sewers/shafts/points:
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
    app.get("/sewers/shafts/points", (req, res) => {
        return requestHandler.handle(req, res, dbConnection);
    });

    /**
     * @swagger
     * /sewers/shafts/lines/bboxInfo:
     *   get:
     *     summary: Gets a json document, that contains information about the bounding boxes of sewer shafts (line geometries).
     *     tags:
     *       - sewers
     *     responses:
     *       200:
     *         description: Ok
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal Server Error
     */
    app.get("/sewers/shafts/lines/bboxInfo", (req, res) => {
        return requestHandler.handle(req, res, dbConnection);
    });

    /**
     * @swagger
     * /sewers/shafts/lines:
     *   get:
     *     summary: Gets the sewer shafts as geoJson line geometries (feature collection).
     *     description: Each line is vertical and represents the depth of the shaft.
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
    app.get("/sewers/shafts/lines", (req, res) => {
        return requestHandler.handle(req, res, dbConnection);
    });

    /**
     * @swagger
     * /sewers/pipes/bboxInfo:
     *   get:
     *     summary: Gets a json document, that contains information about the bounding boxes of sewer pipes.
     *     tags:
     *       - sewers
     *     responses:
     *       200:
     *         description: Ok
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *       404:
     *         description: Not found
     *       500:
     *         description: Internal Server Error
     */
    app.get("/sewers/pipes/bboxInfo", (req, res) => {
        return requestHandler.handle(req, res, dbConnection);
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
        return requestHandler.handle(req, res, dbConnection);
    });


    // TODO document
    app.get("/metrostation/pointcloud", (req, res) => {
        return requestHandler.handle(req, res, dbConnection);
    });
};