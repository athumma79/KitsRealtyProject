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

  ngOnDestroy() {
    return onAuthUIStateChange;
  }
}
