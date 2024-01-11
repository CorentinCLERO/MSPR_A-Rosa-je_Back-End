const db = require("../models");
const User = db.User;

// Retrieve all Utilisateurs from the database.
exports.find = (req, res) => {
    User.findAll({})
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving utilisateurs."
            });
        });
};
module.exports = exports