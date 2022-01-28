const express = require("express");

// educationRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /education.
const educationRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;


// This section will help you get a list of all the education.
educationRoutes.route("/education").get(function (req, res) {
  let db_connect = dbo.getDb("myPortfolioData");
  db_connect
    .collection("education")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you get a single education by id
educationRoutes.route("/education/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect
      .collection("education")
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
});

// This section will help you create a new education.
educationRoutes.route("/education/add").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
    education_name: req.body.education_name,
    education_dates: req.body.education_dates,
    education_title: req.body.education_title,
    education_image: req.body.education_image,
    education_link: req.body.education_link,
  };
  db_connect.collection("education").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

// This section will help you update a education by id.
educationRoutes.route("/education/update/:id").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  let newvalues = {
    $set: {
        education_name: req.body.education_name,
        education_dates: req.body.education_dates,
        education_title: req.body.education_title,
        education_image: req.body.education_image,
        education_link: req.body.education_link,
    },
  };
  db_connect
    .collection("education")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 education updated");
      response.json(res);
    });
});

// This section will help you delete a education
educationRoutes.route("/education/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect.collection("education").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 education deleted");
    response.status(obj);
  });
});

module.exports = educationRoutes;