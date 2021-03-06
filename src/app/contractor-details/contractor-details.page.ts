import { Component, OnInit } from '@angular/core';
import { Contractor } from '../models/contractor.class';
import { ModalController, NavParams } from '@ionic/angular';
import { API, Storage } from 'aws-amplify';
import * as $ from 'jquery';

@Component({
  selector: 'app-contractor-details',
  templateUrl: './contractor-details.page.html',
  styleUrls: ['./contractor-details.page.scss'],
})
export class ContractorDetailsPage implements OnInit {

  apiName = 'KitsRealtyAPI2';

  contractor: Contractor;

  constructor(
    public modalController: ModalController, 
    public navParams: NavParams
    ) { 
      this.contractor = navParams.data.contractor;
  }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  updateDate(date: string, type: string) {
    var date_regex = /^(0?[1-9]|1[0-2])\/(0?[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;

    if (date_regex.test(date)) {
      let month = Number(date.substring(0, 2));
      let day = Number(date.substring(3, 5));
      let year = Number(date.substring(6, 10));
      let newDate = new Date(year, month-1, day);
      
      switch (type) {
        case 'date_hired': 
          this.contractor.dateHired = newDate;
          break;
        case 'start_date':
          this.contractor.startDate = newDate;
          break;
        case 'end_date':
          this.contractor.endDate = newDate;
          break;
      }
    }

  }

  updateType(e){
    let value = e.target.value;
    this.contractor.contractorType.contractorTypeId = value;
    switch(value){
      case "1": this.contractor.contractorType.contractorTypeDescription = "Research"; break
      case "2": this.contractor.contractorType.contractorTypeDescription = "Bidding"; break
      case "3": this.contractor.contractorType.contractorTypeDescription = "Remodel"; break
      case "4": this.contractor.contractorType.contractorTypeDescription = "Real Estate"; break
      case "5": this.contractor.contractorType.contractorTypeDescription = "Tax"; break
    }
  }
  
  getFormattedDate(dateString: string) {
    let date = new Date(dateString);
    if (date) { 
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });
    }
  }

  editContractor() {
    $("ion-input").removeAttr("readonly");
    $("ion-select").removeAttr("disabled");
    $(".edit-btn").addClass("d-none");
    $(".save-btn").removeClass("d-none");
    $(".delete-btn").removeClass("d-none");
  }

  async delete() {
    if (window.confirm("Delete this contractor? This will also delete any connected revenues and assignments.")) {
      const delInit = {
        body: {
          contractor: this.contractor
        }
      };
      API
        .del(this.apiName, '/contractors', delInit)
        .then(response => {
          console.log(response);
          this.dismiss();
        })
        .catch(error => {
          console.log(error);
        });
    }
  }


  async saveContractor() {
    if (window.confirm("Save contractor information?")) {
      $("ion-input").attr("readonly", "readonly");
      $("ion-select").attr("disabled", "disabled");
      $(".edit-btn").removeClass("d-none");
      $(".save-btn").addClass("d-none");
      $(".delete-btn").addClass("d-none");
      const putInit = {
        body: {
          contractor: this.contractor
        }
      };
      API
        .put(this.apiName, '/contractors', putInit)
        .then(response => {
          console.log(response);
          location.reload();
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

}
