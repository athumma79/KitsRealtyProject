import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';

import { API, Storage } from 'aws-amplify';
import * as $ from 'jquery';

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
import { AddRevenueFormPage } from '../add-revenue-form/add-revenue-form.page';

@Component({
  selector: 'app-revenues',
  templateUrl: './revenues.page.html',
  styleUrls: ['./revenues.page.scss'],
})
export class RevenuesPage implements OnInit {

  apiName = 'KitsRealtyAPI2';

  revenues: Revenue[] = new Array();
  backupRevenues: Revenue[] = new Array();
  property = new Property();
  contractor = new Contractor();

  constructor(public modalController: ModalController, public loadingController: LoadingController) { }

  ngOnInit() {
    this.loadConnections(() => this.loadRevenues());
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
          
          // let userRole = new UserRole();
          // userRole.roleId = dbRevenues[i]["ROLE_ID"];
          // userRole.userRoleDescription = dbRevenues[i]["USER_ROLE_DESCRIPTION"];

          // let user = new User();
          // user.userCognitoId = dbRevenues[i]["USER_COGNITO_ID"];
          // user.role = userRole;
          // user.firstName = dbRevenues[i]["FIRST_NAME"];
          // user.lastName = dbRevenues[i]["LAST_NAME"];
          // user.email = dbRevenues[i]["EMAIL"];
          // user.ssn = dbRevenues[i]["SSN"];

          // let contractorType = new ContractorType();
          // contractorType.contractorTypeId = dbRevenues[i]["CONTRACTOR_TYPE_ID"];
          // contractorType.contractorTypeDescription = dbRevenues[i]["CONTRACTOR_TYPE_DESCRIPTION"];

          //let contractor = new Contractor();
          this.contractor.contractorCognitoId = dbRevenues[i]["CONTRACTOR_COGNITO_ID"];
          // contractor.contractorUser = user;
          // contractor.contractorType = contractorType;
          // contractor.dateHired = dbRevenues[i]['DATE_HIRED'] ? new Date(dbRevenues[i]['DATE_HIRED'].substring(0, dbRevenues[i]['DATE_HIRED'].lastIndexOf('.'))) : null;
          // contractor.startDate = dbRevenues[i]['START_DATE'] ? new Date(dbRevenues[i]['START_DATE'].substring(0, dbRevenues[i]['START_DATE'].lastIndexOf('.'))) : null;
          // contractor.endDate = dbRevenues[i]['END_DATE'] ? new Date(dbRevenues[i]['END_DATE'].substring(0, dbRevenues[i]['END_DATE'].lastIndexOf('.'))) : null;
          // contractor.company = dbRevenues[i]["COMPANY"];

          // var propertyStatus = new PropertyStatus();
          // propertyStatus.statusId = dbRevenues[i]["STATUS_ID"];
          // propertyStatus.propertyStatusDescription = dbRevenues[i]["PROPERTY_STATUS_DESCRIPTION"];
          
          // var occupancyStatus = new OccupancyStatus();
          // occupancyStatus.occupancyStatusId = dbRevenues[i]["OCCUPANCY_STATUS_ID"];
          // occupancyStatus.occupancyStatusDescription = dbRevenues[i]["OCCUPANCY_STATUS_DESCRIPTION"];

          // var coordinatorUserRole = new UserRole();
          // coordinatorUserRole.roleId = dbRevenues[i]["ROLE_ID"];
          // coordinatorUserRole.userRoleDescription = dbRevenues[i]["USER_ROLE_DESCRIPTION"];

          // var coordinator = new User();
          // coordinator.userCognitoId = dbRevenues[i]["USER_COGNITO_ID"];
          // coordinator.role = coordinatorUserRole;
          // coordinator.firstName = dbRevenues[i]["FIRST_NAME"];
          // coordinator.lastName = dbRevenues[i]["LAST_NAME"];
          // coordinator.email = dbRevenues[i]["EMAIL"];
          // coordinator.ssn = dbRevenues[i]["SSN"];
          
          // var propertyAuction = new PropertyAuction();
          // propertyAuction.auctionId = dbRevenues[i]["AUCTION_ID"];
          // propertyAuction.auctionLocation = dbRevenues[i]["AUCTION_LOCATION"];
          // propertyAuction.dateOfAuction = dbRevenues[i]['DATE_OF_AUCTION'] ? new Date(dbRevenues[i]['DATE_OF_AUCTION'].substring(0, dbRevenues[i]['DATE_OF_AUCTION'].lastIndexOf('.'))) : null;

          // var propertyPrices = new PropertyPrices();
          // propertyPrices.pricesId = dbRevenues[i]["PRICES_ID"];
          // propertyPrices.buyValue = dbRevenues[i]["BUY_VALUE"];
          // propertyPrices.expectedValue = dbRevenues[i]["EXPECTED_VALUE"];
          // propertyPrices.sellValue = dbRevenues[i]["SELL_VALUE"];
          // propertyPrices.biddingPrice = dbRevenues[i]["BIDDING_PRICE"];
          // propertyPrices.marketPrice = dbRevenues[i]["MARKET_PRICE"];

          // var propertyAddress = new PropertyAddress();
          // propertyAddress.addressId = dbRevenues[i]["ADDRESS_ID"];
          // propertyAddress.address = dbRevenues[i]["ADDRESS"];
          // propertyAddress.city = dbRevenues[i]["CITY"];
          // propertyAddress.county = dbRevenues[i]["COUNTY"];
          // propertyAddress.zipcode = dbRevenues[i]["ZIPCODE"];
          // propertyAddress.state = dbRevenues[i]["STATE"];

          // var propertyEssentials = new PropertyEssentials();
          // propertyEssentials.essentialsId = dbRevenues[i]["ESSENTIALS_ID"];
          // propertyEssentials.propertyType = dbRevenues[i]["PROPERTY_TYPE"];
          // propertyEssentials.numBeds = dbRevenues[i]["NUM_BEDS"];
          // propertyEssentials.numBaths = dbRevenues[i]["NUM_BATHS"];
          // propertyEssentials.landFootage = dbRevenues[i]["LAND_FOOTAGE"]; 
          // propertyEssentials.propertyFootage = dbRevenues[i]["PROPERTY_FOOTAGE"];
          // propertyEssentials.yearBuilt = dbRevenues[i]["YEAR_BUILT"];
          // propertyEssentials.zillowLink = dbRevenues[i]["ZILLOW_LINK"];

          // var propertyLoan = new PropertyLoan();
          // propertyLoan.loanId = dbRevenues[i]["LOAN_ID"];
          // propertyLoan.amount = dbRevenues[i]["AMOUNT"];
          // propertyLoan.month = dbRevenues[i]["MONTH"];
          // propertyLoan.year = dbRevenues[i]["YEAR"];

          this.property.propertyId = dbRevenues[i]["PROPERTY_ID"];
          // property.status = propertyStatus;
          // property.occupancyStatus = occupancyStatus;
          // property.coordinator = coordinator;
          // property.auction = propertyAuction;
          // property.prices = propertyPrices;
          // property.address = propertyAddress;
          // property.essentials = propertyEssentials;
          // property.loan = propertyLoan;
          // property.dateOfPurchase = dbRevenues[i]['DATE_OF_PURCHASE'] ? new Date(dbRevenues[i]['DATE_OF_PURCHASE'].substring(0, dbRevenues[i]['DATE_OF_PURCHASE'].lastIndexOf('.'))) : null;
          // property.dateOfSale = dbRevenues[i]['DATE_OF_SALE'] ? new Date(dbRevenues[i]['DATE_OF_SALE'].substring(0, dbRevenues[i]['DATE_OF_SALE'].lastIndexOf('.'))) : null;
          // property.trusteeName = dbRevenues[i]["TRUSTEE_NAME"];
          // property.subdivision = dbRevenues[i]["SUBDIVISION"];
          // property.countyAssessment = dbRevenues[i]["COUNTY_ASSESSMENT"];
          // property.notes = dbRevenues[i]["NOTES"];

          let revenue = new Revenue();
          revenue.revenueId = dbRevenues[i]['REVENUE_ID'];
          revenue.property = this.setProperty();
          revenue.contractor = this.setContractor();
          revenue.expenseStatus = expenseStatus;
          revenue.revenueAmount = dbRevenues[i]['REVENUE_AMOUNT'];
          revenue.revenueType = dbRevenues[i]['REVENUE_TYPE'];
          revenue.expenseDueDate = dbRevenues[i]['EXPENSE_DUE_DATE'] ? new Date(dbRevenues[i]['EXPENSE_DUE_DATE'].substring(0, dbRevenues[i]['EXPENSE_DUE_DATE'].lastIndexOf('.'))) : null;
          revenue.amountPaid = dbRevenues[i]['AMOUNT_PAID'];
          revenue.revenueDescription = dbRevenues[i]['REVENUE_DESCRIPTION'];
          revenue.dateIncurred = dbRevenues[i]['DATE_INCURRED'] ? new Date(dbRevenues[i]['DATE_INCURRED'].substring(0, dbRevenues[i]['DATE_INCURRED'].lastIndexOf('.'))) : null;

          this.revenues.push(revenue);
          this.backupRevenues.push(revenue);
        }
        console.log(this.revenues)
      })
      .catch(err => {
        console.log(err);
      })
  }
  setContractor(){
    for(var i = 0; i < this.contractors.length; i++) {
      if (this.contractor.contractorCognitoId && this.contractor.contractorCognitoId == this.contractors[i].contractorCognitoId) {
        return this.contractors[i]
      }
    }
  }
  setProperty() {
    for(var i = 0; i < this.properties.length; i++) {
      if (this.property.propertyId && this.property.propertyId == this.properties[i].propertyId) {
        return this.properties[i]
      }
    }
  }
  properties: Property[] = new Array();
  contractors: Contractor[] = new Array();

  async loadConnections(callback) {
    API
      .get(this.apiName, '/contractors', {})
      .then(response => {
        let dbContractors = response.contractors;
        for(var i = 0; i < dbContractors.length; i++) {
          let userRole = new UserRole();
          userRole.roleId = dbContractors[i]["ROLE_ID"];
          userRole.userRoleDescription = dbContractors[i]["USER_ROLE_DESCRIPTION"];

          let user = new User();
          user.userCognitoId = dbContractors[i]["USER_COGNITO_ID"];
          user.role = userRole;
          user.firstName = dbContractors[i]["FIRST_NAME"];
          user.lastName = dbContractors[i]["LAST_NAME"];
          user.email = dbContractors[i]["EMAIL"];
          user.ssn = dbContractors[i]["SSN"];

          let contractorType = new ContractorType();
          contractorType.contractorTypeId = dbContractors[i]["CONTRACTOR_TYPE_ID"];
          contractorType.contractorTypeDescription = dbContractors[i]["CONTRACTOR_TYPE_DESCRIPTION"];

          let contractor = new Contractor();
          contractor.contractorCognitoId = dbContractors[i]["CONTRACTOR_COGNITO_ID"];
          contractor.contractorUser = user;
          contractor.contractorType = contractorType;
          contractor.dateHired = dbContractors[i]["DATE_HIRED"];
          contractor.startDate = dbContractors[i]["START_DATE"];
          contractor.endDate = dbContractors[i]["END_DATE"];
          contractor.company = dbContractors[i]["COMPANY"];
          
          this.contractors.push(contractor);
        }
        console.log(this.contractors);
      })
      .catch(error => {
        console.log(error);
      });
    API
      .get(this.apiName, '/properties', {})
      .then(response => {
        var dbProperties = response.properties;
        for(var i = 0; i < dbProperties.length; i++) {
          var propertyStatus = new PropertyStatus();
          propertyStatus.statusId = dbProperties[i]["STATUS_ID"];
          propertyStatus.propertyStatusDescription = dbProperties[i]["PROPERTY_STATUS_DESCRIPTION"];
          
          var occupancyStatus = new OccupancyStatus();
          occupancyStatus.occupancyStatusId = dbProperties[i]["OCCUPANCY_STATUS_ID"];
          occupancyStatus.occupancyStatusDescription = dbProperties[i]["OCCUPANCY_STATUS_DESCRIPTION"];

          var coordinatorUserRole = new UserRole();
          coordinatorUserRole.roleId = dbProperties[i]["ROLE_ID"];
          coordinatorUserRole.userRoleDescription = dbProperties[i]["USER_ROLE_DESCRIPTION"];

          var coordinator = new User();
          coordinator.userCognitoId = dbProperties[i]["USER_COGNITO_ID"];
          coordinator.role = coordinatorUserRole;
          coordinator.firstName = dbProperties[i]["FIRST_NAME"];
          coordinator.lastName = dbProperties[i]["LAST_NAME"];
          coordinator.email = dbProperties[i]["EMAIL"];
          coordinator.ssn = dbProperties[i]["SSN"];
          
          var propertyAuction = new PropertyAuction();
          propertyAuction.auctionId = dbProperties[i]["AUCTION_ID"];
          propertyAuction.auctionLocation = dbProperties[i]["AUCTION_LOCATION"];
          propertyAuction.dateOfAuction = dbProperties[i]['DATE_OF_AUCTION'] ? new Date(dbProperties[i]['DATE_OF_AUCTION'].substring(0, dbProperties[i]['DATE_OF_AUCTION'].lastIndexOf('.'))) : null;

          var propertyPrices = new PropertyPrices();
          propertyPrices.pricesId = dbProperties[i]["PRICES_ID"];
          propertyPrices.buyValue = dbProperties[i]["BUY_VALUE"];
          propertyPrices.expectedValue = dbProperties[i]["EXPECTED_VALUE"];
          propertyPrices.sellValue = dbProperties[i]["SELL_VALUE"];
          propertyPrices.biddingPrice = dbProperties[i]["BIDDING_PRICE"];
          propertyPrices.marketPrice = dbProperties[i]["MARKET_PRICE"];

          var propertyAddress = new PropertyAddress();
          propertyAddress.addressId = dbProperties[i]["ADDRESS_ID"];
          propertyAddress.address = dbProperties[i]["ADDRESS"];
          propertyAddress.city = dbProperties[i]["CITY"];
          propertyAddress.county = dbProperties[i]["COUNTY"];
          propertyAddress.zipcode = dbProperties[i]["ZIPCODE"];
          propertyAddress.state = dbProperties[i]["STATE"];

          var propertyEssentials = new PropertyEssentials();
          propertyEssentials.essentialsId = dbProperties[i]["ESSENTIALS_ID"];
          propertyEssentials.propertyType = dbProperties[i]["PROPERTY_TYPE"];
          propertyEssentials.numBeds = dbProperties[i]["NUM_BEDS"];
          propertyEssentials.numBaths = dbProperties[i]["NUM_BATHS"];
          propertyEssentials.landFootage = dbProperties[i]["LAND_FOOTAGE"]; 
          propertyEssentials.propertyFootage = dbProperties[i]["PROPERTY_FOOTAGE"];
          propertyEssentials.yearBuilt = dbProperties[i]["YEAR_BUILT"];
          propertyEssentials.zillowLink = dbProperties[i]["ZILLOW_LINK"];

          var propertyLoan = new PropertyLoan();
          propertyLoan.loanId = dbProperties[i]["LOAN_ID"];
          propertyLoan.amount = dbProperties[i]["AMOUNT"];
          propertyLoan.month = dbProperties[i]["MONTH"];
          propertyLoan.year = dbProperties[i]["YEAR"];

          var property = new Property();
          property.propertyId = dbProperties[i]["PROPERTY_ID"];
          property.status = propertyStatus;
          property.occupancyStatus = occupancyStatus;
          property.coordinator = coordinator;
          property.auction = propertyAuction;
          property.prices = propertyPrices;
          property.address = propertyAddress;
          property.essentials = propertyEssentials;
          property.loan = propertyLoan;
          property.dateOfPurchase = dbProperties[i]['DATE_OF_PURCHASE'] ? new Date(dbProperties[i]['DATE_OF_PURCHASE'].substring(0, dbProperties[i]['DATE_OF_PURCHASE'].lastIndexOf('.'))) : null;
          property.dateOfSale = dbProperties[i]['DATE_OF_SALE'] ? new Date(dbProperties[i]['DATE_OF_SALE'].substring(0, dbProperties[i]['DATE_OF_SALE'].lastIndexOf('.'))) : null;
          property.trusteeName = dbProperties[i]["TRUSTEE_NAME"];
          property.subdivision = dbProperties[i]["SUBDIVISION"];
          property.countyAssessment = dbProperties[i]["COUNTY_ASSESSMENT"];
          property.notes = dbProperties[i]["NOTES"];

          this.properties.push(property);
        }
        this.dismissLoader();
        $(document).ready(function() {
          callback();
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  dismissLoader() {
    this.loadingController.dismiss().then((response) => {
        console.log('Loader closed!', response);
    }).catch((err) => {
        console.log('Error occured : ', err);
    });
}
  getSymbol(role){
    console.log(role);
    switch(role){
      case "Property": return "home-sharp"
      case "Contractor": return "hammer-sharp"
      case "General": return "folder-sharp"
    }
  }

  sortProperties(e){
    switch(e.detail.value){
      case "type": this.revenues.sort((a, b) => a.revenueType.localeCompare(b.revenueType));break
      case "description": this.revenues.sort((a, b) => a.revenueDescription.localeCompare(b.revenueDescription));break
      case "amount": this.revenues.sort((a, b) => a.revenueAmount-b.revenueAmount);break
      case "amountPaid": this.revenues.sort((a, b) => a.amountPaid-b.amountPaid);break
    }
  }
  async filterList(evt) {
    this.revenues = this.backupRevenues;
    const searchTerm = evt.srcElement.value;
    if (!searchTerm) {
      return;
    }
    this.revenues = this.revenues.filter(revenue => {
      return ((revenue.revenueDescription) ? (revenue.revenueDescription.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) : false);
    });
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

  getRevenueType(revenue: Revenue) {
    if (revenue.property && revenue.property.propertyId) {
      return "Property";
    }
    if (revenue.contractor && revenue.contractor.contractorCognitoId) {
      return "Contractor";
    }
    return "General";
  }

  getRevenueValue(revenue: Revenue) {
    if (revenue.property && revenue.property.propertyId) {
      return revenue.property.address.address;
    }
    if (revenue.contractor && revenue.contractor.contractorCognitoId) {
      return revenue.contractor.contractorUser.firstName + " " + revenue.contractor.contractorUser.lastName + " - " + revenue.contractor.contractorType.contractorTypeDescription;
    }
    return "General";
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

async openAddRevenueForm() {
  const addRevenueFormPage = await this.modalController.create({
    component: AddRevenueFormPage,
    componentProps: {
      'properties': this.properties,
      'contractors': this.contractors
    }
  });
  return await addRevenueFormPage.present();
}

}
