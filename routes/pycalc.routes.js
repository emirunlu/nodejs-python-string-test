module.exports = app => {
    const pyCalc = require("../controllers/pycalc.controller.js");

    var router = require("express").Router();

    router.put("/", pyCalc.calculateString);

    app.use('/api/pycalc', router);
};