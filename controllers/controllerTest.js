const db = require("../models");
const Test = db.Test;

// Retrieve all Tests from the database.
exports.find = async (req, res) => {
  try {
    const data = await Test.findAll({});
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving tests."
    });
  }
};
module.exports = exports;
