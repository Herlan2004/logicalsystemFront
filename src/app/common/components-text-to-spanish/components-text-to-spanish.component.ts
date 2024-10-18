import { Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-components-text-to-spanish',
  standalone: true,
  imports: [],
  templateUrl: './components-text-to-spanish.component.html',
  styleUrl: './components-text-to-spanish.component.scss'
})
export class ComponentsTextToSpanishComponent implements OnInit {
  constructor(
  ) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  public convertHoverLabelsOfPaginatorInSpanish(paginator: MatPaginator){
    paginator._intl.itemsPerPageLabel = 'Mostrar';
    paginator._intl.firstPageLabel = 'Primera página';
    paginator._intl.previousPageLabel = 'Página anterior';
    paginator._intl.nextPageLabel = 'Página siguiente';
    paginator._intl.lastPageLabel = 'Ultima página';
    return paginator._intl;
  }
}
