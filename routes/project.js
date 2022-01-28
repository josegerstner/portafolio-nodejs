const express = require("express");

// projectRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /project.
const projectRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;


// This section will help you get a list of all the projects.
projectRoutes.route("/projects").get(function (req, res) {
  let db_connect = dbo.getDb("myPortfolioData");
  db_connect
    .collection("projects")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you get a single project by id
projectRoutes.route("/project/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect
      .collection("projects")
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
});

// This section will help you create a new project.
projectRoutes.route("/project/add").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
    project_dates: req.body.project_dates,
    project_name: req.body.project_name,
    project_project: req.body.project_project,
    project_tasks: req.body.project_tasks,
    project_image: req.body.project_image,
    project_link: req.body.project_link,
  };
  db_connect.collection("projects").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

// This section will help you update a project by id.
projectRoutes.route("/update/project/:id").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  let newvalues = {
    $set: {
      project_dates: req.body.project_dates,
      project_name: req.body.project_name,
      project_project: req.body.project_project,
      project_tasks: req.body.project_tasks,
      project_image: req.body.project_image,
      project_link: req.body.project_link,
    },
  };
  db_connect
    .collection("projects")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 project updated");
      response.json(res);
    });
});

// This section will help you delete a project
projectRoutes.route("/project/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect.collection("projects").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 project deleted");
    response.status(obj);
  });
});

module.exports = projectRoutes;