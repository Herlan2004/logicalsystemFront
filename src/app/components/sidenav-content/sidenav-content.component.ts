import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { routes } from '../../app.routes';

@Component({
  selector: 'app-sidenav-content',
  standalone: true,
  imports: [MatMenuModule,MatIconModule,MatButtonModule,MatDividerModule, RouterLink],
  templateUrl: './sidenav-content.component.html',
  styleUrl: './sidenav-content.component.scss'
})
export class SidenavContentComponent {

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
  ) { }



}
