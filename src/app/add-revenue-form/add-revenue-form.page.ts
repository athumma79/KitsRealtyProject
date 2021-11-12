import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { API } from 'aws-amplify';
import { Contractor } from '../models/contractor.class';
import { Property } from '../models/property.class';
import { Revenue } from '../models/revenue.class';

@Component({
  selector: 'app-add-revenue-form',
  templateUrl: './add-revenue-form.page.html',
  styleUrls: ['./add-revenue-form.page.scss'],
})
export class AddRevenueFormPage implements OnInit {

  properties:Property[] = new Array();
  contractors:Contractor[] = new Array();
  revenueTypeChoice: string;
  revenue: Revenue = new Revenue();

  apiName = 'KitsRealtyAPI2';

  constructor(
    public modalController: ModalController, 
    public navParams: NavParams) { 
    this.properties = this.navParams.data.properties;
    this.contractors = this.navParams.data.contractors;
  }

  ngOnInit() {
  }
  updateInput(field, event) {
    let value = event.target.value;
    switch (field) {
      case 'revenueTypeChoice': this.revenueTypeChoice = value; break;
      case 'property': this.revenue.property= value; break;
      case 'contractor': this.revenue.contractor = value; break;
      case 'revenue_type': this.revenue.revenueType = value; break;
      case 'expense_status': this.revenue.expenseStatus.expenseStatusId = value; break;
      case 'amount':  this.revenue.revenueAmount = value; break;
      case 'amount_paid': this.revenue.amountPaid = value; break;
      case 'date_incurred': this.revenue.dateIncurred = value; break;
      case 'due_date': this.revenue.expenseDueDate = value; break;
      case 'description': this.revenue.revenueDescription = value; break;
    }
  }

  async submit() {
    const postInit = {
      body: {
        revenue: this.revenue
      }
    };
    API
      .post(this.apiName, '/revenues', postInit)
      .then(response => {
        window.alert(response)
        this.dismiss();
      })
      .catch(err => {
        console.log(err);
      })
  }
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
