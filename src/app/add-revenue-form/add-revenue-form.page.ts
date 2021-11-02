import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
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


  constructor(
    public modalController: ModalController, 
    public navParams: NavParams) { 
    this.properties = this.navParams.data.properties;
    this.contractors = this.navParams.data.contractors;
  }

  ngOnInit() {
    console.log(this.properties)
    console.log(this.contractors)
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

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
