import { Component, Inject } from '@angular/core';

import { MENU_ITEMS, MENU_ITEMS_CUSTOMER } from './main-pages-menu';
import { AuthService } from '../auth.service';
import { NbAuthService } from '@nebular/auth';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['main-pages.component.scss'],
  template: `
    <ngx-sample-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
})
export class MainPagesComponent {

  menu;
//  user: any;

  constructor(@Inject(AuthService) private myAuthService, @Inject(NbAuthService) private authService) {

    const checkUser = localStorage.getItem('user_type');
    let sessionUser = null;

    if (checkUser && checkUser != '' && checkUser != undefined) {
      console.log(checkUser);
      if (checkUser === 'administrator') {
        this.menu = MENU_ITEMS;
      }
      else if (checkUser === 'authenticated') {
        this.menu = MENU_ITEMS_CUSTOMER;
      }
    }
    else {
      this.authService.onTokenChange()
      .subscribe(async (token: any) => {

        if (token.isValid()) {
          sessionUser = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable 
        }
        console.log(sessionUser)
      //  await localStorage.setItem('user_id', this.user.id);
        this.myAuthService.getUser(sessionUser.id).subscribe((user) => {
          console.log(user);
          localStorage.setItem('user_id', user.id);
          localStorage.setItem('user_type', user.role.type);
          const checkUser = localStorage.getItem('user_type');
          if (checkUser === 'administrator') {
            this.menu = MENU_ITEMS;
          }
          else if (checkUser === 'authenticated') {
            this.menu = MENU_ITEMS_CUSTOMER;
          }
        });
      });
    }



    //  const userData = localStorage.getItem('user_type');  
    //  console.log(userData);
    //  if(userData==='administrator') 
    //  {
    //    this.menu = MENU_ITEMS;
    //  } 
    //  else if(userData==='authenticated') 
    //  {
    //    this.menu = MENU_ITEMS_CUSTOMER;
    //  } 
  }




}
