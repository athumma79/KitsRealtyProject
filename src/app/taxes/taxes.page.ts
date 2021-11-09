import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Tax } from '../models/tax.class';
import { TaxDetailsPage } from '../tax-details/tax-details.page';
import { API } from 'aws-amplify'
import { UserRole } from '../models/user-role.class';
import { User } from '../models/user.class';

@Component({
  selector: 'app-taxes',
  templateUrl: './taxes.page.html',
  styleUrls: ['./taxes.page.scss'],
})
export class TaxesPage implements OnInit {
  apiName = 'KitsRealtyAPI2';

  taxes: Tax[] = new Array();
  backupTaxes: Tax[] = new Array();

  constructor(public modalController: ModalController) { }

  ngOnInit() {
    this.loadTaxes();
  }

  async openTaxDetails(index: number) {
    const taxDetailsModal = await this.modalController.create({
      component: TaxDetailsPage,
      componentProps: {
        'tax': this.taxes[index]
      }
    });
    return await taxDetailsModal.present();
  }

  async loadTaxes() {
    API
      .get(this.apiName, '/taxes', {})
      .then(response => {
        let dbTaxes = response.taxes
        for(let i = 0; i < dbTaxes.length; i++){
          let userRole = new UserRole();
          userRole.roleId = dbTaxes[i]["ROLE_ID"];
          userRole.userRoleDescription = dbTaxes[i]["USER_ROLE_DESCRIPTION"];
  
          let user = new User();
          user.userCognitoId = dbTaxes[i]["USER_COGNITO_ID"];
          user.role = userRole;
          user.firstName = dbTaxes[i]["FIRST_NAME"];
          user.lastName = dbTaxes[i]["LAST_NAME"];
          user.email = dbTaxes[i]["EMAIL"];
          user.ssn = dbTaxes[i]["SSN"];

          let tax = new Tax();
          tax.user = user;
          tax.taxId = dbTaxes[i]["TAX_ID"];
          tax.governmentTaxId = dbTaxes[i]["GOVERNMENT_TAX_ID"];

  
          this.taxes.push(tax);
          this.backupTaxes.push(tax);
        }
        console.log(this.taxes);
        })
      .catch(error => {
        console.log(error);
      });
  }

}
