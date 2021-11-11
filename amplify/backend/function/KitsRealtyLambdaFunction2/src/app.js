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

app.get('/contractor-users', function(req, res) {

  pool.getConnection(function(error, connection) {

    var query = `SELECT * 
    FROM USERS 
    LEFT OUTER JOIN USER_ROLE ON USERS.ROLE_ID = USER_ROLE.ROLE_ID 
    WHERE USER_ROLE_DESCRIPTION = 'Contractor';`

    connection.query(query, function(err, rows, fields) {
      if (err) throw err

      res.json({ contractors: rows })

      connection.release()
    })
  })
});

app.get('/contractors', function(req, res) {

  pool.getConnection(function(error, connection) {

    var query = `SELECT * 
    FROM CONTRACTOR 
    LEFT OUTER JOIN CONTRACTOR_TYPE ON CONTRACTOR.CONTRACTOR_TYPE_ID = CONTRACTOR_TYPE.CONTRACTOR_TYPE_ID 
    LEFT OUTER JOIN USERS ON CONTRACTOR.CONTRACTOR_COGNITO_ID = USERS.USER_COGNITO_ID 
    LEFT OUTER JOIN USER_ROLE ON USERS.ROLE_ID = USER_ROLE.ROLE_ID
    WHERE USER_ROLE_DESCRIPTION = 'Contractor';`

    connection.query(query, function(err, rows, fields) {
      if (err) throw err

      res.json({ contractors: rows })

      connection.release()
    })

  })

});

app.get('/employees', function(req, res) {

  pool.getConnection(function(error, connection) {

    var query = `SELECT * 
    FROM USERS 
    LEFT OUTER JOIN USER_ROLE ON USERS.ROLE_ID = USER_ROLE.ROLE_ID 
    WHERE USER_ROLE_DESCRIPTION = 'Employee';`

    connection.query(query, function(err, rows, fields) {
      if (err) throw err

      res.json({ employees: rows })

      connection.release()
    })

  })

});

app.get('/users', function(req, res) {
  pool.getConnection(function(error, connection) {

    var query = `SELECT * 
    FROM USERS 
    LEFT OUTER JOIN USER_ROLE ON USERS.ROLE_ID = USER_ROLE.ROLE_ID;`

    connection.query(query, function(err, rows, fields) {
      if (err) throw err

      res.json({ users: rows })

      connection.release()
    })

  })
});

app.get('/properties/*', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

app.get('/taxes', function(req, res) {
  pool.getConnection(function(error, connection) {

    var query = `SELECT * 
    FROM TAX 
    LEFT OUTER JOIN USERS ON USERS.USER_COGNITO_ID = TAX.USER_COGNITO_ID
    LEFT OUTER JOIN USER_ROLE ON USERS.ROLE_ID = USER_ROLE.ROLE_ID;`

    connection.query(query, function(err, rows, fields) {
      if (err) throw err

      res.json({ taxes: rows })

      connection.release()
    })

  })
});

/****************************
* Example post method *
****************************/

app.post('/contractors', function(req, res) {
  let contractor = req.body.contractor;
  let addToGroupParams = {
    GroupName: req.body.group,
    Username: contractor.contractorUser.userCognitoId,
    UserPoolId: 'us-east-1_MQXokLX98'
  };
  
  cognitoidentityserviceprovider.adminAddUserToGroup(addToGroupParams, function(err, data) {
    if (err) throw err

    pool.getConnection(function(error, connection) {

      var query = `INSERT INTO CONTRACTOR VALUES (${addQuotes(addToGroupParams.Username)}, ${addQuotes(contractor.contractorType.contractorTypeId)}, ${addQuotes(contractor.dateHired)}, ${addQuotes(contractor.startDate)}, ${addQuotes(contractor.endDate)}, ${addQuotes(contractor.company)} );`
      connection.query(query, function(err, rows, fields) {
        if (err) throw err
  
        res.json("Success! Contractor Type Set.")
  
        connection.release()
      })
    })
  });
});


app.post('/property-contractor', function(req, res) {

  pool.getConnection(function(error, connection) {

    var query = `SELECT * 
    FROM PROPERTY_CONTRACTOR 
    LEFT OUTER JOIN CONTRACTOR ON PROPERTY_CONTRACTOR.CONTRACTOR_COGNITO_ID = CONTRACTOR.CONTRACTOR_COGNITO_ID 
    LEFT OUTER JOIN CONTRACTOR_TYPE ON CONTRACTOR.CONTRACTOR_TYPE_ID = CONTRACTOR_TYPE.CONTRACTOR_TYPE_ID 
    LEFT OUTER JOIN USERS ON CONTRACTOR.CONTRACTOR_COGNITO_ID = USERS.USER_COGNITO_ID 
    LEFT OUTER JOIN USER_ROLE ON USERS.ROLE_ID = USER_ROLE.ROLE_ID 
    WHERE PROPERTY_ID = ${addQuotes(req.body.propertyId)};`

    connection.query(query, function(err, rows, fields) {
      if (err) throw err

      res.json({ contractors: rows })

      connection.release()
    })

  })

});

app.post('/revenues', function(req, res) {
  let revenue = req.body.revenue;
  pool.getConnection(function(error, connection) {

    var query = `INSERT INTO REVENUE (PROPERTY_ID, CONTRACTOR_COGNITO_ID, EXPENSE_STATUS_ID, REVENUE_AMOUNT, REVENUE_TYPE, EXPENSE_DUE_DATE, AMOUNT_PAID, REVENUE_DESCRIPTION, DATE_INCURRED)
    VALUES (${addQuotes(revenue.property.propertyId)}, ${addQuotes(revenue.contractor.contractorCognitoId)}, ${addQuotes(revenue.expenseStatus.expenseStatusId)}, ${addQuotes(revenue.revenueAmount)}, ${addQuotes(revenue.revenueType)}, ${addQuotes(revenue.expenseDueDate)}, ${addQuotes(revenue.amountPaid)}, ${addQuotes(revenue.revenueDescription)}, ${addQuotes(revenue.dateIncurred)});`

    connection.query(query, function(err, rows, fields) {
      if (err) throw err

      res.json( "success!" )

      connection.release()
    })

  })
  
});

app.post('/property-revenues', function(req, res) {

  pool.getConnection(function(error, connection) {

    var query = `SELECT * 
    FROM REVENUE 
    LEFT OUTER JOIN PROPERTY ON REVENUE.PROPERTY_ID = PROPERTY.PROPERTY_ID 
    LEFT OUTER JOIN CONTRACTOR ON REVENUE.CONTRACTOR_COGNITO_ID = CONTRACTOR.CONTRACTOR_COGNITO_ID 
    LEFT OUTER JOIN EXPENSE_STATUS ON REVENUE.EXPENSE_STATUS_ID = EXPENSE_STATUS.EXPENSE_STATUS_ID`
    
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

    let addressQuery = `INSERT INTO PROPERTY_ADDRESS (ADDRESS, CITY, COUNTY, ZIPCODE, STATE) 
    VALUES (${addQuotes(newProperty.address.address)}, ${addQuotes(newProperty.address.city)}, ${addQuotes(newProperty.address.county)}, ${addQuotes(newProperty.address.zipcode)}, ${addQuotes(newProperty.address.state)});`

    let essentialsQuery = `INSERT INTO PROPERTY_ESSENTIALS (PROPERTY_TYPE, NUM_BEDS, NUM_BATHS, LAND_FOOTAGE, PROPERTY_FOOTAGE, YEAR_BUILT, ZILLOW_LINK) 
    VALUES ( ${addQuotes(newProperty.essentials.propertyType)}, ${addQuotes(newProperty.essentials.numBeds)}, ${addQuotes(newProperty.essentials.numBaths)}, ${addQuotes(newProperty.essentials.numBeds)}, ${addQuotes(newProperty.essentials.landFootage)}, ${addQuotes(newProperty.essentials.propertyFootage)}, ${addQuotes(newProperty.essentials.yearBuilt)}, ${addQuotes(newProperty.essentials.zillowLink)});`

    let pricesQuery = `INSERT INTO PROPERTY_PRICES (BUY_VALUE, EXPECTED_VALUE, SELL_VALUE, BIDDING_PRICE, MARKET_PRICE) 
    VALUES (${addQuotes(newProperty.prices.buyValue)}, ${addQuotes(newProperty.prices.expectedValue)}, ${addQuotes(newProperty.prices.sellValue)}, ${addQuotes(newProperty.prices.biddingPrice)}, ${addQuotes(newProperty.prices.marketPrice)});`

    let auctionQuery = `INSERT INTO PROPERTY_AUCTION (AUCTION_LOCATION, DATE_OF_AUCTION) 
    VALUES (${addQuotes(newProperty.auction.auctionLocation)}, ${addQuotes(newProperty.auction.dateOfAuction)});`

    let loanQuery = `INSERT INTO PROPERTY_LOAN (AMOUNT, MONTH, YEAR) 
    VALUES (${addQuotes(newProperty.loan.amount)}, ${addQuotes(newProperty.loan.month)}, ${addQuotes(newProperty.loan.year)});`

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
  let user = req.body.user

  var createUserParams = {
    UserPoolId: 'us-east-1_MQXokLX98',
    Username: user.email,
    UserAttributes: [
      {
        Name: 'email',
        Value: user.email
      },
    ],
    ValidationData: [
      {
        Name: 'email_verified',
        Value: 'true'
      },
    ]
  };
  
  cognitoidentityserviceprovider.adminCreateUser(createUserParams, function(err, data) {
    if (err) throw err

    let addToGroupParams = {
      GroupName: user.role.userRoleDescription.toLowerCase(),
      Username: data.User.Username,
      UserPoolId: 'us-east-1_MQXokLX98'
    };

    cognitoidentityserviceprovider.adminAddUserToGroup(addToGroupParams, function(err, data) {
      if (err) throw err

      pool.getConnection(function(error, connection) {

        var userQuery = `INSERT INTO USERS (USER_COGNITO_ID, ROLE_ID, FIRST_NAME, LAST_NAME, EMAIL)
        VALUES (${addQuotes(addToGroupParams.Username)}, ${addQuotes(user.role.roleId)}, ${addQuotes(user.firstName)}, ${addQuotes(user.lastName)}, ${addQuotes(user.email)});`

        var taxQuery = `INSERT INTO TAX (USER_COGNITO_ID) VALUES (${addQuotes(addToGroupParams.Username)});`
    
        connection.query(userQuery, function(err, rows, fields) {
          if (err) throw err
          
          connection.query(taxQuery, function(err, rows, fields) {
            if (err) throw err
            
            res.json("User Created")
      
            connection.release()
          })
        })
      })
    });
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

    let propertyQuery = `UPDATE PROPERTY 
    SET 
      NOTES = ${addQuotes(newProperty.notes)}, 
      DATE_OF_PURCHASE = ${addQuotes(newProperty.dateOfPurchase)}, 
      TRUSTEE_NAME = ${addQuotes(newProperty.trusteeName)}, 
      DATE_OF_SALE = ${addQuotes(newProperty.dateOfSale)}, 
      SUBDIVISION = ${addQuotes(newProperty.subdivision)}, 
      COUNTY_ASSESSMENT = ${addQuotes(newProperty.countyAssessment)}, 
      STATUS_ID = ${addQuotes(newProperty.status.statusId)}, 
      OCCUPANCY_STATUS_ID = ${addQuotes(newProperty.occupancyStatus.occupancyStatusId)}, 
      COORDINATOR_COGNITO_ID = `;

    propertyQuery += (newProperty.coordinator != null) ? newProperty.coordinator.userCognitoId : null;

    propertyQuery += ` WHERE PROPERTY_ID = ${addQuotes(newProperty.propertyId)}`;

    let addressQuery = `UPDATE PROPERTY_ADDRESS 
    SET 
      ADDRESS = ${addQuotes(newProperty.address.address)}, 
      CITY = ${addQuotes(newProperty.address.city)}, 
      COUNTY = ${addQuotes(newProperty.address.county)}, 
      STATE = ${addQuotes(newProperty.address.state)}, 
      ZIPCODE = ${addQuotes(newProperty.address.zipcode)} 
    WHERE ADDRESS_ID = ${newProperty.address.addressId};`

    let essentialsQuery = `UPDATE PROPERTY_ESSENTIALS 
    SET 
      PROPERTY_TYPE = ${addQuotes(newProperty.essentials.propertyType)}, 
      NUM_BEDS = ${addQuotes(newProperty.essentials.numBeds)}, 
      LAND_FOOTAGE = ${addQuotes(newProperty.essentials.landFootage)}, 
      YEAR_BUILT = ${addQuotes(newProperty.essentials.yearBuilt)}, 
      NUM_BATHS = ${addQuotes(newProperty.essentials.numBaths)}, 
      PROPERTY_FOOTAGE = ${addQuotes(newProperty.essentials.propertyFootage)}, 
      ZILLOW_LINK = ${addQuotes(newProperty.essentials.zillowLink)} 
    WHERE ESSENTIALS_ID = ${addQuotes(newProperty.essentials.essentialsId)};`

    connection.query(propertyQuery, function(err, rows, fields) {
      if (err) throw err   
    })

    connection.query(addressQuery, function(err, rows, fields) {
      if (err) throw err   
    })

    connection.query(essentialsQuery, function(err, rows, fields) {
      if (err) throw err   
    })

    res.json("Property Updated")
    connection.release()
  })

});

app.put('/taxes', function(req, res) {

  let tax = req.body.tax;

  pool.getConnection(function(error, connection) {

    var taxQuery = `UPDATE TAX SET
     GOVERNMENT_TAX_ID = ${addQuotes(tax.governmentTaxId)}
     WHERE TAX_ID = ${addQuotes(tax.taxId)};`

    connection.query(taxQuery, function(err, rows, fields) {
      if (err) throw err

      if (tax.user){
        var userQuery = `UPDATE USERS SET
        SSN = ${addQuotes(tax.user.ssn)}
        WHERE USER_COGNITO_ID = ${addQuotes(tax.user.userCognitoId)};`

        connection.query(userQuery, function(err, rows, fields) {
          if (err) throw err
    
          res.json("Tax Information Updated")
    
          connection.release()
        })
      }else{
        res.json("Tax Information Updated")
        connection.release()
      }

    })

  })

});

app.put('/property-contractor', function(req, res) {

  pool.getConnection(function(error, connection) {

    var query = `INSERT INTO PROPERTY_CONTRACTOR VALUES (${addQuotes(req.body.contractor.contractorCognitoId)}, ${addQuotes(req.body.propertyId)})`

    connection.query(query, function(err, rows, fields) {
      if (err) throw err

      res.json("Contractor Added")

      connection.release()
    })

  })

});

app.put('/contractors', function(req, res) {
  let newContractor = req.body.contractor;

  pool.getConnection(function(error, connection) {

    let query = `UPDATE CONTRACTOR 
    SET 
      CONTRACTOR_TYPE_ID = ${addQuotes(newContractor.contractorType.contractorTypeId)}, 
      DATE_HIRED = ${addQuotes(newContractor.dateHired)}, 
      START_DATE = ${addQuotes(newContractor.startDate)}, 
      END_DATE = ${addQuotes(newContractor.endDate)}, 
      COMPANY = ${addQuotes(newContractor.company)} 
    WHERE CONTRACTOR_COGNITO_ID = ${addQuotes(newContractor.contractorCognitoId)};`

    connection.query(query, function(err, rows, fields) {
      if (err) throw err   
    })

    res.json("Contractor Updated")
    connection.release()
  })
});

app.put('/revenues', function(req, res) {
  let revenue = req.body.revenue;

  pool.getConnection(function(error, connection) {

    let query = `UPDATE REVENUE 
    SET 
      PROPERTY_ID = ${(revenue.property != null) ? addQuotes(revenue.property.propertyId) : null}, 
      CONTRACTOR_COGNITO_ID = ${(revenue.contractor != null) ? addQuotes(revenue.contractor.contractorCognitoId) : null}, 
      EXPENSE_STATUS_ID = ${addQuotes(revenue.expenseStatus.expenseStatusId)}, 
      REVENUE_AMOUNT = ${addQuotes(revenue.revenueAmount)}, 
      REVENUE_TYPE = ${addQuotes(revenue.revenueType)},
      EXPENSE_DUE_DATE = ${addQuotes(revenue.expenseDueDate)},
      AMOUNT_PAID = ${addQuotes(revenue.amountPaid)},
      REVENUE_DESCRIPTION = ${addQuotes(revenue.revenueDescription)},
      DATE_INCURRED = ${addQuotes(revenue.dateIncurred)}         
    WHERE REVENUE_ID = ${addQuotes(revenue.revenueId)};`

    connection.query(query, function(err, rows, fields) {
      if (err) throw err   
    })

    res.json("Revenue Updated")
    connection.release()
  })
});

app.put('/users', function(req, res) {
  let user = req.body.user;

  pool.getConnection(function(error, connection) {

    var query = `UPDATE USERS
      SET ROLE_ID = ${addQuotes(user.role.roleId)}, FIRST_NAME = ${addQuotes(user.firstName)}, LAST_NAME = ${addQuotes(user.lastName)}
      WHERE USER_COGNITO_ID = ${addQuotes(user.userCognitoId)};`

    connection.query(query, function(err, rows, fields) {
      if (err) throw err
      if(user.role.roleId == "0"){
        let addToGroupParams = {
          GroupName: user.role.userRoleDescription.toLowerCase(),
          Username: user.userCognitoId,
          UserPoolId: 'us-east-1_MQXokLX98'
        };
    
        cognitoidentityserviceprovider.adminAddUserToGroup(addToGroupParams, function(err, data) {
          if (err) throw err
        res.json("User Updated")
  
        connection.release()
      })
      }
      })
    })
  });

  app.put('/activate', function(req, res) {
    let user = req.body.user;

    let removeFromGroupParams = {
      GroupName: "inactive",
      Username: user.userCognitoId,
      UserPoolId: 'us-east-1_MQXokLX98'
    };

    cognitoidentityserviceprovider.adminRemoveUserFromGroup(removeFromGroupParams, function(err, data) {
      if (err) throw err
      let userParams = {
        Username: user.userCognitoId,
        UserPoolId: 'us-east-1_MQXokLX98'
      };

      cognitoidentityserviceprovider.adminListGroupsForUser(userParams, function(err, data) {
        if (err) throw err
        let minRole = 0;
        let minPrecedence = getPrecedence(data["Groups"][0]["GroupName"]);
  
        for(let i = 0; i < data["Groups"].length; i++){
          let curPrec = getPrecedence(data["Groups"][i]["GroupName"])
          if (curPrec < minPrecedence){
              minRole = i;
              minPrecedence = curPrec;
          }
        }
      pool.getConnection(function(error, connection) {
  
        var query = `UPDATE USERS
          SET ROLE_ID = ${addQuotes(getRoleId(data["Groups"][minRole]["GroupName"]))}
          WHERE USER_COGNITO_ID = ${addQuotes(user.userCognitoId)};`
    
        connection.query(query, function(err, rows, fields) {
          if (err) throw err
          res.json("User Activated")
  
          connection.release()
            
          })
        })
    })

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

    var propertyRevenuesQuery = "DELETE FROM REVENUE \
    WHERE PROPERTY_ID = " + req.body.propertyId;

    connection.query(propertyRevenuesQuery, function(err, rows, fields) {
      if (err) throw err

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
              
              res.json("Property Deleted");
              connection.release()
            })
          })
        })
    })
  })
});

app.delete('/contractors', function(req, res) {
  let contractor = req.body.contractor;
  pool.getConnection(function(error, connection) {

    var contractorQuery = `DELETE FROM CONTRACTOR 
    WHERE CONTRACTOR_COGNITO_ID = ${addQuotes(contractor.contractorCognitoId)}`

    var revenueQuery = `DELETE FROM CONTRACTOR 
    WHERE CONTRACTOR_COGNITO_ID = ${addQuotes(contractor.contractorCognitoId)}`

    var propertyQuery = `DELETE FROM PROPERTY_CONTRACTOR 
    WHERE CONTRACTOR_COGNITO_ID = ${addQuotes(contractor.contractorCognitoId)}`
    connection.query(revenueQuery, function(err, rows, fields) {
      if (err) throw err
     
      connection.query(propertyQuery, function(err, rows, fields) {
        if (err) throw err

        connection.query(contractorQuery, function(err, rows, fields) {
          if (err) throw err

          res.json("Contractor Deleted")
          connection.release()
          })
      })
    })

  })
});

app.delete('/revenues', function(req, res) {
  let revenue = req.body.revenue;
  pool.getConnection(function(error, connection) {

    var query = `DELETE FROM REVENUE 
    WHERE REVENUE_ID = ${addQuotes(revenue.revenueId)}`

    connection.query(query, function(err, rows, fields) {
      if (err) throw err

      res.json("Revenue Deleted")

      connection.release()
    })
  })
});

app.delete('/property-contractor', function(req, res) {

  pool.getConnection(function(error, connection) {

    var query = `DELETE FROM PROPERTY_CONTRACTOR 
    WHERE PROPERTY_ID = ${addQuotes(req.body.propertyId)}
    AND CONTRACTOR_COGNITO_ID = ${addQuotes(req.body.contractorCognitoId)};`

    connection.query(query, function(err, rows, fields) {
      if (err) throw err

      res.json("Contractor Disconnected")

      connection.release()
    })

  })
  
});

app.listen(3000, function() {
  console.log("App started")
});

function addQuotes(value) {
  return (typeof value == "string") && (value != null) ? `'${value.replace("'", "\\\'")}'` : value;
}

function getPrecedence(role){
  switch(role){
    case "admin": return 2
    case "bidding_contractor": return 2
    case "contractor": return 3
    case "employee": return 2
    case "inactive": return 1
    case "real_estate_contractor": return 2
    case "research_contractor": return 2
    case "remodeling_contractor": return 2
    case "taxes_contractor": return 2
  }
}

function getRoleId(role){
  switch(role){
    case "admin": return 1
    case "bidding_contractor": return 2
    case "contractor": return 2
    case "employee": return 3
    case "inactive": return 0
    case "real_estate_contractor": return 2
    case "research_contractor": return 2
    case "remodeling_contractor": return 2
    case "taxes_contractor": return 2
  }
}


module.exports = app