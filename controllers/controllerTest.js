const db = require("../models");
const Test = db.Test;

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
