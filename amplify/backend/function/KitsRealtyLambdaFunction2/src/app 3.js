/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  res.header("Access-Control-Allow-Methods", "*")
  res.header("Access-Control-Allow-Credentials", "true")
  next()
});

//mysql connection
var mysql = require('mysql')
var pool = mysql.createPool({
  host: 'kits-realty-database.cf0sfrzxd9g7.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: 'kitsrealty88',
  database: 'KITS_REALTY'
})

/**********************
 * Example get method *
 **********************/

app.get('/properties', function(req, res) {

  pool.getConnection(function(error, connection) {

    var query = "SELECT * \
    FROM PROPERTY \
    LEFT OUTER JOIN PROPERTY_STATUS ON PROPERTY.STATUS_ID = PROPERTY_STATUS.STATUS_ID \
    LEFT OUTER JOIN OCCUPANCY_STATUS ON PROPERTY.OCCUPANCY_STATUS_ID = OCCUPANCY_STATUS.OCCUPANCY_STATUS_ID \
    LEFT OUTER JOIN USERS ON PROPERTY.COORDINATOR_COGNITO_ID = USERS.USER_COGNITO_ID \
    LEFT OUTER JOIN PROPERTY_AUCTION ON PROPERTY.AUCTION_ID = PROPERTY_AUCTION.AUCTION_ID \
    LEFT OUTER JOIN PROPERTY_PRICES ON PROPERTY.PRICES_ID = PROPERTY_PRICES.PRICES_ID \
    LEFT OUTER JOIN PROPERTY_ADDRESS ON PROPERTY.ADDRESS_ID = PROPERTY_ADDRESS.ADDRESS_ID \
    LEFT OUTER JOIN PROPERTY_ESSENTIALS ON PROPERTY.ESSENTIALS_ID = PROPERTY_ESSENTIALS.ESSENTIALS_ID \
    LEFT OUTER JOIN PROPERTY_LOAN ON PROPERTY.LOAN_ID = PROPERTY_LOAN.LOAN_ID \
    LEFT OUTER JOIN USER_ROLE ON USERS.ROLE_ID = USER_ROLE.ROLE_ID;"

    connection.query(query, function(err, rows, fields) {
      if (err) throw err

      res.json({ properties: rows })

      connection.release()
    })

  })
  
});

app.get('/properties/*', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

app.get('/contractors/:propertyid', function(req, res) {

  pool.getConnection(function(error, connection) {

    var query = "SELECT * \
    FROM PROPERTY_CONTRACTOR \
    LEFT OUTER JOIN CONTRACTOR ON PROPERTY_CONTRACTOR.CONTRACTOR_COGNITO_ID = CONTRACTOR.CONTRACTOR_COGNITO_ID \
    LEFT OUTER JOIN CONTRACTOR_TYPE ON CONTRACTOR.CONTRACTOR_TYPE_ID = CONTRACTOR_TYPE.CONTRACTOR_TYPE_ID \
    LEFT OUTER JOIN USERS ON CONTRACTOR.CONTRACTOR_COGNITO_ID = USERS.USER_COGNITO_ID \
    LEFT OUTER JOIN USER_ROLE ON USERS.ROLE_ID = USER_ROLE.ROLE_ID \
    WHERE PROPERTY_ID = " + req.params.propertyid + ";"

    connection.query(query, function(err, rows, fields) {
      if (err) throw err

      res.json({ contractors: rows })

      connection.release()
    })

  })
  
});

/****************************
* Example post method *
****************************/

app.post('/properties', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

app.post('/properties/*', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

/****************************
* Example put method *
****************************/

app.put('/properties', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.put('/properties/*', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

/****************************
* Example delete method *
****************************/

app.delete('/properties', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.delete('/properties/*', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app