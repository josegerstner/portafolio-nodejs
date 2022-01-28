const express = require("express");

// profileRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /profile.
const profileRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;


// This section will help you get a list of all the profiles.
profileRoutes.route("/profiles").get(function (req, res) {
  let db_connect = dbo.getDb("myPortfolioData");
  db_connect
    .collection("profiles")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you get a single profile by id
profileRoutes.route("/profile/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect
      .collection("profiles")
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
});

// This section will help you create a new profile.
profileRoutes.route("/profile/add").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
    profile_dates: req.body.profile_dates,
    profile_name: req.body.profile_name,
    profile_profile: req.body.profile_profile,
    profile_tasks: req.body.profile_tasks,
    profile_image: req.body.profile_image,
    profile_link: req.body.profile_link,
  };
  db_connect.collection("profiles").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

// This section will help you update a profile by id.
profileRoutes.route("/profile/update/:id").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  let newvalues = {
    $set: {
      profile_dates: req.body.profile_dates,
      profile_name: req.body.profile_name,
      profile_profile: req.body.profile_profile,
      profile_tasks: req.body.profile_tasks,
      profile_image: req.body.profile_image,
      profile_link: req.body.profile_link,
    },
  };
  db_connect
    .collection("profiles")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 profile updated");
      response.json(res);
    });
});

// This section will help you delete a profile
profileRoutes.route("/profile/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect.collection("profiles").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 profile deleted");
    response.status(obj);
  });
});

module.exports = profileRoutes;