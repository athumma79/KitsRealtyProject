import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { API, Storage } from 'aws-amplify';

import { Contractor } from '../models/contractor.class';
import { ExpenseStatus } from '../models/expense-status.class';
import { Property } from '../models/property.class';
import { Revenue } from '../models/revenue.class';
import { UserRole } from '../models/user-role.class';
import { User } from '../models/user.class';
import { ContractorType } from '../models/contractor-type.class';
import { OccupancyStatus } from '../models/occupancy-status.class';
import { PropertyAddress } from '../models/property-address.class';
import { PropertyAuction } from '../models/property-auction.class';
import { PropertyEssentials } from '../models/property-essentials.class';
import { PropertyLoan } from '../models/property-loan.class';
import { PropertyPrices } from '../models/property-prices.class';
import { PropertyStatus } from '../models/property-status.class';
import { RevenueDetailsPage } from '../revenue-details/revenue-details.page';

@Component({
  selector: 'app-revenues',
  templateUrl: './revenues.page.html',
  styleUrls: ['./revenues.page.scss'],
})
export class RevenuesPage implements OnInit {

  apiName = 'KitsRealtyAPI2';

  revenues: Revenue[] = new Array();

  constructor(public modalController: ModalController) { }

  ngOnInit() {
    this.loadRevenues();
  }

  async loadRevenues() {
    API
      .post(this.apiName, '/revenues', {})
      .then(response => {
        var dbRevenues = response.revenues;
        for(var i = 0; i < dbRevenues.length; i++) {
          let expenseStatus = new ExpenseStatus();
          expenseStatus.expenseStatusId = dbRevenues[i]['EXPENSE_STATUS_ID'];
          expenseStatus.expenseStatusDescription = dbRevenues[i]['EXPENSE_STATUS_DESCRIPTION'];
          
          let userRole = new UserRole();
          userRole.roleId = dbRevenues[i]["ROLE_ID"];
          userRole.userRoleDescription = dbRevenues[i]["USER_ROLE_DESCRIPTION"];

          let user = new User();
          user.userCognitoId = dbRevenues[i]["USER_COGNITO_ID"];
          user.role = userRole;
          user.firstName = dbRevenues[i]["FIRST_NAME"];
          user.lastName = dbRevenues[i]["LAST_NAME"];
          user.email = dbRevenues[i]["EMAIL"];
          user.username = dbRevenues[i]["USERNAME"];
          user.ssn = dbRevenues[i]["SSN"];

          let contractorType = new ContractorType();
          contractorType.contractorTypeId = dbRevenues[i]["CONTRACTOR_TYPE_ID"];
          contractorType.contractorTypeDescription = dbRevenues[i]["CONTRACTOR_TYPE_DESCRIPTION"];

          let contractor = new Contractor();
          contractor.contractorCognitoId = dbRevenues[i]["CONTRACTOR_COGNITO_ID"];
          contractor.contractorUser = user;
          contractor.contractorType = contractorType;
          contractor.dateHired = dbRevenues[i]['DATE_HIRED'] ? new Date(dbRevenues[i]['DATE_HIRED'].substring(0, dbRevenues[i]['DATE_HIRED'].lastIndexOf('.'))) : null;
          contractor.startDate = dbRevenues[i]['START_DATE'] ? new Date(dbRevenues[i]['START_DATE'].substring(0, dbRevenues[i]['START_DATE'].lastIndexOf('.'))) : null;
          contractor.endDate = dbRevenues[i]['END_DATE'] ? new Date(dbRevenues[i]['END_DATE'].substring(0, dbRevenues[i]['END_DATE'].lastIndexOf('.'))) : null;
          contractor.company = dbRevenues[i]["COMPANY"];

          var propertyStatus = new PropertyStatus();
          propertyStatus.statusId = dbRevenues[i]["STATUS_ID"];
          propertyStatus.propertyStatusDescription = dbRevenues[i]["PROPERTY_STATUS_DESCRIPTION"];
          
          var occupancyStatus = new OccupancyStatus();
          occupancyStatus.occupancyStatusId = dbRevenues[i]["OCCUPANCY_STATUS_ID"];
          occupancyStatus.occupancyStatusDescription = dbRevenues[i]["OCCUPANCY_STATUS_DESCRIPTION"];

          var coordinatorUserRole = new UserRole();
          coordinatorUserRole.roleId = dbRevenues[i]["ROLE_ID"];
          coordinatorUserRole.userRoleDescription = dbRevenues[i]["USER_ROLE_DESCRIPTION"];

          var coordinator = new User();
          coordinator.userCognitoId = dbRevenues[i]["USER_COGNITO_ID"];
          coordinator.role = coordinatorUserRole;
          coordinator.firstName = dbRevenues[i]["FIRST_NAME"];
          coordinator.lastName = dbRevenues[i]["LAST_NAME"];
          coordinator.email = dbRevenues[i]["EMAIL"];
          coordinator.username = dbRevenues[i]["USERNAME"];
          coordinator.ssn = dbRevenues[i]["SSN"];
          
          var propertyAuction = new PropertyAuction();
          propertyAuction.auctionId = dbRevenues[i]["AUCTION_ID"];
          propertyAuction.auctionLocation = dbRevenues[i]["AUCTION_LOCATION"];
          propertyAuction.dateOfAuction = dbRevenues[i]['DATE_OF_AUCTION'] ? new Date(dbRevenues[i]['DATE_OF_AUCTION'].substring(0, dbRevenues[i]['DATE_OF_AUCTION'].lastIndexOf('.'))) : null;

          var propertyPrices = new PropertyPrices();
          propertyPrices.pricesId = dbRevenues[i]["PRICES_ID"];
          propertyPrices.buyValue = dbRevenues[i]["BUY_VALUE"];
          propertyPrices.expectedValue = dbRevenues[i]["EXPECTED_VALUE"];
          propertyPrices.sellValue = dbRevenues[i]["SELL_VALUE"];
          propertyPrices.biddingPrice = dbRevenues[i]["BIDDING_PRICE"];
          propertyPrices.marketPrice = dbRevenues[i]["MARKET_PRICE"];

          var propertyAddress = new PropertyAddress();
          propertyAddress.addressId = dbRevenues[i]["ADDRESS_ID"];
          propertyAddress.address = dbRevenues[i]["ADDRESS"];
          propertyAddress.city = dbRevenues[i]["CITY"];
          propertyAddress.county = dbRevenues[i]["COUNTY"];
          propertyAddress.zipcode = dbRevenues[i]["ZIPCODE"];
          propertyAddress.state = dbRevenues[i]["STATE"];

          var propertyEssentials = new PropertyEssentials();
          propertyEssentials.essentialsId = dbRevenues[i]["ESSENTIALS_ID"];
          propertyEssentials.propertyType = dbRevenues[i]["PROPERTY_TYPE"];
          propertyEssentials.numBeds = dbRevenues[i]["NUM_BEDS"];
          propertyEssentials.numBaths = dbRevenues[i]["NUM_BATHS"];
          propertyEssentials.landFootage = dbRevenues[i]["LAND_FOOTAGE"]; 
          propertyEssentials.propertyFootage = dbRevenues[i]["PROPERTY_FOOTAGE"];
          propertyEssentials.yearBuilt = dbRevenues[i]["YEAR_BUILT"];
          propertyEssentials.zillowLink = dbRevenues[i]["ZILLOW_LINK"];

          var propertyLoan = new PropertyLoan();
          propertyLoan.loanId = dbRevenues[i]["LOAN_ID"];
          propertyLoan.amount = dbRevenues[i]["AMOUNT"];
          propertyLoan.month = dbRevenues[i]["MONTH"];
          propertyLoan.year = dbRevenues[i]["YEAR"];

          var property = new Property();
          property.propertyId = dbRevenues[i]["PROPERTY_ID"];
          property.name = dbRevenues[i]["NAME"];
          property.status = propertyStatus;
          property.occupancyStatus = occupancyStatus;
          property.coordinator = coordinator;
          property.auction = propertyAuction;
          property.prices = propertyPrices;
          property.address = propertyAddress;
          property.essentials = propertyEssentials;
          property.loan = propertyLoan;
          property.dateOfPurchase = dbRevenues[i]['DATE_OF_PURCHASE'] ? new Date(dbRevenues[i]['DATE_OF_PURCHASE'].substring(0, dbRevenues[i]['DATE_OF_PURCHASE'].lastIndexOf('.'))) : null;
          property.dateOfSale = dbRevenues[i]['DATE_OF_SALE'] ? new Date(dbRevenues[i]['DATE_OF_SALE'].substring(0, dbRevenues[i]['DATE_OF_SALE'].lastIndexOf('.'))) : null;
          property.trusteeName = dbRevenues[i]["TRUSTEE_NAME"];
          property.subdivision = dbRevenues[i]["SUBDIVISION"];
          property.countyAssessment = dbRevenues[i]["COUNTY_ASSESSMENT"];
          property.notes = dbRevenues[i]["NOTES"];

          let revenue = new Revenue();
          revenue.revenueId = dbRevenues[i]['REVENUE_ID'];
          revenue.property = dbRevenues[i]['PROPERTY_ID'] ? property : null;
          revenue.contractor = dbRevenues[i]['CONTRACTOR_COGNITO_ID'] ? contractor : null;
          revenue.expenseStatus = expenseStatus;
          revenue.revenueAmount = dbRevenues[i]['REVENUE_AMOUNT'];
          revenue.revenueType = dbRevenues[i]['REVENUE_TYPE'];
          revenue.expenseDueDate = dbRevenues[i]['EXPENSE_DUE_DATE'] ? new Date(dbRevenues[i]['EXPENSE_DUE_DATE'].substring(0, dbRevenues[i]['EXPENSE_DUE_DATE'].lastIndexOf('.'))) : null;
          revenue.amountPaid = dbRevenues[i]['AMOUNT_PAID'];
          revenue.revenueDescription = dbRevenues[i]['REVENUE_DESCRIPTION'];
          revenue.dateIncurred = dbRevenues[i]['DATE_INCURRED'] ? new Date(dbRevenues[i]['DATE_INCURRED'].substring(0, dbRevenues[i]['DATE_INCURRED'].lastIndexOf('.'))) : null;

          this.revenues.push(revenue);
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  getFormattedRevenueAmount(revenue: Revenue) {
    let formattedRevenue = (revenue.revenueType.toLowerCase() == "profit") ? "+" : "-";
    formattedRevenue = " $" + revenue.revenueAmount.toFixed(2);
    return formattedRevenue;
  }

  getRevenueStatus(revenue: Revenue) {
    if (revenue.revenueType.toLowerCase() == "profit") {
      return "profit";
    }
    return (revenue.expenseStatus.expenseStatusDescription == "paid") ? "paid" : "due " + this.getFormattedDate(revenue.expenseDueDate);
  }

  getFormattedDate(date: Date) {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  }

  async openRevenueDetails(index: number) {
    const revenueDetailsModal = await this.modalController.create({
      component: RevenueDetailsPage,
      componentProps: {
        'revenue': this.revenues[index],
      }
    });
    return await revenueDetailsModal.present();
  }

}
