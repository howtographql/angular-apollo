import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {
  CREATE_USER_MUTATION,
  CreateUserMutationResponse,
  SIGNIN_USER_MUTATION,
  SigninUserMutationResponse
} from '../graphql';
import {Apollo} from 'apollo-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  login: boolean = true; // switch between Login and SignUp
  email: string = '';
  password: string = '';
  name: string = '';

  constructor(private router: Router,
              private authService: AuthService,
              private apollo: Apollo) {
  }

  ngOnInit() {
  }

  confirm() {
    if (this.login) {
      this.apollo.mutate<CreateUserMutationResponse>({
        mutation: SIGNIN_USER_MUTATION,
        variables: {
          email: this.email,
          password: this.password
        }
      }).subscribe((result) => {
        const id = result.data.signinUser.user.id;
        const token = result.data.signinUser.token;
        this.saveUserData(id, token);

        this.router.navigate(['/']);

      }, (error) => {
        alert(error)
      });
    } else {
      this.apollo.mutate<SigninUserMutationResponse>({
        mutation: CREATE_USER_MUTATION,
        variables: {
          name: this.name,
          email: this.email,
          password: this.password
        }
      }).subscribe((result) => {
        const id = result.data.signinUser.user.id;
        const token = result.data.signinUser.token;
        this.saveUserData(id, token);

        this.router.navigate(['/']);

      }, (error) => {
        alert(error)
      })
    }
  }

  saveUserData(id: string, token: string) {
    this.authService.saveUserData(id, token);
  }
}
