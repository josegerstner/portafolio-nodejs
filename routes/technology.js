const express = require("express");

// technologyRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /technology.
const technologyRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;


// This section will help you get a list of all the technologies.
technologyRoutes.route("/technologies").get(function (req, res) {
  let db_connect = dbo.getDb("myPortfolioData");
  db_connect
    .collection("technologies")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you get a single technology by id
technologyRoutes.route("/technology/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect
      .collection("technologies")
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
});

// This section will help you create a new technology.
technologyRoutes.route("/technology/add").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
    technology_dates: req.body.technology_dates,
    technology_name: req.body.technology_name,
    technology_technology: req.body.technology_technology,
    technology_tasks: req.body.technology_tasks,
    technology_image: req.body.technology_image,
    technology_link: req.body.technology_link,
  };
  db_connect.collection("technologies").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

// This section will help you update a technology by id.
technologyRoutes.route("/update/technology/:id").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  let newvalues = {
    $set: {
      technology_dates: req.body.technology_dates,
      technology_name: req.body.technology_name,
      technology_technology: req.body.technology_technology,
      technology_tasks: req.body.technology_tasks,
      technology_image: req.body.technology_image,
      technology_link: req.body.technology_link,
    },
  };
  db_connect
    .collection("technologies")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 technology updated");
      response.json(res);
    });
});

// This section will help you delete a technology
technologyRoutes.route("/technology/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect.collection("technologies").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 technology deleted");
    response.status(obj);
  });
});

module.exports = technologyRoutes;