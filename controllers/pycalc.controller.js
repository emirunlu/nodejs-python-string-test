const db = require("../config/sequelize");
const pyShell = require('python-shell');
const pyCalc = db.pycalc;

exports.calculateString = (req, res) => {

    const calcs = [];
    let order = 1;

    pyShell.PythonShell.run("py/calculate.py",
        null,
        function(err, results) {
            if (err) throw err;

            const data = JSON.parse(results);
            data.forEach(function(elem) {
                const calc = {
                    character: elem,
                    order: order
                };
                calcs.push(calc);
                order++;
            });

            pyCalc.bulkCreate(calcs)
                .then(data => {
                    res.send(data);
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "error: Error occurred inputting to database!"
                    });
                });
        });

};