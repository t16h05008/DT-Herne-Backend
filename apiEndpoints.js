const requestHandler = require("./requestHandler")

module.exports.setup = (app, dbConnection) => {

    /**
     * @swagger
     * /buildings/tilesInfo:
     *   get:
     *     description: Gets a json document, that contains information about the building tiles.
     *     responses:
     *       '200':
     */
    app.get("/buildings/tilesInfo", (req, res) => {
        return requestHandler.handle(req, res, dbConnection);
    });


    // TODO documentation
    // 404
    app.get("/buildings", (req, res) => {
        return requestHandler.handle(req, res, dbConnection);
    });


    // TODO documentation
    app.get("/terrain/dem/1", (req, res) => {
        return requestHandler.handle(req, res, dbConnection);
    });


    // TODO documentation
    app.get("/terrain/dem/10", (req, res) => {
        return requestHandler.handle(req, res, dbConnection);
    });


    // TODO documentation
    app.get("/terrain/dem/25", (req, res) => {
        return requestHandler.handle(req, res, dbConnection);
    });


    // TODO documentation
    app.get("/terrain/dem/50", (req, res) => {
        return requestHandler.handle(req, res, dbConnection);
    });


    /**
     * TODO documentation
     * Gets the bboxInfo for sewer shafts (points)
     */
     app.get("/sewers/shafts/points/bboxInfo", (req, res) => {
        return requestHandler.handle(req, res, dbConnection);
    });


    /**
     * TODO documentation
     * Gets all sewer shafts (points).
     * Optionally a search parameter "ids" can ba passed, containing a comma separated list of ids
     * TODO this approach will explode once the url get too long, but for the amount of data we work with now it is ok.
     * Firefox and Chrome can handle 100k+ characters
     */
    app.get("/sewers/shafts/points", (req, res) => {
        return requestHandler.handle(req, res, dbConnection);
    });


    /**
     * TODO documentation
     * Gets the bboxInfo for sewer shafts (lines)
     */
     app.get("/sewers/shafts/lines/bboxInfo", (req, res) => {
        return requestHandler.handle(req, res, dbConnection);
    });


    /**
     * TODO documentation
     * Gets all sewer shafts (lines)
     */
    app.get("/sewers/shafts/lines", (req, res) => {
        return requestHandler.handle(req, res, dbConnection);
    });


    /**
     * TODO documentation
     * Gets the bboxInfo for sewer pipes
     */
    app.get("/sewers/pipes/bboxInfo", (req, res) => {
        return requestHandler.handle(req, res, dbConnection);
    });


    /**
     * TODO documentation
     * Gets all sewer pipes
     */
    app.get("/sewers/pipes", (req, res) => {
        return requestHandler.handle(req, res, dbConnection);
    });
}