import { Component } from '@angular/core';

//authentication
import { ChangeDetectorRef } from '@angular/core';
import { onAuthUIStateChange, CognitoUserInterface, AuthState } from '@aws-amplify/ui-components';

//customize authenticator fields
import { FormFieldTypes } from '@aws-amplify/ui-components';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  //authentication
  title = 'ionic-angular-auth';
  user: CognitoUserInterface | undefined;
  authState: AuthState;

  //customize authenticator fields
  signUpFormFields: FormFieldTypes;
  signInFormFields: FormFieldTypes;
  resetPasswordFormFields: FormFieldTypes;

  constructor(private ref: ChangeDetectorRef /*authentication*/) {

    //customize authenticator fields

    this.signInFormFields = [
      {
        type: "username",
        label: "Email",
        placeholder: "",
        inputProps: { required: true },
      },
      {
        type: "password",
        label: "Password",
        placeholder: "",
        inputProps: { required: true },
      },
    ];
    this.resetPasswordFormFields = [
      {
        type: "username",
        label: "Username / Email",
        placeholder: "",
        inputProps: { required: true },
      },
    ];

  }

  //authentication

  ngOnInit() {
    onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      this.user = authData as CognitoUserInterface;
      if (!this.ref['destroyed']) {
        this.ref.detectChanges();
      }
    })
  }
  login(){
    let minRole = 0;
    let minPrecedence = this.getPrecedence(this.user.signInUserSession.idToken.payload["cognito:groups"][0]);

    for(let i = 0; i < this.user.signInUserSession.idToken.payload["cognito:groups"].length; i++){
      let curPrec = this.getPrecedence(this.user.signInUserSession.idToken.payload["cognito:groups"][i])
      if (curPrec < minPrecedence){
          minRole = i;
          minPrecedence = curPrec;
      }
    }
    localStorage.setItem('role', this.user.signInUserSession.idToken.payload["cognito:groups"][minRole]);
    
    console.log(localStorage.getItem('role'));
  }



  getPrecedence(role){
    switch(role){
      case "admin": return 2
      case "bidding_contractor": return 2
      case "contractor": return 3
      case "employee": return 2
      case "inactive": return 1
      case "real_estate_contractor": return 2
      case "research_contractor": return 2
      case "remodeling_contractor": return 2
      case "taxes_contractor": return 2
    }
  }

  ngOnDestroy() {
    return onAuthUIStateChange;
  }
}
