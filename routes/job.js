const express = require("express");

// jobRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /job.
const jobRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// This section will help you get a list of all the jobs.
jobRoutes.route("/jobs").get(function (req, res) {
  let db_connect = dbo.getDb("myPortfolioData");
  db_connect
    .collection("jobs")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you get a single job by id
jobRoutes.route("/job/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("jobs").findOne(myquery, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

// This section will help you create a new job.
jobRoutes.route("/job/add").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
    job_dates: req.body.job_dates,
    job_name: req.body.job_name,
    job_job: req.body.job_job,
    job_tasks: req.body.job_tasks,
    job_image: req.body.job_image,
    job_link: req.body.job_link,
  };
  db_connect.collection("jobs").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

// This section will help you update a job by id.
jobRoutes.route("/job/update/:id").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  let newvalues = {
    $set: {
      job_dates: req.body.job_dates,
      job_name: req.body.job_name,
      job_job: req.body.job_job,
      job_tasks: req.body.job_tasks,
      job_image: req.body.job_image,
      job_link: req.body.job_link,
    },
  };
  db_connect
    .collection("jobs")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 job updated");
      response.json(res);
    });
});

// This section will help you delete a job
jobRoutes.route("/job/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("jobs").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 job deleted");
    response.status(obj);
  });
});

module.exports = jobRoutes;
