const db = require("../models");
const Test = db.Test;

// Retrieve all Utilisateurs from the database.
exports.find = (req, res) => {
    Test.findAll({})
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving utilisateurs."
            });
        });
};
module.exports = exports