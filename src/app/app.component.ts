import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth.service';

@Component({
  selector: 'hn-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private authService: AuthService) {

  }

  ngOnInit(): void {
    this.authService.autoLogin();
  }
}
