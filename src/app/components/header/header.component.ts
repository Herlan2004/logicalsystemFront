import { Component, Input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatDividerModule } from '@angular/material/divider'
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list'
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav'
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ MatToolbarModule, MatIcon, MatMenuModule, MatDividerModule, MatListModule, MatSidenavModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {

  @Input() inputSideNav!: MatSidenav;


  public optionsDropDownMenu = [
    {
      label: 'Mi perfil',
      url: '/profile'
    }
  ];

  public headTrainer: any;
  public apiResponsePeriods!: any[];
  public uniqueIds = [];
  public periodsInfo!: [];
  daysToShowNotification = 5;
  hourFinalToShowNotification = 1439;

  constructor(
    private route: Router,
    private snackBar: MatSnackBar,
  ) {
  }

}

