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
    this.getFiles();
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
    const putInit = {
      body: {
        tax: this.tax
      }
    };
    API
    .put(this.apiName, '/taxes', putInit)
    .then(response => {
      window.alert(response)
      this.dismiss();
    })
    .catch(err => {
      console.log(err);
    });
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

  editFiles() {
      $(function() {
        $(".edit-btn").addClass("d-none");
        $(".save-btn").removeClass("d-none");
        $(".delete-btn").removeClass("d-none");
    });
  }

  saveFiles() {
    $(function() {
          $(".edit-btn").removeClass("d-none");
          $(".save-btn").addClass("d-none");
          $(".delete-btn").addClass("d-none");
    });
  }

  async uploadFile() {
    try {
      await Storage.put('taxes/' + this.tax.taxId + '/tax_docs/' + Date.now() + "-" + this.fileToUpload.name, this.fileToUpload, {});
      this.getFiles();
    } catch (err) {
      console.log(err);
    }  
  }

  async deleteFile(fileToDelete: string) {
    if (window.confirm("Are you sure that you want to DELETE this image?")) {
      try {
        await Storage.remove('taxes/' + this.tax.taxId + '/tax_docs/' + fileToDelete, {});
        this.getFiles().then(() => {
          this.editFiles();
        });        
      } catch (err) {
        console.log(err);
      }  
    }
  }
  
}
