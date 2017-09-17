import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'hn-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  logged: boolean = false;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.isAuthenticated
      .distinctUntilChanged()
      .subscribe(isAuthenticated => {
        this.logged = isAuthenticated
      });

  }

  logout() {
    this.authService.logout();
  }
}
