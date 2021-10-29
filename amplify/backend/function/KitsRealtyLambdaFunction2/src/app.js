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

//AWS cognito
var AWS = require('aws-sdk')
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider()

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

app.get('/contractors', function(req, res) {

  pool.getConnection(function(error, connection) {

    var query = "SELECT * \
    FROM CONTRACTOR \
    LEFT OUTER JOIN CONTRACTOR_TYPE ON CONTRACTOR.CONTRACTOR_TYPE_ID = CONTRACTOR_TYPE.CONTRACTOR_TYPE_ID \
    LEFT OUTER JOIN USERS ON CONTRACTOR.CONTRACTOR_COGNITO_ID = USERS.USER_COGNITO_ID \
    LEFT OUTER JOIN USER_ROLE ON USERS.ROLE_ID = USER_ROLE.ROLE_ID;"

    connection.query(query, function(err, rows, fields) {
      if (err) throw err

      res.json({ contractors: rows })

      connection.release()
    })

  })

});

app.get('/employees', function(req, res) {

  pool.getConnection(function(error, connection) {

    var query = "SELECT * \
    FROM USERS \
    LEFT OUTER JOIN USER_ROLE ON USERS.ROLE_ID = USER_ROLE.ROLE_ID \
    WHERE USER_ROLE_DESCRIPTION = 'Employee';"

    connection.query(query, function(err, rows, fields) {
      if (err) throw err

      res.json({ employees: rows })

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


  
});

app.post('/property-contractor', function(req, res) {

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

    let addressQuery = "INSERT INTO PROPERTY_ADDRESS (ADDRESS, CITY, COUNTY, ZIPCODE, STATE) \
    VALUES (" + addQuotes(newProperty.address.address) + ", " + addQuotes(newProperty.address.city) + ", " + addQuotes(newProperty.address.county) + ", " + addQuotes(newProperty.address.zipcode) + ", " + addQuotes(newProperty.address.state) + ");"

    let essentialsQuery = "INSERT INTO PROPERTY_ESSENTIALS (PROPERTY_TYPE, NUM_BEDS, NUM_BATHS, LAND_FOOTAGE, PROPERTY_FOOTAGE, YEAR_BUILT, ZILLOW_LINK) \
    VALUES (" + addQuotes(newProperty.essentials.propertyType) + ", " + newProperty.essentials.numBeds + ", " + newProperty.essentials.numBaths + ", " + newProperty.essentials.landFootage + ", " + newProperty.essentials.propertyFootage + ", " + newProperty.essentials.yearBuilt + ", " + addQuotes(newProperty.essentials.zillowLink) + ");"

    let pricesQuery = "INSERT INTO PROPERTY_PRICES (BUY_VALUE, EXPECTED_VALUE, SELL_VALUE, BIDDING_PRICE, MARKET_PRICE) \
    VALUES (" + newProperty.prices.buyValue + ", " + newProperty.prices.expectedValue + ", " + newProperty.prices.sellValue + ", " + newProperty.prices.biddingPrice + ", " + newProperty.prices.marketPrice + ");"

    let auctionQuery = "INSERT INTO PROPERTY_AUCTION (AUCTION_LOCATION, DATE_OF_AUCTION) \
    VALUES (" + addQuotes(newProperty.auction.auctionLocation) + ", " + addQuotes(newProperty.auction.dateOfAuction) + ");"

    let loanQuery = "INSERT INTO PROPERTY_LOAN (AMOUNT, MONTH, YEAR) \
    VALUES (" + newProperty.loan.amount + ", " + newProperty.loan.month + ", " + newProperty.loan.year + ");"

    connection.query(addressQuery, function(err, addressRows, fields) {

      if (err) throw err   

      connection.query(essentialsQuery, function(err, essentialsRows, fields) {

        if (err) throw err   

        connection.query(pricesQuery, function(err, pricesRows, fields) {

          if (err) throw err   

          connection.query(auctionQuery, function(err, auctionRows, fields) {

            if (err) throw err   

            connection.query(loanQuery, function(err, loanRows, fields) {

              if (err) throw err   

              let propertyQuery = "INSERT INTO PROPERTY (DATE_OF_PURCHASE, DATE_OF_SALE, TRUSTEE_NAME, SUBDIVISION, COUNTY_ASSESSMENT, NOTES, STATUS_ID, OCCUPANCY_STATUS_ID, ADDRESS_ID, ESSENTIALS_ID, PRICES_ID, AUCTION_ID, LOAN_ID) \
              VALUES (" + addQuotes(newProperty.dateOfPurchase) + ", " + addQuotes(newProperty.dateOfSale) + ", " + addQuotes(newProperty.trusteeName) + ", " + addQuotes(newProperty.subdivision) + ", " + addQuotes(newProperty.countyAssessment) + ", " + addQuotes(newProperty.notes) + ", " + newProperty.status.statusId + ", " + newProperty.occupancyStatus.occupancyStatusId + ", " + addressRows.insertId + ", " + essentialsRows.insertId + ", " + pricesRows.insertId + ", " + auctionRows.insertId + ", " + loanRows.insertId + ");"

              connection.query(propertyQuery, function(err, rows, fields) {
                if (err) throw err   

                res.json(rows.insertId)
                connection.release()

              })

            })

          })

        })

      })

    })

  })

});

app.post('/users', function(req, res) {
  var params = {
    UserPoolId: 'us-east-1_MQXokLX98',
    Username: 'cjett@gmu.edu',
    UserAttributes: [
      {
        Name: 'email',
        Value: 'cjett@gmu.edu'
      },
    ],
    ValidationData: [
      {
        Name: 'email_verified',
        Value: 'true'
      },
    ]
  };
  
  cognitoidentityserviceprovider.adminCreateUser(params, function(err, data) {
    if (err) throw err

    res.json(data);
  });
});

app.post('/properties/*', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

/****************************
* Example put method *
****************************/

app.put('/properties', function(req, res) {
  
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

app.put('/contractors', function(req, res) {
  let newContractor = req.body.contractor;

  pool.getConnection(function(error, connection) {

    let query = "UPDATE CONTRACTOR \
    SET \
      CONTRACTOR_TYPE_ID = " + newContractor.contractorType.contractorTypeId + ", \
      DATE_HIRED = " + addQuotes(newContractor.dateHired) + ", \
      START_DATE = " + addQuotes(newContractor.startDate) + ", \
      END_DATE = " + addQuotes(newContractor.endDate) + ", \
      COMPANY = " + addQuotes(newContractor.company) + ", \
    WHERE CONTRACTOR_COGNITO_ID = " + newContractor.contractorCognitoId + ";"

    connection.query(query, function(err, rows, fields) {
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
      }
      else {
        res.json({ error: "property is connected to a revenue" });
        connection.release()
      }
    })
  })
});

app.delete('/contractors', function(req, res) {
  
});

app.delete('/property-contractor', function(req, res) {

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

function addQuotes(value) {
  return (typeof value == "string") && (value != null) ? `'${value}'` : value;
}

module.exports = app