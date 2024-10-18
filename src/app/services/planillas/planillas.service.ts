import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanillasService {

  constructor(
    private http: HttpClient
  ) { }
public getPlanillas() {
  return this.http.get(environment.apiUrl.concat('/planilla'));
}
public createPlanilla(payload: any) {
  console.log(payload)
  return this.http.post(`${environment.apiUrl}/planilla`, payload);
}
public getPlanillaById(id: string) {
  return this.http.get(`${environment.apiUrl}/planilla/${id}`);
}
public updatePlanilla(payload: any, updatedPlanilla: any) {
  console.log(payload)
  return this.http.post(`${environment.apiUrl}/planilla`, payload);
}

}
