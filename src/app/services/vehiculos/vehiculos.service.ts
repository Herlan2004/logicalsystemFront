import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {

  constructor(
    private http: HttpClient
  ) { }
public getVehiculos() {
  return this.http.get(environment.apiUrl.concat('/vehiculo'));
}
}
