import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-disconnect',
  templateUrl: './user-disconnect.component.html',
  styleUrls: ['./user-disconnect.component.scss']
})
export class UserDisconnectComponent implements OnInit {

  constructor(private authService: AuthService,
              private route: Router) { }

  ngOnInit(): void {
      this.authService.signOut();
      this.route.navigate(['/']);
  }

}
