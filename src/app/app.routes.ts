import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { PlanillasListComponent } from './components/planillas-list/planillas-list.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
          path: 'spreadsheets',
          component: PlanillasListComponent
      },
      {
        path: '',
        redirectTo: 'spreadsheets', // Redirige la ruta raíz a 'spreedsheets'
        pathMatch: 'full' // Asegúrate de que la coincidencia sea exacta
      },
    ]
  }
]
