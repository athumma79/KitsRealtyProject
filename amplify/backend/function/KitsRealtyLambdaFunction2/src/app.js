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

/****************************
* Example post method *
****************************/

app.post('/contractors', function(req, res) {

  pool.getConnection(function(error, connection) {

    var query = "SELECT * \
    FROM PROPERTY_CONTRACTOR \
    LEFT OUTER JOIN CONTRACTOR ON PROPERTY_CONTRACTOR.CONTRACTOR_COGNITO_ID = CONTRACTOR.CONTRACTOR_COGNITO_ID \
    LEFT OUTER JOIN CONTRACTOR_TYPE ON CONTRACTOR.CONTRACTOR_TYPE_ID = CONTRACTOR_TYPE.CONTRACTOR_TYPE_ID \
    LEFT OUTER JOIN USERS ON CONTRACTOR.CONTRACTOR_COGNITO_ID = USERS.USER_COGNITO_ID \
    LEFT OUTER JOIN USER_ROLE ON USERS.ROLE_ID = USER_ROLE.ROLE_ID \
    WHERE PROPERTY_ID = " + req.body.propertyId + ";"

    connection.query(query, function(err, rows, fields) {
      if (err) throw err

      res.json({ contractors: rows })

      connection.release()
    })

  })
  
});

app.post('/revenues', function(req, res) {

  pool.getConnection(function(error, connection) {

    var query = "SELECT * \
    FROM REVENUE \
    LEFT OUTER JOIN PROPERTY ON REVENUE.PROPERTY_ID = PROPERTY.PROPERTY_ID \
    LEFT OUTER JOIN CONTRACTOR ON REVENUE.CONTRACTOR_COGNITO_ID = CONTRACTOR.CONTRACTOR_COGNITO_ID \
    LEFT OUTER JOIN EXPENSE_STATUS ON REVENUE.EXPENSE_STATUS_ID = EXPENSE_STATUS.EXPENSE_STATUS_ID"

    if (req.body.propertyId) {
      query += " WHERE REVENUE.PROPERTY_ID = " + req.body.propertyId
    }
    
    query += ";"

    connection.query(query, function(err, rows, fields) {
      if (err) throw err

      res.json({ revenues: rows })

      connection.release()
    })

  })
  
});

app.post('/properties', function(req, res) {
  
  let newProperty = req.body.property;

  pool.getConnection(function(error, connection) {

    let propertyQuery = "INSERT INTO PROPERTY (DATE_OF_PURCHASE, DATE_OF_SALE, TRUSTEE_NAME, SUBDIVISION, COUNTY_ASSESSMENT, NOTES, PROPERTY_STATUS_ID, OCCUPANCY_STATUS_ID) \
    VALUES (" + newProperty.dateOfPurchase + ", " + newProperty.dateOfSale + ", " + newProperty.trusteeName + ", " + newProperty.subdivision + ", " + newProperty.countyAssessment + ", " + newProperty.notes + newProperty.status.statusId + ", "
    propertyQuery += (newProperty.occupancyStatus) ? newProperty.occupancyStatus.occupancyStatusId : null;
    propertyQuery += ");"

    let addressQuery = "INSERT INTO PROPERTY_ADDRESS (ADDRESS, CITY, COUNTY, ZIPCODE, STATE) \
    VALUES (" + newProperty.address.address + ", " + newProperty.address.city + ", " + newProperty.address.county + ", " + newProperty.address.zipcode + ", " + newProperty.address.state + ");"

    let essentialsQuery = "INSERT INTO PROPERTY_ESSENTIALS (PROPERTY_TYPE, NUM_BEDS, NUM_BATHS, LAND_FOOTAGE, PROPERTY_FOOTAGE, YEAR_BUILT, ZILLOW_LINK) \
    VALUES (" 
    essentialsQuery += (newProperty.essentials) ? (newProperty.essentials.propertyType + ", " + newProperty.essentials.numBeds + ", " + newProperty.essentials.numBaths + ", " + newProperty.essentials.landFootage + ", " + newProperty.essentials.propertyFootage + ", " + newProperty.essentials.yearBuilt + ", " + newProperty.essentials.zillowLink) : (null + ", " + null + ", " + null + ", " + null + ", " + null + ", " + null + ", " + null) 
    essentialsQuery += ");"

    let pricesQuery = "INSERT INTO PROPERTY_PRICES (BUY_VALUE, EXPECTED_VALUE, SELL_VALUE, BIDDING_PRICE, MARKET_PRICE) \
    VALUES ("
    pricesQuery += (newProperty.prices) ? (newProperty.prices.buyValue + ", " + newProperty.prices.expectedValue + ", " + newProperty.prices.sellValue + ", " + newProperty.prices.biddingPrice + ", " + newProperty.prices.marketPrice) : (null + ", " + null + ", " + null + ", " + null + ", " + null)
    pricesQuery += ");"

    let auctionQuery = "INSERT INTO PROPERTY_AUCTION (AUCTION_LOCATION, DATE_OF_AUCTION) \
    VALUES ("
    auctionQuery += (newProperty.auction) ? (newProperty.auction.auctionLocation + ", " + newProperty.auction.dateOfAuction) : (null + ", " + null)
    auctionQuery += ");"

    let loanQuery = "INSERT INTO PROPERTY_LOAN (AMOUNT, MONTH, YEAR) \
    VALUES (" +  + ");"
    loanQuery += (newProperty.loan) ? (newProperty.loan.amount + ", " + newProperty.loan.month + ", " + newProperty.loan.year) : (null + ", " + null + ", " + null)
    loanQuery += ");"

    connection.query(addressQuery, function(err, rows, fields) {
      res.json(rows);
      if (err) throw err   
    })

    connection.query(essentialsQuery, function(err, rows, fields) {
      if (err) throw err   
    })

    connection.query(pricesQuery, function(err, rows, fields) {
      if (err) throw err   
    })

    connection.query(auctionQuery, function(err, rows, fields) {
      if (err) throw err   
    })

    connection.query(loanQuery, function(err, rows, fields) {
      if (err) throw err   
    })

    connection.query(propertyQuery, function(err, rows, fields) {
      if (err) throw err   
    })

    res.json()
    connection.release()
  })

});

app.post('/properties/*', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

/****************************
* Example put method *
****************************/

app.put('/properties', function(req, res) {

  // res.json({coordinator: (req.body.property.coordinator == null)});
  
  let newProperty = req.body.property;

  pool.getConnection(function(error, connection) {

    let propertyQuery = "UPDATE PROPERTY \
    SET \
      NOTES = '" + newProperty.notes + "', \
      DATE_OF_PURCHASE = '" + newProperty.dateOfPurchase + "', \
      TRUSTEE_NAME = '" + newProperty.trusteeName + "', \
      DATE_OF_SALE = '" + newProperty.dateOfSale + "', \
      SUBDIVISION = '" + newProperty.subdivision + "', \
      COUNTY_ASSESSMENT = '" + newProperty.countyAssessment + "', \
      STATUS_ID = " + newProperty.status.statusId + ", \
      OCCUPANCY_STATUS_ID = " + newProperty.occupancyStatus.occupancyStatusId + ", \
      COORDINATOR_COGNITO_ID = ";

    propertyQuery += (newProperty.coordinator != null) ? newProperty.coordinator.userCognitoId : null;

    propertyQuery += " WHERE PROPERTY_ID = " + newProperty.propertyId + ";"

    let addressQuery = "UPDATE PROPERTY_ADDRESS \
    SET \
      ADDRESS = '" + newProperty.address.address + "', \
      CITY = '" + newProperty.address.city + "', \
      COUNTY = '" + newProperty.address.county + "', \
      STATE = '" + newProperty.address.state + "', \
      ZIPCODE = '" + newProperty.address.zipcode + "' \
    WHERE ADDRESS_ID = " + newProperty.address.addressId + ";"

    let essentialsQuery = "UPDATE PROPERTY_ESSENTIALS \
    SET \
      PROPERTY_TYPE = '" + newProperty.essentials.propertyType + "', \
      NUM_BEDS = " + newProperty.essentials.numBeds + ", \
      LAND_FOOTAGE = " + newProperty.essentials.landFootage + ", \
      YEAR_BUILT = " + newProperty.essentials.yearBuilt + ", \
      NUM_BATHS = " + newProperty.essentials.numBaths + ", \
      PROPERTY_FOOTAGE = " + newProperty.essentials.propertyFootage + ", \
      ZILLOW_LINK = '" + newProperty.essentials.zillowLink + "' \
    WHERE ESSENTIALS_ID = " + newProperty.essentials.essentialsId + ";"

    connection.query(propertyQuery, function(err, rows, fields) {
      if (err) throw err   
    })

    connection.query(addressQuery, function(err, rows, fields) {
      if (err) throw err   
    })

    connection.query(essentialsQuery, function(err, rows, fields) {
      if (err) throw err   
    })

    res.json()
    connection.release()
  })

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

app.delete('/properties', function(req, res) {
  pool.getConnection(function(error, connection) {

    var propertyRevenuesQuery = "SELECT * FROM REVENUE \
    WHERE PROPERTY_ID = " + req.body.propertyId;

    connection.query(propertyRevenuesQuery, function(err, rows, fields) {
      if (err) throw err

      if (rows.length == 0) {
        var propertyDependenciesQuery = "SELECT PRICES_ID, ADDRESS_ID, ESSENTIALS_ID, LOAN_ID \
        FROM PROPERTY \
        WHERE PROPERTY_ID = " + req.body.propertyId;

        connection.query(propertyDependenciesQuery, function(err, dependenciesRows, fields) {
          if (err) throw err

          var propertyContractorQuery = "DELETE FROM PROPERTY_CONTRACTOR \
          WHERE PROPERTY_ID = " + req.body.propertyId;

          connection.query(propertyContractorQuery, function(err, rows, fields) {
            if (err) throw err     
            
            var nearbyPropertiesQuery = "DELETE FROM NEARBY_PROPERTY \
            WHERE PROPERTY_ID = " + req.body.propertyId;

            connection.query(nearbyPropertiesQuery, function(err, rows, fields) {
              if (err) throw err    
              
              var propertyQuery = "DELETE FROM PROPERTY \
              WHERE PROPERTY_ID = " + req.body.propertyId;
    
              connection.query(propertyQuery, function(err, rows, fields) {
                if (err) throw err    

                if (dependenciesRows[0].PRICES_ID) {
                  var pricesQuery = "DELETE FROM PROPERTY_PRICES \
                  WHERE PRICES_ID = " + dependenciesRows[0].PRICES_ID;
      
                  connection.query(pricesQuery, function(err, rows, fields) {
                    if (err) throw err        
                  })
                }
                if (dependenciesRows[0].ADDRESS_ID) {
                  var addressQuery = "DELETE FROM PROPERTY_ADDRESS \
                  WHERE ADDRESS_ID = " + dependenciesRows[0].ADDRESS_ID;
      
                  connection.query(addressQuery, function(err, rows, fields) {
                    if (err) throw err        
                  })
                }
                if (dependenciesRows[0].ESSENTIALS_ID) {
                  var essentialsQuery = "DELETE FROM PROPERTY_ESSENTIALS \
                  WHERE ESSENTIALS_ID = " + dependenciesRows[0].ESSENTIALS_ID;
      
                  connection.query(essentialsQuery, function(err, rows, fields) {
                    if (err) throw err        
                  })
                }
                if (dependenciesRows[0].LOAN_ID) {
                  var loanQuery = "DELETE FROM PROPERTY_LOAN \
                  WHERE LOAN_ID = " + dependenciesRows[0].LOAN_ID;
      
                  connection.query(loanQuery, function(err, rows, fields) {
                    if (err) throw err        
                  })
                }
                
                res.json();
                connection.release()
              })
            })
          })
        })
      }
      else {
        res.json({ error: "property is connected to a revenue" });
        connection.release()
      }
    })
  })
});

app.delete('/contractors', function(req, res) {

  pool.getConnection(function(error, connection) {

    var query = "DELETE FROM PROPERTY_CONTRACTOR \
    WHERE PROPERTY_ID = " + req.body.propertyId + "\
    AND CONTRACTOR_COGNITO_ID = " + req.body.contractorCognitoId + ";"

    connection.query(query, function(err, rows, fields) {
      if (err) throw err

      res.json()

      connection.release()
    })

  })
  
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app