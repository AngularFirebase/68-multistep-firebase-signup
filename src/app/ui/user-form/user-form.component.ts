import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  signupForm: FormGroup;
  detailForm: FormGroup;

  userState;

  constructor(public fb: FormBuilder, public auth: AuthService) { }

  

  ngOnInit() {

    this.userState = this.auth.user.map(user => {
      if (user) {
        return user.catchPhrase ? 'complete' : 'incomplete';
      }
    })

    // First Step
    this.signupForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
        ]
      ],
      'password': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25)
        ]
      ],
      'region': ['', [
        ]
      ],
    });

    // Second Step
    this.detailForm = this.fb.group({
      'catchPhrase': ['', [ Validators.required ] ]
    });
    
  }

  // Using getters will make your code look pretty
  get email() { return this.signupForm.get('email') }
  get password() { return this.signupForm.get('password') }

  get catchPhrase() { return this.detailForm.get('catchPhrase') }


  // Step 1
  signup() {
    return this.auth.emailSignUp(this.email.value, this.password.value)
  }

  // Step 2
  setCatchPhrase(user) {
    return this.auth.updateUser(user, { catchPhrase:  this.catchPhrase.value })
  }












}
