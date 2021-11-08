import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { API, Storage } from 'aws-amplify';
import * as $ from 'jquery';
import { Contractor } from '../models/contractor.class';
import { Property } from '../models/property.class';

import { Revenue } from '../models/revenue.class';

@Component({
  selector: 'app-revenue-details',
  templateUrl: './revenue-details.page.html',
  styleUrls: ['./revenue-details.page.scss'],
})
export class RevenueDetailsPage implements OnInit {

  apiName = 'KitsRealtyAPI2';

  revenue: Revenue;
  checks = new Array();
  checkNames = new Array();
  receipts = new Array();
  receiptNames = new Array();
  properties: Property[] = new Array();
  contractors: Contractor[] = new Array();

  constructor(
    public modalController: ModalController, 
    public navParams: NavParams) { 
    this.revenue = this.navParams.data.revenue;
    this.properties = this.navParams.data.properties;
    this.contractors = this.navParams.data.contractors;
  }
  

  ngOnInit() {
    this.getFiles('checks');
    this.getFiles('receipts');
    console.log(this.revenue);
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
  updateInput(field, event) {
    let value = event.target.value;
    switch (field) {
      case 'payment': this.revenue.amountPaid += value; break
      case 'property': this.revenue.property = value; break
      case 'contractor': this.revenue.contractor = value; break
      case 'expense_status': this.revenue.expenseStatus.expenseStatusId = value; break
      case 'amount':  this.revenue.revenueAmount = value; break
      case 'amount_paid': this.revenue.amountPaid = value; break
      case 'date_incurred': this.revenue.dateIncurred = value; break
      case 'due_date': this.revenue.expenseDueDate = value; break
      case 'description': this.revenue.revenueDescription = value; break
    }
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
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  }
  edit() {
    $("ion-input :not(.disabled)").removeAttr("readonly");
    $("ion-textarea").removeAttr("readonly");
    $("ion-select").removeAttr("disabled");
    $(".edit-button").addClass("d-none");
    $(".save-button").removeClass("d-none");
    $(".delete-button").removeClass("d-none");
  }
  
  submit(){
    $("ion-input").attr("readonly");
    $("ion-textarea").attr("readonly")
    $("ion-select").attr("disabled");
    $(".edit-button").removeClass("d-none");
    $(".save-button").addClass("d-none");
    $(".delete-button").addClass("d-none");
    console.log(this.revenue);
  }

  async getFiles(path: string) {
    this.resetFiles(path);
    await Storage.list("revenues/" + this.revenue.revenueId + "/" + path)
      .then(async response => {
        console.log(response);
        if (!response || response.length < 1 || (response.length < 2 && response[0].size == 0)) {
          return;
        }
        for (var i = 0; i < response.length; i++) {
          let filePath = response[i].key;
          let fileName = filePath.substring(filePath.lastIndexOf("/") + 1, filePath.length);
          console.log(filePath);
          await Storage.get(filePath)
            .then(response => {
              this.storeFile(path, response, fileName);
            })
            .catch(err => {
              console.log(err);
            });
          }
      })
      .catch(err => {
        console.log(err);
      });
  }

  resetFiles(path: string) {
    switch(path) {
      case 'checks':
        this.checks = new Array();
        this.checkNames = new Array();
        break;
      case 'receipts':
        this.receipts = new Array();
        this.receiptNames = new Array();
        break;
    }
  }

  storeFile(path, file, fileName) {
    if (path == 'checks' && fileName.length != 0) { 
      this.checks.push(file as any);
      this.checkNames.push(fileName); 
    }
    else if (path == 'receipts' && fileName.length != 0) { 
      this.receipts.push(file as any);
      this.receiptNames.push(fileName); 
    }
  }

  public fileToUpload: any;

  selectFileToUpload(e) {
    this.fileToUpload = e.target.files[0]
  }

  editFiles(filetype: string) {
    $(function() {
      switch (filetype) {
        case 'checks':
          $(".edit-btn-checks").addClass("d-none");
          $(".save-btn-checks").removeClass("d-none");
          $(".delete-btn-checks").removeClass("d-none");
          break;
        case 'receipts':
          $(".edit-btn-receipts").addClass("d-none");
          $(".save-btn-receipts").removeClass("d-none");
          $(".delete-btn-receipts").removeClass("d-none");
          break;
      }
    });
  }

  saveFiles(filetype: string) {
    $(function() {
      switch (filetype) {
        case 'checks':
          $(".edit-btn-checks").removeClass("d-none");
          $(".save-btn-checks").addClass("d-none");
          $(".delete-btn-checks").addClass("d-none");
          break;
        case 'receipts':
          $(".edit-btn-receipts").removeClass("d-none");
          $(".save-btn-receipts").addClass("d-none");
          $(".delete-btn-receipts").addClass("d-none");
          break;
      }
    });
  }

  async uploadFile(path: string) {
    try {
      await Storage.put('revenues/' + this.revenue.revenueId + '/' + path + '/' + this.fileToUpload.name + "-" + Date.now(), this.fileToUpload, {});
      this.getFiles(path);
    } catch (err) {
      console.log(err);
    }  
  }

  async deleteFile(path: string, fileToDelete: string) {
    if (window.confirm("Are you sure that you want to DELETE this image?")) {
      try {
        await Storage.remove('revenues/' + this.revenue.revenueId + '/' + path + '/' + fileToDelete, {});
        this.getFiles(path);
      } catch (err) {
        console.log(err);
      }  
    }
  }

  


}
