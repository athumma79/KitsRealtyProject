import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { API, Storage } from 'aws-amplify';
import { Tax } from '../models/tax.class';
import * as $ from 'jquery';

@Component({
  selector: 'app-tax-details',
  templateUrl: './tax-details.page.html',
  styleUrls: ['./tax-details.page.scss'],
})
export class TaxDetailsPage implements OnInit {
  apiName = 'KitsRealtyAPI2';

  tax: Tax;
  documents = new Array();
  documentNames = new Array();

  constructor(public modalController: ModalController, public navParams: NavParams) { 
      this.tax = navParams.data.tax;
    }

  ngOnInit() {
  }

  edit() {
    $("ion-input").removeAttr("readonly");
    $(".edit-button").addClass("d-none");
    $(".save-button").removeClass("d-none");
  }

  save() {
    $("ion-input").attr("readonly", "readonly");
    $(".edit-button").removeClass("d-none");
    $(".save-button").addClass("d-none");
    API
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  taxShow(){
    $(".taxShow").addClass("d-none");
    $(".taxHide").removeClass("d-none");
    $(".tax").removeAttr("type");
  }

  taxHide(){
    $(".taxShow").removeClass("d-none");
    $(".taxHide").addClass("d-none");
    $(".tax").attr("type", "password")
  }

  ssnHide(){
    $(".ssnShow").removeClass("d-none");
    $(".ssnHide").addClass("d-none");
    $(".ssn").attr("type", "password")
  }


  ssnShow(){
    $(".ssnShow").addClass("d-none");
    $(".ssnHide").removeClass("d-none");
    $(".ssn").removeAttr("type");
  }

  async getFiles() {
    this.resetFiles();
    await Storage.list("taxes/" + this.tax.taxId + "/tax_docs")
      .then(async response => {
        console.log(response);
        if (!response || response.length < 1 || (response.length < 2 && response[0].size == 0)) {
          return;
        }
        for (var i = 0; i < response.length; i++) {
          let filePath = response[i].key;
          let fileName = filePath.substring(filePath.lastIndexOf("/") + 1, filePath.length);
          await Storage.get(filePath)
            .then(response => {
              this.storeFile(response, fileName);
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

  resetFiles() {
        this.documents = new Array();
        this.documentNames = new Array();

    }


  storeFile(file, fileName) {
    if (fileName.length != 0) { 
      this.documents.push(file as any);
      this.documentNames.push(fileName); 
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

  async uploadFile() {
    try {
      await Storage.put('taxes/' + this.tax.taxId + '/tax_docs/' + this.fileToUpload.name + "-" + Date.now(), this.fileToUpload, {});
      this.getFiles();
    } catch (err) {
      console.log(err);
    }  
  }

  async deleteFile(fileToDelete: string) {
    if (window.confirm("Are you sure that you want to DELETE this image?")) {
      try {
        await Storage.remove('taxes/' + this.tax.taxId + '/tax_docs/' + fileToDelete, {});
        this.getFiles();
      } catch (err) {
        console.log(err);
      }  
    }
  }
  
}
