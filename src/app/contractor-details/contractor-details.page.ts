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

  constructor(public modalController: ModalController, 
    public navParams: NavParams) { 
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
      let newDate = new Date(year, month, day);
      
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
  }

  async saveContractor() {
    if (window.confirm("Save contractor information?")) {
      $("ion-input").attr("readonly", "readonly");
      $("ion-select").attr("disabled", "disabled");
      const putInit = {
        body: {
          contractor: this.contractor
        }
      };
      API
        .put(this.apiName, '/contractors', putInit)
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

}
