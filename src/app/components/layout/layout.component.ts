import { Component, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidenavContentComponent } from "../sidenav-content/sidenav-content.component";
import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectorRef } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@Component({
    selector: 'app-layout',
    standalone: true,
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss',
    imports: [MatSidenav, RouterOutlet, MatSidenavModule, HeaderComponent, SidenavContentComponent],
})
export class LayoutComponent {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  public role;

  constructor(private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef
  ) {
    this.role = JSON.parse(localStorage.getItem('actualRole') || '{}');
  }

  public ngAfterViewInit() {

    this.breakpointObserver.observe(['(max-width: 800px)']).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
      }
    });
    this.cdr.detectChanges();
  }

}
