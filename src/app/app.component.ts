import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  router : string;
  showHeader : boolean;
  constructor(private authService: AuthService, private _router: Router) {

  }
  ngOnInit(): void {
    this.authService.autoAuthUser();
    this.router = this._router.url;
  }

}
