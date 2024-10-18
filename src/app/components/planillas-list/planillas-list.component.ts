import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ComponentsTextToSpanishComponent } from '../../common/components-text-to-spanish/components-text-to-spanish.component';
import { StylePaginatorDirective } from '../../common/directives/style-paginator.directive';
import { filterBySearch4 } from '../../common/searchs';
import { ModalCreatePlanillaComponent } from '../modal-create-planilla/modal-create-planilla.component';
import { ModalUpdatePlanillaComponent } from '../modal-update-planilla/modal-update-planilla.component';
import { PlanillasService } from '../../services/planillas/planillas.service';
import { PdfReportPlanillasService } from '../../services/pdf-reports-planillas/pdf-report-planillas.service';

@Component({
  selector: 'app-planillas-list',
  standalone: true,
  imports: [MatButtonModule,
    FormsModule,
    CommonModule,
    StylePaginatorDirective,
    MatTableModule, MatIconModule,
    MatFormFieldModule, MatSelectModule, MatSortModule,
    RouterLink, MatTooltipModule, MatPaginatorModule],
  templateUrl: './planillas-list.component.html',
  styleUrl: './planillas-list.component.scss'
})
export class PlanillasListComponent {
  public displayedColumns: string[] = [
    'date',
    'agua',
    'claseI',
    'claseIii',
    'claseV',
    'actions',
  ];
  public dataSource: MatTableDataSource<any>;
  public planillasList: any[];
  public target;
  public uniqueIds = [];
  public noFilter = 0;
  public stateSelected = true;
  public today: any = (new Date()).toISOString();
  public isSearchSelected: boolean = false;
  public statusSelected: any = 1;
  public hoverLabelsPaginator = new ComponentsTextToSpanishComponent;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild(StylePaginatorDirective) stylePaginator: StylePaginatorDirective;

  constructor(
    private router: Router,
    private planillaService: PlanillasService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private pdfReportPlanillasService: PdfReportPlanillasService,
  ) {

  }
  ngOnInit() {
    this.target = '';
    this.paginator._intl = this.hoverLabelsPaginator.convertHoverLabelsOfPaginatorInSpanish(this.paginator);

    this.getPlanillas();
  }

  public goCheckUpDetail(checkUp: any) {
    console.log(checkUp)
    this.pdfReportPlanillasService.createPdf(checkUp.id);
  }
  public onSearchKeyUp($event: Event) {
    this.stateSelected = true;
    this.isSearchSelected = true;
    this.target = $event.target as HTMLInputElement;
    let filteredData = this.planillasList;
    this.getMatTable(filteredData);
  }

  public condition(value) {
    return value === 0
  }

  public getPlanillas() {
    this.planillaService.getPlanillas().subscribe((response: any) => {
      console.log(response)
      this.planillasList = response
      let filteredData = this.planillasList;
      this.getMatTable(filteredData);
    });

  }

  public getMatTable(filteredData: any) {
    filteredData = filterBySearch4(filteredData, this.target.value);
    this.dataSource = new MatTableDataSource(filteredData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.matSort;
    this.dataSource.paginator.length = filteredData.length;
    this.stylePaginator.buildPageNumbers(this.dataSource.paginator.getNumberOfPages());
    this.stylePaginator?.switchPage(0);
    // used to handle paginator tabs
    if (this.isSearchSelected && this.dataSource.filter.length >= 2) {
      this.isSearchSelected = false;
    }}

  public showCreatePlanillaModal() {
    const dialogRef = this.dialog.open(ModalCreatePlanillaComponent, {
      disableClose: false,
      maxWidth: '1600px',
      maxHeight: '100vh',
    });
    dialogRef.afterClosed()
      .subscribe({
        next: () => {
          this.getPlanillas();
        },
      });
  }

  public goPlanillaDetail(planilla) {
    this.router.navigate(['/planilla', planilla.id]);
  }

  public openEditModal(planilla: any): void {
    this.dialog.open(ModalUpdatePlanillaComponent, {
      data: planilla,
      maxHeight: '100vh',
      disableClose: false,
    })
      .afterClosed()
      .subscribe({
        next: () => {
          this.getPlanillas();
        }
      });
  }
}
